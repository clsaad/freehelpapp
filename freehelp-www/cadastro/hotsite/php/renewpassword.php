<?php 
//error_reporting(E_ERROR | E_PARSE);
header('Access-Control-Allow-Origin: *'); 

require_once("../../common/php/mysql.php");
require_once("../../common/php/spy.php");
require_once("../../common/php/mail.php");

function generateRandomString($length = 10) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[rand(0, $charactersLength - 1)];
    }
    return $randomString;
}


function getFullDate()
{
    // "192.168.0.1-1-2016 04 25 12:00:00"
    
    date_default_timezone_set('America/Brasilia');
    $date = date('Y m d H:i:s', time());
    return $date;
}


function generateRenewKey($mail)
{
    $sql = "SELECT id FROM user WHERE mail='$mail' LIMIT 1";

    $query = MySQL::Query($sql);
    $resultado = $query->fetch_assoc();

    // Verifica se encontrou algum registro
    if (empty($resultado)) 
    {
        return "0";
    }
    else
    {
        $id = $resultado["id"];
        $str = getIP() . "-" . $id . "-" . getFullDate();
        
        $str = base64_encode($str);
        $str = str_replace("=", "!", $str);
        
        return $str;
    }
}

if (isset($_POST["rp"]))
{
    $id = $_POST["id"];
    $pass = $_POST["pass"];
    $mail = NULL;
    
    $sql = "SELECT mail FROM user WHERE id=$id LIMIT 1";

    $query = MySQL::Query($sql);
    $resultado = $query->fetch_assoc();

    // Verifica se encontrou algum registro
    if (empty($resultado)) 
    {
        echo("0");
        exit;
    } 
    else 
    {
        $mail = $resultado["mail"];
    }

    
    
    $session_id = $id;        
    
    $updateQuery = "UPDATE user SET password='" . $pass . "' WHERE id=$id";
    MySQL::Query($updateQuery);
    
    require_once("login.php");
}
else
{
    $user = $_POST["mail"];
    $sql = "SELECT * FROM user WHERE mail='$user' LIMIT 1";

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

        $updateQuery = "UPDATE user SET password='" . $newpassSave . "' WHERE id=$id";
        MySQL::Query($updateQuery);
        
        $message = MySQL::Value("SELECT value FROM appconfig WHERE name='mail_password_site'");

        $key = generateRenewKey($user);
        $message = str_replace("#RECOVERYKEY#", $key, $message);
        $messageFlat = $message;

        echo SendMail(SPY::Decode( $user ), "FreeHelp - Recuperação de senha", $message, $messageFlat);
    }
}

?>