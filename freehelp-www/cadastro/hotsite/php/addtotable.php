<?php 
error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin: *'); 

$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");

require_once("../../common/php/mysql.php");


    $table = $_POST["table"];
    $vars = "";
    $values = "";
    $count = 0;


try {
    
    if ($_POST["location"] != NULL)
    {
        require_once("../../../cadastro/hotsite/php/geoapp.php");
        $location = $_POST["location"];
        $app = new GeoApp();
        $geo = $app->GetGeoPosition($location);
        $_POST["latitude"] = $geo->latitude;
        $_POST["longitude"] = $geo->longitude;
    }

    foreach ($_POST as $param_name => $param_val) 
    {
        if ($param_name != "table")
        {
            if ($count > 0) $vars .= ', ';
            $vars .= $param_name;

            if ($count > 0) $values .= ', ';
            $values .= "'" . utf8_decode($param_val) . "'";
            $count++;
        }
    }
    
    $query = "INSERT INTO $table ($vars) VALUES ( $values )";
    MySQL::Query($query);
    
    echo("1");
    
} catch (Exception $e) {
    echo("0");
}

?>