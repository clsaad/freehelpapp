<?php
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    $url = $_POST["page"];
    ob_start();
    require('$url');
    $output = ob_get_clean();
    echo($output);
?>