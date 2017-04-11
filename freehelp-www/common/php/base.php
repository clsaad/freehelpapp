<?php

header('Content-type: text/plain; charset=utf-8');

require_once("mysql.php");
require_once("tsv.php");



function CheckConnected()
{
    if (isset($_SESSION["user"]) && isset($_SESSION["pass"]))
    {
        $user = $_SESSION["user"];
        $pass = $_SESSION["pass"];
        
        $sql = "SELECT * FROM adminuser WHERE user='$user' AND password='$pass'";
        $count = MySQL::Count($sql);
        if ($count > 0) return TRUE;
    }
    
    return FALSE;
}

?>