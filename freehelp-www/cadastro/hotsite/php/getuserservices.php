<?php 
error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin: *'); 

$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");

require_once("../../common/php/mysql.php");
?>

<?php
    $userid = $_POST["userid"];;

    $query = "SELECT * FROM service WHERE userid=$userid ORDER BY id DESC";
    $json = MySQL::QueryAsJson($query);
    echo($json);
?>