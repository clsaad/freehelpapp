<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');
?>

<?php

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
        $data = addslashes( $data );
    }
    else
    {
        $data = addslashes( $image );   
    }
    
    return $data;
}

?>

<?php
    
    $name = $_POST['name'];
    $login = $_POST['login'];
    $password = $_POST['pass'];
    $os = $_POST['os'];
    $type = 0;

    $query = "SELECT * FROM appuser WHERE login='$login' LIMIT 1";
    $num = MySQL::Count($query);

    if ($num == 0)
    {
        $query = "INSERT INTO appuser (name, login, password, type) VALUES ('$name', '$login', '$password', $type)";
        
        $query1 = "INSERT INTO statistic_appsignup (login, os, ip) VALUES ('$login', '$os', '" . getIp() . "')";
        MySQL::Query($query1);
        
        $result = MySQL::Query($query);
        if ($result == NULL) echo("0");
        else
        {
            $query = "SELECT * FROM appuser WHERE login='$login' AND password='$password' AND type=0 LIMIT 1";
            echo( MySQL::QueryAsJson($query) );
        }
    }
    else
    {
        echo("0");   
    }
?>

