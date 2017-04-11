<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');
?>

<?php
    if (isset($_POST["id"]))
    {
        $json =  MySQL::QueryAsJson("SELECT image FROM banner WHERE id=" . $_POST["id"]);
        echo( $json );
    }   
    else
    {
        $json =  MySQL::QueryAsJson("SELECT id, category, action FROM banner WHERE 1=1");
        echo( $json );
    }
?>