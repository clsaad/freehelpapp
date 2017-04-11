<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 

    $domain = $_SERVER['SERVER_NAME'];
    require_once ("../../common/php/path.php");
    require_once("../../common/php/mysql.php");

    $id = $_POST["userid"];
    $newpass = $_POST["newpass"];

    $updateQuery = "UPDATE user SET temppassword='$newpass' WHERE id=$id";
    MySQL::Query($updateQuery);

    echo("1");

?>