<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');
?>

<?php
    $type = $_POST['type'];
    $login = $_POST['login'];
    $os = $_POST['os'];
    
    $count = MySQL::Count("SELECT id FROM appuser WHERE login='$login' AND type=$type LIMIT 1");
    if ($count == 0)
    {
        $name = $_POST['name'];
        
        $image = $_POST['picture'];
        $password = 'UNKNOWN';
        
        // Insere apenas se nao existir
        $query = "INSERT INTO appuser (type, name, login, password, image) VALUES ($type, '$name', '$login', '$password', '$image')";
        MySQL::Query($query);
        
        
        $query = "INSERT INTO statistic_appsignup (login, os, ip) VALUES ('$login', '$os', '" . getIp() . "')";
        MySQL::Query($query);
    }
    else
    {
        // TODO: UPDATE HERE
    }
         
    $query = "SELECT * FROM appuser WHERE login='$login' AND type=$type LIMIT 1";
    echo( MySQL::QueryAsJson($query) );
?>
