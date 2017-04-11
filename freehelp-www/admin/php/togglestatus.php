<?php
require_once ("../../common/php/path.php");
require_once("../../common/php/base.php");
require_once("../../common/php/mail.php");

$table = $_POST["table"];
$id = $_POST["id"];
$status = $_POST["status"];

$query = "UPDATE " . $table . " SET status='" . $status . "' WHERE id=" . $id;
$data = MySQL::Query($query); 

if ($table == "service")
{
    if ($status == 0)
    {
        $mail = MySQL::Value("SELECT user.mail FROM service LEFT JOIN user ON user.id=service.userid WHERE service.id=$id");
        $serviceName = MySQL::Value("SELECT service.name FROM service WHERE service.id=$id");
        
        $message = MySQL::Value("SELECT value FROM appconfig WHERE name='mail_block_service'");
        $message = str_replace("#SERVICENAME#", $serviceName, $message);
        
        $messageFlat = $message;
        
        echo($mail);
        
        echo SendMail($mail, "FreeHelp - Alteração de status", $message, $messageFlat);
        
        exit();
    }
}
else if ($table == "appuser")
{
    if ($status == 0)
    {
        $mail = MySQL::Value("SELECT login FROM appuser WHERE id=$id");
        
        $message = MySQL::Value("SELECT value FROM appconfig WHERE name='mail_block_appuser'");
        $messageFlat = $message;

        echo($mail);
        
        echo SendMail($mail, "FreeHelp - Alteração de status", $message, $messageFlat);
        
        exit();
    }
}
else if ($table == "user")
{
    if ($status == 0)
    {
        $mail = MySQL::Value("SELECT login FROM appuser WHERE id=$id");
        
        $message = MySQL::Value("SELECT value FROM appconfig WHERE name='mail_block_user'");
        $messageFlat = $message;

        echo($mail);
        
        echo SendMail($mail, "FreeHelp - Alteração de status", $message, $messageFlat);
        
        exit();
    }
}

echo("1");
?>