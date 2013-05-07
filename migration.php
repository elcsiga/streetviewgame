<?php
require_once('config.php');
$settings = new Settings();
function migrate1($settings){
  $sql = mysql_connect($settings->dbhost,$settings->dbuser,$settings->dbpassword) or die ("Nem tudok kapcsolódni!");
  mysql_selectdb($settings->db, $sql);
  $result = mysql_query("select * from users");
  if ($result) 
    while($row = mysql_fetch_object($result)){
      $t = $row->resolves;
      $userId = $row->userId;
      if ($t) {
	foreach (json_decode($t) as $key => $value) {
	  $score = $value->score;	  	  
	  $query = "INSERT INTO guesses (score,type,puzzleId,userId) values ($score,1,$key,'$userId')";
	  mysql_query($query);
	  echo $query . "\n";
	}
      }
    }  
}

      //migrate1($settings);
?>