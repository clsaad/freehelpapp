<?php

function getaddress($lat,$lng)
{
     $url = 'http://maps.googleapis.com/maps/api/geocode/json?latlng='.trim($lat).','.trim($lng).'&sensor=false';
     $json = @file_get_contents($url);
     $data=json_decode($json);
     $status = $data->status;
    
     if($status=="OK")
     {
       return $data->results[0]->formatted_address;
     }
     else
     {
       return 0;
     }
}

// function to geocode address, it will return false if unable to geocode address
function getfulldata($address){
 
    // url encode the address
    $address = urlencode($address);
     
    // google map geocode api url
    $url = "http://maps.google.com/maps/api/geocode/json?address={$address}";
 
    // get the json response
    $resp_json = file_get_contents($url);
     
    // decode the json
    $resp = json_decode($resp_json, true);
 
    // response status will be 'OK', if able to geocode given address 
    if($resp['status']=='OK'){
 
        // get the important data
        $lati = $resp['results'][0]['geometry']['location']['lat'];
        $longi = $resp['results'][0]['geometry']['location']['lng'];
        $formatted_address = $resp['results'][0]['formatted_address'];
         
        // verify if data is complete
        if($lati && $longi && $formatted_address){
         
            /*
            // put the data in the array
            $data_arr = array();            
             
            array_push(
                $data_arr, 
                    $lati, 
                    $longi, 
                    $formatted_address
                );
            */
             
            return "{\"lat\":$lati,\"lon\":$longi,\"address\":\"$formatted_address\"}";
             
        }else{
            return 0;
        }
         
    }else{
        return 0;
    }
}

$fromAdress = isset($_POST['address']) ? TRUE : FALSE;

if ($fromAdress)
{
    $address = $_POST['address'];
    
    echo(getfulldata($address));
}
else
{
    $lat = $_POST['latitude'];
    $lon = $_POST['longitude'];
    
    echo(getaddress($lat, $lon));
}


?>