<?php 
//error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin: *'); 

$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");

require_once("../../common/php/mysql.php");

    $userid = $_POST["userid"];
    $usermail = $_POST["usermail"];

    if (isset($userid) == TRUE)
    {
        $query = "SELECT * FROM user WHERE id=$userid LIMIT 1";
    }
    else
    {
        $query = "SELECT * FROM user WHERE mail='$usermail' LIMIT 1";  
    }

    $result = MySQL::Query($query);

    $row = $result->fetch_assoc();
    $id = $row['id'];
    //print_r($row);
    $rowcount = MySQL::Count( "SELECT * FROM service WHERE userid=$id" );

    $json = MySQL::QueryAsJson($query);
    echo($rowcount . $json);

?>