<?php 
error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin: *'); 
?>

<?php


require_once("mysql.php");

class GeoPosition
{ 
    public $address = "";
    public $latitude = 0;
    public $longitude = 0;
}

class GeoApp
{ 
    function AddUser($name, $mail, $pass)
    {
        if ($this->CheckLogin($mail) != 0) return 0;
        $query = "INSERT INTO user (name, mail, password) VALUES ('" . $name . "', '" . $mail . "', '" . $pass . "')";
        MySQL::Query($query);
        return 1;
    }
    
    function CheckLoginPassword($mail, $pass)
    {
        $rowcount = MySQL::Count("SELECT * from user WHERE mail='$mail' AND password='$pass'");
        return $rowcount;
    }
    
    function CheckLogin($mail)
    {
        $rowcount = MySQL::Count("SELECT * from user WHERE mail='$mail'");
        return $rowcount;
    }
    
    function GetDistanceBetweenPoints($latitude1, $longitude1, $latitude2, $longitude2, $unit = 'Km') {
         $theta = $longitude1 - $longitude2;
         $distance = (sin(deg2rad($latitude1)) * sin(deg2rad($latitude2))) + (cos(deg2rad($latitude1)) * cos(deg2rad($latitude2)) * cos(deg2rad($theta)));
         $distance = acos($distance);
         $distance = rad2deg($distance);
         $distance = $distance * 60 * 1.1515; 
         switch($unit) {
              case 'Mi': break; case 'Km' : $distance = $distance * 1.609344;
         }
         return (round($distance,2));
    }
    
    function AddService($userid, $name, $location, $tel, $text, $category, $subcategory)
    {
        $geo = $this->GetGeoPosition($location);
        
        $query = "INSERT INTO service (userid, name, location, latitude, longitude, tel, text, category, subcategory) VALUES ($userid, '$name', '$location', '$geo->latitude', '$geo->longitude', '$tel', '$text', '$category', '$subcategory')";
        MySQL::Query($query);
    }
    
    function GetGeoPosition($address)
    {
        $geo = new GeoPosition();
        $geo->address = $address;
        $address = urlencode($address);
        $request_url = "http://maps.googleapis.com/maps/api/geocode/xml?address=".$address."&sensor=true";
        $xml = simplexml_load_file($request_url) or die("url not loading");
        $status = $xml->status;
        
        if ($status == "OK") {
            $Lat = $xml->result->geometry->location->lat;
            $Lon = $xml->result->geometry->location->lng;
            $geo->latitude = $Lat;
            $geo->longitude = $Lon;
        }  
        
        return $geo;
    }
    
    function GetNear($location, $subcategory, $distance)
    {
        $geo = $this->GetGeoPosition($location);
        $latitude = (float)($geo->latitude);
        $longitude = (float)($geo->longitude);
        return $this->GetGeoNear($latitude, $longitude, $subcategory, $distance);
    }
    
    function GetGeoNear($latitude, $longitude, $subcategory, $distance)
    {
        $query = "SELECT *, (( 3959 * acos( cos( radians(latitude) ) * cos( radians( $latitude ) )  * cos( radians($longitude) - radians(longitude)) + sin(radians(latitude)) * sin( radians($latitude)))) * 1.60934) AS distance FROM service HAVING distance <= $distance AND subcategory=$subcategory";
        
        $result = MySQL::Query($query);
        $json = "0";
        
        if ($result->num_rows > 0) 
        {
          $json = "{\"data\":[";
          $arrcount = 0;
          while($row = $result->fetch_assoc())
          {
              if ($arrcount > 0) $json .= ",";
              $json .= "{";
              $count = 0;
              foreach ($row as $key => $value) 
              {
                  $val = $row[$key];
                  if ($count > 0) $json .= ", ";
                  $json .= "\"$key\":\"$val\"";
                  $count++;
              }
              $json .= "}";
              $arrcount++;
          }
          $json .= "]}";
        }
        
        return $json;
    }
    
    
    function MySQLQuery($query)
    {
        return MySQL::Query($query);
    }
}


//$db = new GeoApp();
//$db->AddUser("Leandro", "leandro@reloadgamestudio.com", "batatinha");
//$db->AddUser("Caio", "caio@reloadgamestudio.com", "caio");
//$db->CheckLoginPassword("leandro@reloadgamestudio.com", "batatinha");

// ADD MINHA CASA
//$db->AddService(1, "Rua Tuiuti, 589, São Paulo, SP", "2205-0331", "Club Tuiuti");
//$db->AddService(2, "Rua Santa Branca, 440, Caraguatatuba, SP", "12 99707-7185", "Caragua");

// RELOAD
// -23.5250610,-46.6946550

// TUIUTI
// -23.5302240,-46.5756940

//$distance = $db->GetDistanceBetweenPoints(-23.5250610,-46.6946550, -23.5302240,-46.5756940);
//echo $distance;

// MINHA CASA
//$geo = $db->GetGeoPosition("Rua Clélia, 1251, São Paulo, SP");

// NEAR
//echo $db->GetDistanceBetweenPoints(-23.5250610,-46.6946550, -23.5302240,-46.5756940);
//$db->GetNear("Rua Clélia, 1251, São Paulo, SP", 20);


// CASA DO CAIO
// $db->GetGeoPosition("Rua Santa Branca, 440, Caraguatatuba, SP");

?>
