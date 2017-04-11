<?php

$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");

require_once("../../common/php/base.php");
require_once("../../common/php/ImageResize.php");

require_once("../../common/php/mail.php");

function ResizeImage($file, $new_w, $new_h)
{   
    $image = file_get_contents($file);
    list($org_w, $org_h) = getimagesize($file);
    
    if ($new_w == -1) $new_w = $org_w;
    if ($new_h == -1) $new_h = $org_h;
    
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

// =======================================================================

$method = "";
$table = "";
$id = -1;

$vars = "";
$values = "";
$update = "";

foreach ($_POST as $param_name => $param_val) 
{
    if ($param_name == "table")
    {
        $table = $param_val;
    }
    else if ($param_name == "method")
    {
        $method = $param_val;
    }
    else if ($param_name == "id")
    {
        $id = $param_val;
    }
    else
    {
        if ($param_name == "datacadastro" || $param_name == "nascimento")
        {
            //$param_val = "STR_TO_DATE(\"$param_val\",\"%d/%m/%Y\")";
            $_val = substr($param_val, 6, 4) . "-" . substr($param_val, 3, 2) . "-" . substr($param_val, 0, 2);
            $param_val = "TIMESTAMP('$_val')";
        }
        else
        {
            $param_val = "\"$param_val\"";
        }
        
        if ($vars != "")    $vars   .= ",";
        if ($values != "")  $values .= ",";
        if ($update != "")  $update .= ",";
        
        $vars .= $param_name;
        $values .= $param_val;
        $update .= $param_name . "=" . $param_val;
    }
}

if (isset($_FILES['image']))
{
    $w = 100;
    $h = 100;
    
    if ($table == "banner")
    {
        $w = 1080;
        $h = 507;
    }
    
    $img = ResizeImage($_FILES['image']['tmp_name'], $w, $h);
    $vars .= ", image";
    $values .= ", \"" . $img . "\"";
    $update .= ",image=\"" . $img . "\"";
}



if ($method == "insert")
{
    if ($table == "adminuser")
    {
        $user = $_POST["user"];
         if (MySQL::Count("SELECT id FROM adminuser WHERE user='$user'") > 0)
         {
             echo("Usuário já cadastrado");
             exit();
         }
    }
    
    
    $sql = "INSERT INTO $table ($vars) VALUE ($values)";
    MySQL::Query($sql);
    echo(1);
}
else if ($method == "update")
{
    if ($table == "adminuser")
    {
       $user = $_POST["user"];
       $userid = MySQL::Value("SELECT id FROM adminuser WHERE user='$user'");
        if ($userid != $id) 
        {
             echo("Usuário já cadastrado");
             exit();
        }
    }
    
    $sql = "UPDATE $table SET $update WHERE id=$id";
    MySQL::Query($sql);
    echo(1);
}


?>