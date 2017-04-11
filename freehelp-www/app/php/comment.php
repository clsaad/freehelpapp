<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
?>


<?php

require_once('../../common/php/mysql.php');

/*
$_POST["serviceid"] = 1;
$_POST["userid"] = 1;
$_POST["text"] = "Bacana...";
$_POST["stars"] = 2;
*/

$serviceid = $_POST["serviceid"];
$userid = $_POST["userid"];
$text = $_POST["text"];
$stars = $_POST["stars"];

$delete = "DELETE FROM comment WHERE userid=$userid AND serviceid=$serviceid";
MySQL::Query($delete);

$query = "INSERT INTO comment (serviceid, userid, text, stars) VALUES ($serviceid, '$userid', '$text', $stars)";
MySQL::Query($query);
echo("1");

?>
