<?php
function GetOS()
{
    if( !function_exists('mobile_user_agent_switch') ){
        $device = "pc";
		
		if( stristr($_SERVER['HTTP_USER_AGENT'],'ipad') ) {
			$device = "ipad";
		} else if( stristr($_SERVER['HTTP_USER_AGENT'],'iphone') || strstr($_SERVER['HTTP_USER_AGENT'],'iphone') ) {
			$device = "iphone";
		} else if( stristr($_SERVER['HTTP_USER_AGENT'],'blackberry') ) {
			$device = "blackberry";
		} else if( stristr($_SERVER['HTTP_USER_AGENT'],'android') ) {
			$device = "android";
		}
        
        return $device;
    }
    
    return "pc";
}

$url = "http://www.freehelpapp.com.br/";
$os = GetOS();
if ($os == "android") $url = "https://play.google.com/store/apps/details?id=com.freehelp.app";
else if ($os == "ipad" || $os == "iphone") $url = "https://itunes.apple.com/us/app/freehelp/id1208925028";

header("Location: $url");
die();

?>