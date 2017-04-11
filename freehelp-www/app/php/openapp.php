<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');

    $os = $_POST["os"];
    MySQL::Query("INSERT INTO statistic_appaccess (os, ip) VALUES ('$os', '" . getIP() . "')");
?>