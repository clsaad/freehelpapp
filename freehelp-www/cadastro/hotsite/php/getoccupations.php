<?php 
error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin: *'); 

$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");

require_once("../../common/php/mysql.php");


    $query = "SELECT * FROM occupation WHERE 1=1";        
    $json = MySQL::QueryAsJson($query);
    echo($json);
?>