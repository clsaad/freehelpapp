<?php 
    //error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');
?>
<?php
    $name = isset($_POST["name"]) ? $_POST["name"] : "";
    $mail = trim($_POST["mail"]);
    $pass = trim($_POST["pass"]);

    //$query = "SELECT * FROM appuser WHERE 1=1";//login LIKE '$mail' AND password LIKE '$pass' AND type=0 LIMIT 1";
    $query = "SELECT * FROM appuser WHERE login LIKE '$mail' AND password LIKE '$pass' AND type=0 LIMIT 1";
    
    /*
    if ($name != "")
    {
        $count = MySQL::Count($query);
        if ($count == 0)
        {
            MySQL::Query("INSERT INTO appuser (type, name, login, password) VALUES (0, '$name', '$mail', '$pass')");
        }
    }
    */
/*
echo(0);
echo($query);
*/
    echo( MySQL::QueryAsJson($query) );
?>