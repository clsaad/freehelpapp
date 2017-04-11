<?php

require_once("../../common/php/base.php");
$table = $_POST["table"];
$id = $_POST["id"];
$sql = "DELETE FROM $table WHERE id=$id LIMIT 1";
MySQL::Query($sql);
echo("1");
?>