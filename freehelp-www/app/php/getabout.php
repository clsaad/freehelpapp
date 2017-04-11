<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');

    $query = "SELECT value FROM appconfig WHERE id=2";

    echo( MySQL::Value($query) );
?>