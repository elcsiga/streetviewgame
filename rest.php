<?php 
  include('config.php');
  require 'vendor/autoload.php';
  $settings = new Settings();

class Error {
  public $message ="";
  public $details = "";
}
 
function createThumbnail($rec, $id) {
    $lat = $rec["lat"];
    $lng = $rec["lng"];
    $heading = $rec["heading"];
    $pitch = $rec["pitch"];
    
    $filename = "thumbnails/$id.jpg";
    $api_key = "AIzaSyBgJDUb2Z1RrQBw1tb47q11hGhlLKxyzTc";
    
    $url = "http://maps.googleapis.com/maps/api/streetview?size=300x100&location=$lat,$lng&heading=$heading&pitch=$pitch&sensor=false&key=$api_key";
    $image = imagecreatefromjpeg($url);
    imagejpeg($image, $filename, 100);
  }

  //////////////////////////////////
  $sql = mysql_connect($settings->dbhost,$settings->dbuser,$settings->dbpassword) or die ("Nem tudok kapcsolódni!");
  mysql_selectdb($settings->db, $sql); 
 
  //////////////////////////////////


function insertRecord($table, $rec) {  
  $keys = array();
  $values = array();
  foreach ($rec as $key => $value) {
    $keys[] = "`$key`";
    $values[] = "'" . mysql_real_escape_string($value) . "'";
  }
  if (mysql_query("INSERT INTO `$table` (".implode(",",$keys).") VALUES (".implode(",",$values).")")) {
    return mysql_insert_id();
  } else {
    return array ("error" => 'Can\'t insert record', mysql_error());
  }
}

function updateRecord($table, $rec, $id, $primaryId) {
  $pairs = array();
  foreach ($rec as $key => $value)
    $pairs[] = " `$key` = '". mysql_real_escape_string($value) . "'";
  $query = "UPDATE `$table` SET ".implode(",",$pairs)." WHERE `$primaryId` = '".mysql_real_escape_string($id)."'";
  mysql_query($query);
}

function deleteRecord($table, $id, $primaryId) {

  $query = "DELETE FROM `$table` WHERE `$primaryId` = '".mysql_real_escape_string($id)."'";
  mysql_query($query);
}   

function getRecords($query) {
  $result = mysql_query($query);
  if ($result) {
     $records = array();
     while($row = mysql_fetch_object($result)){

       $keys = array();
       $obj = array();
       foreach ($row as $key => $value) {
	 if (!in_array($key,$keys))
	   $obj[$key] = $value;
       }
       $records[] = $obj;
     }
     return $records;
  } else {
    $res = array();
    $res["query"] = $query;
    $res["error"] = mysql_error();
    return $res;
  }
}

  //////////////////////////////////


function getPuzzle($id) { 
  $query = "select puzzles.*,users.userName from puzzles left join users ON puzzles.userId = users.userId where puzzles.id = " . mysql_real_escape_string($id);
  return getRecords($query)[0];
}

function checkAnswer($answer,$puzzle){
  if ($answer == $puzzle['answer']) {
    return array("ok"=>true,"message"=>"Zsir, kiraly");
  } else {
    return array("ok"=>false,"message"=>"Nem, nem");
  }
}

$app = new \Slim\Slim();
$app->post('/puzzle/:id/solution',function($id) use ($app){
    $puzzle = getPuzzle($id);
    $s = $app->request()->getBody();
    $data = json_decode($s,true);
    $check = checkAnswer($data['answer'],$puzzle);
    $data['puzzleId'] = $id;
    if ($check["ok"]){
      $data['type'] = 1;
    } else {
      $data['type'] = 0;
    }
    list($usec, $sec) = explode(" ", microtime());
    //    $data['date'] = $sec . $usec . "000";
    $id = insertRecord('guesses',$data);
    $check['id'] = $id;
    echo json_encode($check);    
  });
$app->get('/puzzle/:id', function ($id) {
    echo json_encode(getPuzzle($id),JSON_PRETTY_PRINT);
  });
$app->get('/puzzle/:id/thumbnail', function($id) use ($app) {
    if (!file_exists('thumbnails/' . $id )) {
        $rec =  getPuzzle($id);
        createThumbnail($rec,$id);
    }
    $app->response()->redirect('/thumbnails/'.$id.'.jpg', 303);
  });
$app->get('/puzzles', function() use ($app){
    $userId = $app->request()->params("userId");
    if (!$userId) {
      $query = "select puzzles.*,users.userName from puzzles left join users ON  puzzles.userId = users.userId";
    } else {
      $query = "select distinct puzzles.*,guesses.score from puzzles left join guesses on guesses.puzzleId = puzzles.id and guesses.userId='".mysql_real_escape_string($userId)."' and type = 1 order by guesses.type asc,puzzles.date asc";
    }

    echo json_encode(getRecords($query));
  });
$app->post('/puzzle', function() use ($app) {
    $s = $app->request()->getBody();
    $data = json_decode($s,true);
    $id = insertRecord('puzzles',$data);
    echo json_encode(array('id'=> $id));    
  });

$app->put('/puzzle/:id', function ($id) use ($app) {
    $user = $app->request()->params();
    updateRecord('puzzles',$user,$id,'id');
    echo json_encode(getPuzzle($id),JSON_PRETTY_PRINT);
  });
$app->delete('/puzzle/:id', function($id) {
    deleteRecord('puzzles',$id,'id');
  });

$app->get('/user/:id', function ($id) {
    $query = "select users.*,sum(guesses.score) as score,count(guesses.score) as solved from users left join guesses on guesses.userId = users.userId and guesses.type=1 where users.userId = '" . mysql_real_escape_string($id) . "'";
    $res = getRecords($query);
    echo json_encode($res[0], JSON_PRETTY_PRINT);
  });
$app->post('/user', function() use ($app) {
    $s = $app->request()->getBody();
    $user = json_decode($s,true);
    $id = insertRecord('users',$user);
    echo json_encode(array('id'=> $id));    
  });
$app->put('/user/:id', function ($id) use ($app) {
    $user = $app->request()->params();
    updateRecord('users',$user,$id,'userId');
  });
$app->get('/puzzle/:id/comment', function($id){
    echo json_encode(getRecords("select * from comments where puzzleId = " . $id),JSON_PRETTY_PRINT);
  });
$app->post('/puzzle/:id/comment', function($id) use ($app){
    $s = $app->request()->getBody();
    $data = json_decode($s,true);
    $data['puzzleId'] = $id;
    $id = insertRecord('comments',$data);
    echo json_encode(array('id'=> $id));    
  });
$app->run();



?>