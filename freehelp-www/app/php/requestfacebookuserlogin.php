<?php 
    ob_start();
    //error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
?>  
    
<?php
    function redirect($url, $statusCode = 303)
    {
       header('Location: ' . $url, true, $statusCode);
       die();
    }
?>  
    
<?php

    session_start();
    
    $_SESSION['initpath'] = $_GET['initpath'];
    $_SESSION['appid'] = $_GET['appid'];
    
    $url = "https://www.facebook.com/dialog/oauth?client_id=" . $_SESSION['appid'] . "&redirect_uri=http://www.freehelpapp.com.br/appphp/getfacebookuserdata.php";
    
    redirect($url);
?>  
    