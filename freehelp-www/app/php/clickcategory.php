<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');

    $cat = $_POST["cat"];
    MySQL::Query("INSERT INTO statistic_clickcategory (category) VALUES ($cat)");
?>