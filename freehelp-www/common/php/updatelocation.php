<?php


require_once("mysql.php");
require_once("spy.php");
require_once("geoapp.php");

$result = MySQL::Query("SELECT * FROM service WHERE 1=1");
if ($result != NULL && $result->num_rows > 0) 
{
  $app = new GeoApp();
  while($row = $result->fetch_assoc())
  {
      $id = $row["id"];
      $newloc = SPY::Decode($row["end_endereco"]) . " - " . SPY::Decode($row["end_numero"]) . " - " . SPY::Decode($row["end_bairro"]);
      $geo = $app->GetGeoPosition($newloc);
      echo($newloc);
      echo(" - ");
      echo($geo->latitude);
      echo(" - ");
      echo($geo->longitude);
      echo("<br>");
      $action = MySQL::Query("UPDATE service SET latitude='$geo->latitude', longitude='$geo->longitude' WHERE id=$id");
  }
}

?>
