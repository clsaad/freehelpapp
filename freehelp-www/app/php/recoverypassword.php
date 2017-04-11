<?php 
error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin: *'); 
require_once("../../common/php/mysql.php");
require_once("../../common/php/spy.php");
require_once("../../common/php/mail.php");
?>
<?php

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}

$user = $_POST["mail"];
$sql = "SELECT * FROM appuser WHERE login='$user' AND type=0 LIMIT 1";

$query = MySQL::Query($sql);
$resultado = $query->fetch_assoc();

// Verifica se encontrou algum registro
if (empty($resultado)) 
{
    echo("0");
}
else 
{
    $id = $resultado["id"];
    
    $newpass = utf8_encode(generateRandomString(10));
    $newpassSave = SPY::Encode($newpass);
    
    $updateQuery = "UPDATE appuser SET password='" . $newpassSave . "' WHERE id=$id";
    MySQL::Query($updateQuery);
    
    $message = MySQL::Value("SELECT value FROM appconfig WHERE name='mail_password_app'");
    $message = str_replace("#NEWPASS#", $newpass, $message);
    $messageFlat = $message;
    
    echo SendMail(SPY::Decode( $user ), "FreeHelp - Recuperação de senha", $message, $messageFlat);
}
?>