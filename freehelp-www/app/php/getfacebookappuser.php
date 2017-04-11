<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');
?>

<?php
    
    $name = $_POST['name'];
    $login = $_POST['id'];
    $password = "UNKNOWN";
    $type = 1;
    //$image = "https://graph.facebook.com/$login/picture?type=small";

    $query = "SELECT * FROM appuser WHERE login='$login' AND type=$type LIMIT 1";
    $num = MySQL::Count($query);

    if ($num == 0)
    {
        $imgVar = "";
        $imgVal = "";
        $query = "INSERT INTO appuser (name, login, password, type) VALUES ('$name', '$login', '$password', $type)";
        MySQL::Query($query);
    }

    $query = "SELECT * FROM appuser WHERE login='$login' AND type=$type LIMIT 1";
    echo( MySQL::QueryAsJson($query) );
?>
