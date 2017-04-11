<?php 
error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin: *'); 

$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");

require_once("../../common/php/mysql.php");

    $userid = $_POST["userid"];

    // MOVE USER
    $query = "INSERT INTO deleted_user SELECT * FROM user WHERE id=$userid LIMIT 1";
    $result = MySQL::Query($query);
    if ($result != NULL)
    {
        $query = "DELETE FROM user WHERE id=$userid";
        MySQL::Query($query);
    }

    // MOVE ALL SERVICES
    $query = "INSERT INTO deleted_service SELECT * FROM service WHERE userid=$userid LIMIT 1";
    $result = MySQL::Query($query);
    if ($result != NULL)
    {
        $query = "DELETE FROM service WHERE userid=$userid";
        MySQL::Query($query);
    }

    echo("1");
?>