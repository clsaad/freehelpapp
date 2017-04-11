<?php

require_once("../../../common/php/base.php");

$min = isset($_POST['min']) ? $_POST['min'] : '2000-01-01 00:00:00';
$max = isset($_POST['max']) ? $_POST['max'] : '2100-01-01 23:59:59';

$type = isset($_POST['type']) ? $_POST['type'] : 'service';


if ($type == 'service')
{
    $sql = "SELECT DAY(date) AS dia, MONTH(date) AS mes, YEAR(date) AS ano, service.id, service.name FROM statistic_clickservice LEFT JOIN service ON service.id=statistic_clickservice.service WHERE (date BETWEEN '$min' AND '$max')";
}
else if ($type == 'category')
{
    $sql = "SELECT DAY(date) AS dia, MONTH(date) AS mes, YEAR(date) AS ano, category.id, category.name FROM statistic_clickcategory LEFT JOIN category ON category.id=statistic_clickcategory.category WHERE (date BETWEEN '$min' AND '$max')";
}
else if ($type == 'subcategory')
{
    $sql = "SELECT DAY(date) AS dia, MONTH(date) AS mes, YEAR(date) AS ano, subcategory.id, subcategory.name FROM statistic_clicksubcategory LEFT JOIN subcategory ON subcategory.id=statistic_clicksubcategory.subcategory WHERE (date BETWEEN '$min' AND '$max')";
}
else if ($type == "acessoapp")
{
    $sql = "SELECT DAY(date) AS dia, MONTH(date) AS mes, YEAR(date) AS ano, os as name FROM statistic_appaccess WHERE (date BETWEEN '$min' AND '$max')";
}
else if ($type == "cadastroapp")
{
    $sql = "SELECT DAY(date) AS dia, MONTH(date) AS mes, YEAR(date) AS ano, os as name FROM statistic_appsignup WHERE (date BETWEEN '$min' AND '$max')";
}
else if ($type == "cadastrofornecedor")
{
    $sql = "SELECT DAY(date) AS dia, MONTH(date) AS mes, YEAR(date) AS ano, os as name FROM statistic_usersignup WHERE (date BETWEEN '$min' AND '$max')";
}
else if ($type == "cadastroservice")
{
    $sql = "SELECT DAY(date) AS dia, MONTH(date) AS mes, YEAR(date) AS ano, os as name FROM statistic_serviceregister WHERE (date BETWEEN '$min' AND '$max')";
}

$result = MySQL::QueryAsJson($sql);

echo $result;
?>