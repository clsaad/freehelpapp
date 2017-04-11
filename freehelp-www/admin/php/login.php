<?php

error_reporting(E_ERROR | E_PARSE);

$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");
require_once("../../common/php/base.php");

if (isset($_POST['exit']))
{
    $_SESSION["user"] = null;
    $_SESSION["pass"] = null;
    $_SESSION['ip'] = null;
    $_SESSION["admin"] = null;
    
    echo "logout";
    exit();
}
else if (isset($_POST['check']))
{
    if (CheckConnected() == TRUE)
    {
        $user = $_SESSION["user"];
        $pass = $_SESSION["pass"];
    }
    else
    {
        echo "0";
        exit();
    }
}
else
{
    $user = $_POST["user"];
    $pass = $_POST["pass"];
}

// CASO NAO TENHA O USUARIO DO ADMIN, CRIA UM
$sql = "SELECT id FROM adminuser WHERE user='admin'";
$result = MySQL::Query($sql);
if ($result == null || $result->num_rows == 0) 
{
    MySQL::Query("INSERT INTO adminuser (name, user, password) VALUES ('Administrador', 'admin', 'admin')");
    MySQL::Query("UPDATE adminuser SET id=0 WHERE user='admin' AND password='admin'");
}

$sql = "SELECT * FROM adminuser WHERE user='$user' AND password='$pass'";
$result = MySQL::Query($sql);

if ($result->num_rows > 0) 
{
    // output data of each row
    while($row = $result->fetch_assoc()) 
    {
        $user = $row["user"];
        $password = $row["password"];
        $name = $row["name"];
        $_SESSION["user"] = $user;
        $_SESSION["pass"] = $password;
        $_SESSION['ip'] = MySQL::GetRealIpAddr();
        $_SESSION["admin"] = TRUE;
        echo "{ \"user\":\"$user\", \"pass\":\"$password\", \"name\":\"$name\"}";
        exit();
    }
} 
else 
{
    echo "Usuário ou senha inválidos!";
    exit();
}
?>
