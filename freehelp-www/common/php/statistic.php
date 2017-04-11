<?php
     
$domain = $_SERVER['SERVER_NAME'];
require_once ("path.php");

require_once("mysql.php");

class Statistic
{
    public static function ViewService($serviceid, $userid)
    {
        $year = date('Y');
        $month = date('m');
        $day = date('d');
        
        $sql = "INSERT INTO statistic_serviceview (serviceid, userid, ano, mes, dia) VALUES ($serviceid, $userid, $year, $month, $day)";
        $result = MySQL::Query($sql);
    }
}

?>