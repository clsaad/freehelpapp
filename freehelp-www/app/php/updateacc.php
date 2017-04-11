<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
?>

<?php

    require_once('../../common/php/mysql.php');

    $name = $_POST["name"];
    $mail = $_POST["mail"];

    // UPDATE NAME
    MySQL::Query("UPDATE appuser SET name='" . $name . "' WHERE login='$mail' AND type=0");

    // UPDATE PASSWORD
    if (isset($_POST["pass"]))
    {
        $pass = $_POST["pass"];
        MySQL::Query("UPDATE appuser SET password='" . $pass . "' WHERE login='$mail' AND type=0");
    }

    echo("1");
?>
