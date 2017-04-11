<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');

    $sub = $_POST["sub"];
    MySQL::Query("INSERT INTO statistic_clicksubcategory (subcategory) VALUES ($sub)");
?>