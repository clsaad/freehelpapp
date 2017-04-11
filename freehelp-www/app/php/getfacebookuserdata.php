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

session_start();

$app_id = $_SESSION["appid"];
$app_secret = "1ae828c6f1b94e91b77b167c60d49eb3";
$my_url = "http://www.freehelpapp.com.br/appphp/getfacebookuserdata.php";
$code = $_GET['code'];

$initpath = $_SESSION["initpath"];

$token_url = "https://graph.facebook.com/oauth/access_token?"
. "client_id=" . $app_id . "&redirect_uri=" . $my_url
. "&client_secret=" . $app_secret . "&code=" . $code;


$response = file_get_contents($token_url);


$response = explode("&", $response);
$response = explode("=", $response[0]);
$response = $response[1];

$response = file_get_contents("https://graph.facebook.com/me?access_token=" . $response);

//$load = $load . $response;

$url = $initpath . "?fblogin=" . $response;
redirect($url);

//$params = null;
//parse_str($response, $params);
//$acces_token = $params['access_token'];

?>