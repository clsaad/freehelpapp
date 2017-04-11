<?php
$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");
require_once("../../common/php/base.php");
$sql = $_POST["sql"];
if (isset($_POST["encoded"]))
{
    $sql = base64_decode($sql);
}
$data = MySQL::Query($sql); 
echo("1");
?>