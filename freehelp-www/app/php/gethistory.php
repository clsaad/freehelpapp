<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');
?>

<?php

    $limit = 10;
    $appuser = $_POST['userid']; //112; // default for testing

    $distance = $_POST["distance"];
    $latitude = $_POST["latitude"];
    $longitude = $_POST["longitude"];

    $query = "SELECT *, (( 3959 * acos( cos( radians(latitude) ) * cos( radians( $latitude ) )  * cos( radians($longitude) - radians(longitude)) + sin(radians(latitude)) * sin( radians($latitude)))) * 1.60934) AS distance 
FROM appuserhistory LEFT JOIN service
ON appuserhistory.serviceid = service.id
WHERE appuserhistory.userid=$appuser
ORDER BY date DESC";

    echo( MySQL::QueryAsJson($query) );
?>
