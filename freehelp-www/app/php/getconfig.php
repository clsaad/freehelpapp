<?php 
    //error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 

    require_once('../../common/php/mysql.php');
?>
<?php
    $json  = MySQL::QueryAsJson("SELECT * FROM appconfig WHERE 1=1");
    echo($json);
?>