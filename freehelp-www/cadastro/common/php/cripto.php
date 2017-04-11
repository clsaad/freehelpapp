<?php 
error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin: *'); 
?>

<?php

    require_once("mysql.php");
    require_once("spy.php");

    $table = "user";
    $campos = "mail, cpf, password, how, temppassword";

    $query = "SELECT id, $campos FROM $table WHERE 1=1";
    $result = MySQL::Query($query);

    
    if ($result->num_rows > 0) 
    {
      $json = "{\"data\":[";
      $arrcount = 0;
      while($row = $result->fetch_assoc())
      {
          $vars = "";   
          foreach ($row as $key => $value) 
          {
              if ($vars != "") $vars .= ", ";
              
              $val = $row[$key];
              $val = SPY::Decode($val);
              
              $vars .= $key . "='" . $val . "'";

          }
          
          $id = $row['id'];
          $query = "UPDATE $table SET $vars WHERE id=$id";
          MySQL::Query($query);
          if ($query != NULL) echo("$query<br>");
      }
    }

echo(":)");
?>