<?php 
error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin: *'); 

require_once("../../common/php/mysql.php");
require_once("../../common/php/ImageResize.php");
require_once("../../common/php/geoapp.php");

function ResizeImage($file, $new_w, $new_h)
{   
    $image = file_get_contents($file);
    list($org_w, $org_h) = getimagesize($file);
    
    if ($new_w != NULL && $new_h != NULL)
    {
        $image = imagecreatefromstring ($image);

        // Resample
        $image_p = imagecreatetruecolor($new_w, $new_h);
        imagecopyresampled($image_p, $image, 0, 0, 0, 0, $new_w, $new_h, $org_w, $org_h);

        // Buffering
        ob_start();
        imagejpeg($image_p);
        $data = ob_get_contents();
        ob_end_clean();

        imagedestroy($image);
        //$data = addslashes( $data );
    }
    else
    {
        //$data = addslashes( $image );   
    }
    
    // CONVERT TO BASE 64, REMOVE THIS TO SAVE AS BLOB
    $data = base64_encode($data);
    
    return $data;
}

function DistanceInKM($lat1, $lon1, $lat2, $lon2)
{
    $pi = pi();

    $R = 6371; // Radius of the earth in km
    $dLat = ($lat2-$lat1) * $pi / 180.0;  // Javascript functions in radians
    $dLon = ($lon2-$lon1) * $pi / 180.0; 
    $a = sin($dLat/2.0) * sin($dLat/2.0) +
    cos($lat1 * $pi / 180.0) * cos($lat2 * $pi / 180.0) * 
    sin($dLon/2.0) * sin($dLon/2.0); 
    $c = 2.0 * atan2(sqrt($a), sqrt(1.0-$a)); 
    $d = $R * $c; // Distance in km
    return $d;
}

   
    $userid = $_POST["userid"];
    $name = ( $_POST["name"] );
    $category1 = $_POST["category1"];
    $subcategory1 = $_POST["subcategory1"];
    $occupation1 = $_POST["occupation1"];
    $category2 = $_POST["category2"];
    $subcategory2 = $_POST["subcategory2"];
    $occupation2 = $_POST["occupation2"];
    $category3 = $_POST["category3"];
    $subcategory3 = $_POST["subcategory3"];
    $occupation3 = $_POST["occupation3"];
    $celular = $_POST["celular"];
    $telefone = $_POST["telefone"];
    $site = $_POST["site"];
    $mail = $_POST["mail"];
    $description = ( $_POST["description"] );
    $end_cep = ( $_POST["end_cep"] );
    $end_endereco = ( $_POST["end_endereco"] );
    $end_numero = ( $_POST["end_numero"] );
    $end_bairro = ( $_POST["end_bairro"] );
    $end_complemento = ( $_POST["end_complemento"] );
    
    $latitude = "0";
    $longitude = "0";

    $serviceid = $_POST["serviceid"];
    $delete = $_POST["delete"];
    $update = $_POST["update"];


    if ($delete == "1")
    {
        // MOVE SERVICE
        $query = "INSERT INTO deleted_service SELECT * FROM service WHERE id=$serviceid";
        MySQL::Query($query);

        $query = "DELETE FROM service WHERE id=$serviceid";
        MySQL::Query($query);
        
        echo("1");
    }
   else
   {
       
       $app = new GeoApp();
       $newloc = $end_endereco . " - " . $end_numero . " - " . $end_bairro;

       $geo = $app->GetGeoPosition($newloc);
       
       $distanceFromBrasilia = DistanceInKM($geo->latitude, $geo->longitude, -15.9678775, -51.2579696);
       
       if ($distanceFromBrasilia > 2500)
       {
           echo("0");
       }
       else
       {

           $latitude = $geo->latitude;
           $longitude = $geo->longitude;

            $vars = "userid, name, category1, subcategory1, occupation1, category2, subcategory2, occupation2, category3, subcategory3, occupation3, celular, telefone, description, latitude, longitude, end_cep, end_endereco, end_numero, end_bairro, end_complemento, site, mail";

            $values = "$userid, '$name', '$category1', '$subcategory1', '$occupation1', '$category2', '$subcategory2', '$occupation2', '$category3', '$subcategory3', '$occupation3', '$celular', '$telefone', '$description', '$latitude', '$longitude', '$end_cep', '$end_endereco', '$end_numero', '$end_bairro', '$end_complemento', '$site', '$mail'";


            $updateConfig = "";
            $updateConfig .= "userid="         . $userid        . ", ";
            $updateConfig .= "name='"          . $name          . "', ";
            $updateConfig .= "category1='"     . $category1     . "', ";
            $updateConfig .= "subcategory1='"  . $subcategory1  . "', ";
            $updateConfig .= "occupation1='"   . $occupation1   . "', ";
            $updateConfig .= "category2='"     . $category2     . "', ";
            $updateConfig .= "subcategory2='"  . $subcategory2  . "', ";
            $updateConfig .= "occupation2='"   . $occupation2   . "', ";
            $updateConfig .= "category3='"     . $category3     . "', ";
            $updateConfig .= "subcategory3='"  . $subcategory3  . "', ";
            $updateConfig .= "occupation3='"   . $occupation3   . "', ";
            $updateConfig .= "celular='"       . $celular       . "', ";  
            $updateConfig .= "telefone='"      . $telefone      . "', ";
            $updateConfig .= "site='"          . $site          . "', ";
            $updateConfig .= "mail='"          . $mail          . "', ";
            $updateConfig .= "description='"   . $description   . "', ";
            $updateConfig .= "latitude='"      . $latitude      . "', ";
            $updateConfig .= "longitude='"     . $longitude     . "', ";
            $updateConfig .= "end_cep='"       . $end_cep       . "', ";
            $updateConfig .= "end_endereco='"  . $end_endereco  . "', ";
            $updateConfig .= "end_numero='"    . $end_numero    . "', ";
            $updateConfig .= "end_bairro='"    . $end_bairro    . "', ";
            $updateConfig .= "end_complemento='".  $end_complemento    . "'";

            if(count($_FILES) > 0) 
            {               
                $imgData  = ResizeImage($_FILES['file']['tmp_name'], 100, 100);
                $vars .= ", image";
                $values .= ", '" . $imgData . "'";
                $updateConfig .= ", image='"    . $imgData    . "'";
            }

           if ($update != "1")
           {
               $query = "INSERT INTO service ($vars) VALUES ( $values )";
               
               $ip = getIP();
               
               MySQL::Query("INSERT INTO statistic_serviceregister (userid, ip) VALUES ('$userid','$ip')");
           }
           else
           {
               $query = "UPDATE service SET $updateConfig WHERE id=$serviceid";
           }

            MySQL::Query($query);
            echo("1");
       }
   }
?>