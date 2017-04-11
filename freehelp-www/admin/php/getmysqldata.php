<?php

$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");

require_once("../../common/php/base.php");

$sql = $_POST["sql"];
$type = $_POST["type"];
$data = "";
if ($type == "tsv")
{
    $data = TSV::QueryAsTSV($sql);
}
else
{
    $data = MySQL::QueryAsJSon($sql);   
}

$data = $data;
echo($data);
?>