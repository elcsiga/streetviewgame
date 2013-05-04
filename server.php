<?php 
  include('config.php');
  require 'vendor/autoload.php';
  $settings = new Settings();

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
  
  $table = isset($_GET["table"]) ? $_GET["table"] : "puzzles";
  $primaryId = ($table == "users") ? "userId" : "id";

  //////////////////////////////////


  function insertRecord($table, $rec) {
   
    $keys = array();
    $values = array();
    
    foreach ($rec as $key => $value) {
      $keys[] = "`$key`";
      $values[] = "'$value'";
    }
    mysql_query("INSERT INTO `$table` (".implode(",",$keys).") VALUES (".implode(",",$values).")"); 

    if ($table == "puzzles")
      createThumbnail($rec, mysql_insert_id());
  }

  function updateRecord($table, $rec, $id, $primaryId) {
    $pairs = array();
    foreach ($rec as $key => $value)
      $pairs[] = " `$key` = '$value'";
    
    mysql_query("UPDATE `$table` SET ".implode(",",$pairs)." WHERE `$primaryId` = '$id'");

    if ($table == "puzzles")
      createThumbnail($rec, $id);
  }
  
  function deleteRecord($table, $id, $primaryId) {
    mysql_query("DELETE FROM `$table` WHERE `$primaryId` = '$id'");
  }   

  //////////////////////////////////



$app = new \Slim\Slim();
$app->get('/puzzle/:id', function ($id) {
    echo "Hello, $id";
  });
$app->run();

function ignore() {  
  if (isset($_GET["insert"])) {
    insertRecord($table, $_POST);
    die("OK");
  }  
  if (isset($_GET["modify"])) {
    updateRecord($table, $_POST, $_GET["modify"], $primaryId);
    die("OK");
  }  
  if (isset($_GET["replace"])) {
    $id = $_GET["replace"];
    $result = mysql_query( "SELECT `$primaryId` FROM `$table` WHERE `$primaryId` = '$id'" );
    $n = mysql_num_rows ( $result );
    if ($n == 0)
      insertRecord($table, $_POST);
    else if ($n == 1)
      updateRecord($table, $_POST, $_GET["replace"], $primaryId);
    else
      die ("ERROR");
         
    if ($table == "puzzles")
      createThumbnail($_POST, $id);
    
    die("OK");
  }  
  if (isset($_GET["delete"])) {
    deleteRecord ($table, $_GET["delete"], $primaryId);
    die("OK");
  }  
  //////////////////////////////////
  
  $filter = "";
  
  if ( isset($_GET["view"]) )
   $filter = " WHERE `$primaryId` = '".$_GET["view"]."' " ;
  if ( isset($_GET["puzzleFilter"]) )
   $filter = " WHERE `puzzleId` = '".$_GET["puzzleFilter"]."' " ;
  if ( isset($_GET["userFilter"]) )
   $filter = " WHERE `userId` = '".$_GET["userFilter"]."' " ;

  $userJoin = ($table != "users") ? " INNER JOIN `users` ON `$table`.`userId` = `users`.`userId` " : "";
 
  $q = "SELECT * FROM `$table`$userJoin $filter ORDER BY `$table`.`$primaryId` DESC";

  $result = mysql_query($q);
  
  $records = array();
  while($row = mysql_fetch_object($result)){ 
   
    $keys = array();
    $obj = array();
    foreach ($row as $key => $value)
       if (!in_array($key,$keys))
         $obj[$key] = $value;
   
    $records[] = json_encode ( $obj );
  }

  print "[\n".implode (",\n", $records)."\n]";
}
?>