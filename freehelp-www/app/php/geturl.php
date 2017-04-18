<?php 
    //error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 

    require_once('../../common/php/mysql.php');
?>
<?php
    $json  = MySQL::QueryAsJson("SELECT * FROM appconfig WHERE lower(substr(name,1,4)) in ('url_')");
    echo(utf8_encode($json));
?>