<?php

require_once("../../../common/php/base.php");

$min = isset($_POST['min']) ? $_POST['min'] : '2000-01-01 00:00:00';
$max = isset($_POST['max']) ? $_POST['max'] : '2100-01-01 23:59:59';

$sql = "SELECT DAY(date) AS dia, MONTH(date) AS mes, YEAR(date) AS ano FROM statistic_appaccess WHERE (date BETWEEN '$min' AND '$max')";

$result = MySQL::QueryAsJson($sql);

echo $result;
?>