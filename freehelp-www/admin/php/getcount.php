<?php
$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");

require_once("../../common/php/base.php");
$sql = $_POST["sql"];
$count = MySQL::Count($sql);
$retorno = $count;
if (isset($_POST["prefix"])) $retorno = $_POST["prefix"] . $retorno;
echo($retorno);
?>