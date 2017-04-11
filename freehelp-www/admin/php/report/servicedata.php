<?php

require_once("../../../common/php/base.php");

$min = isset($_POST['min']) ? $_POST['min'] : '2000-01-01 00:00:00';
$max = isset($_POST['max']) ? $_POST['max'] : '2100-01-01 23:59:59';

$sql = "SELECT category1, category2, category3 FROM service WHERE 1=1";
$result = MySQL::Query($sql);

$arr = array();

if ($result != NULL && $result->num_rows > 0) 
{
  while($row = $result->fetch_assoc())
  {
      foreach ($row as $key => $value) 
      {
          if ($value != 0)
          {
              if (isset($arr[$value]) == false)
              {
                  $arr[$value] = 0;
              }

              $arr[$value]++;
          }
      }
  }
  $json .= "]}";
}


$sql = "SELECT id, name FROM category WHERE 1=1";
$result = MySQL::Query($sql);

$catNames = array();

if ($result != NULL && $result->num_rows > 0) 
{
  while($row = $result->fetch_assoc())
  {
      $catNames[$row["id"]] = $row["name"];
  }
  $json .= "]}";
}

$str = "{\"data\":[";

$count = 0;
foreach ($arr as $key => $value) 
{
    if ($count != 0) $str .= ", ";
    $name = $catNames[$key];
    $str .= "{\"categoria\":\"$name\", \"serviços\":$value}";
    $count++;
}

$str .= "]}";

echo $str;

?>