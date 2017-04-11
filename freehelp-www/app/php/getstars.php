<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
?>

<?php

require_once('../../common/php/mysql.php');


function GetStars($serviceid)
{
    $query = "SELECT stars FROM comment WHERE serviceid=$serviceid";
    $result = MySQL::Query($query);

    $total = 0;
    $count = 0;

    if ($result != NULL && $result->num_rows > 0) 
    {
      while($row = $result->fetch_assoc())
      {
          $total += $row["stars"];
          $count++;
      } 
    }

    if ($count == 0) return 0;

    return ($total / $count);
}

echo( GetStars($_POST["serviceid"]) );

?>