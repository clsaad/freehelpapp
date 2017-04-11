<?php

    require_once("mysql.php");
    echo(MySQL::GetTime() . "<br>");
    echo((MySQL::GetTime() + 15 * 60) . "<br>");
    echo(MySQL::GetTime() . "<br>");
?>