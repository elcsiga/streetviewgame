<?php
class PuzzleTest extends PHPUnit_Framework_TestCase
{
  public static $id;

  public function testCreate()
  {
    $host = "localhost";
    $sample = file_get_contents('sample-data/new-puzzle.json');
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, $host . "/rest.php/puzzle"); 
    curl_setopt($ch, CURLOPT_POST, 1);

    curl_setopt($ch, CURLOPT_POSTFIELDS, $sample);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($ch);

    $result = curl_getinfo($ch);
    curl_close($ch);
    echo $output;
    echo "\n";

    $this->assertEquals(200, $result['http_code']);

    $response = json_decode($output,true);
    $this->assertEquals(JSON_ERROR_NONE, json_last_error());
    echo "New id " . $response['id'];
    PuzzleTest::$id = $response['id'];


  }

  public function testSelect()
  {
    $host = "localhost";

    $ch = curl_init(); 
    echo PuzzleTest::$id;
    curl_setopt($ch, CURLOPT_URL, $host . "/rest.php/puzzle/".PuzzleTest::$id); 
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($ch);

    $result = curl_getinfo($ch);
    curl_close($ch);
    echo $output;
    echo "\n";

    $this->assertEquals(200, $result['http_code']);

    $response = json_decode($output,true);
    $this->assertEquals(JSON_ERROR_NONE, json_last_error());
    $this->assertEquals("budapest",$response['label']);

  }

  public function testSolveWrong()
  {
    $host = "localhost";
    $sample = file_get_contents('sample-data/guess-wrong.json');
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, $host . "/rest.php/puzzle/" . PuzzleTest::$id . "/solution"); 
    curl_setopt($ch, CURLOPT_POST, 1);

    curl_setopt($ch, CURLOPT_POSTFIELDS, $sample);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($ch);

    $result = curl_getinfo($ch);
    curl_close($ch);
    echo "response:\n";
    echo $output;
    echo "\n";

    $this->assertEquals(200, $result['http_code']);

    $response = json_decode($output,true);
    $this->assertEquals(JSON_ERROR_NONE, json_last_error());


  }

  public function testSolveGood()
  {
    $host = "localhost";
    $sample = file_get_contents('sample-data/guess-good.json');
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, $host . "/rest.php/puzzle/" . PuzzleTest::$id . "/solution"); 
    curl_setopt($ch, CURLOPT_POST, 1);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $sample);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($ch);

    $result = curl_getinfo($ch);
    curl_close($ch);
    echo "response:\n";
    echo $output;
    echo "\n";

    $this->assertEquals(200, $result['http_code']);

    $response = json_decode($output,true);
    $this->assertEquals(JSON_ERROR_NONE, json_last_error());


  }

  public function testDelete()
  {
    $host = "localhost";
    $ch = curl_init(); 
    curl_setopt($ch, CURLOPT_URL, $host . "/rest.php/puzzle/" . PuzzleTest::$id); 
    curl_setopt($ch, CURLOPT_CUSTOMREQUEST, "DELETE");
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    $output = curl_exec($ch);

    $result = curl_getinfo($ch);
    curl_close($ch);
    echo "response:\n";
    echo $output;
    echo "\n";

    $this->assertEquals(200, $result['http_code']);

    $response = json_decode($output,true);
    $this->assertEquals(JSON_ERROR_NONE, json_last_error());


  }
}
?>