<?php

session_start();

date_default_timezone_set('Brazil/East');

require_once("statistic.php");


function getIP() {
    //Just get the headers if we can or else use the SERVER global
    if ( function_exists( 'apache_request_headers' ) ) {
        $headers = apache_request_headers();
    } else {
        $headers = $_SERVER;
    }
    //Get the forwarded IP if it exists
    if ( array_key_exists( 'X-Forwarded-For', $headers ) && filter_var( $headers['X-Forwarded-For'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 ) ) {
        $the_ip = $headers['X-Forwarded-For'];
    } elseif ( array_key_exists( 'HTTP_X_FORWARDED_FOR', $headers ) && filter_var( $headers['HTTP_X_FORWARDED_FOR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 )
    ) {
        $the_ip = $headers['HTTP_X_FORWARDED_FOR'];
    } else {

        $the_ip = filter_var( $_SERVER['REMOTE_ADDR'], FILTER_VALIDATE_IP, FILTER_FLAG_IPV4 );
    }
    return $the_ip;
}

class MySQL
{
    public static function isLocalhost()
    {
        //return false;
        
        $whitelist = array( '127.0.0.1', '::1' );
        if( in_array( $_SERVER['REMOTE_ADDR'], $whitelist) )
            return true;
    }
    
    public static function GetRealIpAddr()
    {
        if (!empty($_SERVER['HTTP_CLIENT_IP']))   //check ip from share internet
        {
          $ip=$_SERVER['HTTP_CLIENT_IP'];
        }
        elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR']))   //to check ip is pass from proxy
        {
          $ip=$_SERVER['HTTP_X_FORWARDED_FOR'];
        }
        else
        {
          $ip=$_SERVER['REMOTE_ADDR'];
        }
        return $ip;
    }
    
    
    public static function GetOcurence($chaine, $rechercher)
    {
        $lastPos = 0;
        $positions = array();
        while (($lastPos = strpos($chaine, $rechercher, $lastPos))!== false)
        {
            $positions[] = $lastPos;
            $lastPos = $lastPos + strlen($rechercher);
        }
        return $positions;
    }
    
    public static function GetTime()
    {
        return time();
    }
    
    public static function CheckSessionTimeout()
    {
        $maxTime = 15;
        if (isset($_SESSION['timeout']))
        {
            if (($_SESSION['timeout'] + $maxTime * 60) > MySQL::GetTime()) 
            {
                // RIGHT
            }
            else
            {
                // TIME OUT!
                session_start();
                session_unset();
                session_destroy();
                session_write_close();
            }
        }
    }
    
    public static function Trace( $data )
    {
      echo ('<trace>' . $data . '</trace>');
    }
    
    public static function ValidQuery($query)
    {
        return TRUE;
        
        $posSemicolon = strpos($query, ';');
        $posOr = strpos($query, ' OR ');
        $posOr1 = strpos($query, ' OR temppassword');
        $posOr2 = strpos($query, ' OR category');
        $posOr3 = strpos($query, ' OR subcategory');
        $posOr4 = strpos($query, ' OR id');
        
        $valid = 1;
        if ($posSemicolon !== false) $valid = 0;
        if ($posOr !== false)
        {
            $valid = 0;
            if ($posOr === $posOr1) $valid = 1;
            if ($posOr === $posOr2) $valid = 1;
            if ($posOr === $posOr3) $valid = 1;
            if ($posOr === $posOr4) $valid = 1;
        }
        
        return $valid;
    }
    
     /*   
    public static function ValidQuery($query)
    {
        $valid = TRUE;
            
        $pos = strrpos($query, ';');
        if (strrpos($query, ';') != NULL || strrpos($query, ' OR ') != NULL)
        {
            $valid = FALSE;
        }
        else
        {
            $occurences = MySQL::GetOcurence($query, "OR");

            $size = count($occurences);
            for ($i = 0; $i < $size; $i++)
            {
                $pos = $occurences[$i];
                if ((strrpos($query, "OR subcategory" , $pos) == FALSE) || (strrpos($query, "OR temppassword" , $pos) == FALSE))
                {
                    $valid = FALSE;
                    break;
                }
            }
        }
        
        return $valid;   
    }*/
    
    
    public static function ClearTable($table)
    {
        MySQL::Query("Truncate table $table");
    }
    
    
    public static function Query($query, &$error = null)
    {   
        //if (MySQL::ValidQuery($query) == 0) return NULL;
        
        $dbip = MySQL::isLocalhost() ? "localhost" : "172.16.1.17";
        
        $userName = "developer";
        $password = "FreeHelp00";
        
        if (MySQL::isLocalhost() == TRUE)
        {
            $userName = "root";
            $password = "";
        }
        
	   // developer FreeHelp00

        //$mysql = mysqli_connect ('177.66.168.199', 'developer', 'FreeHelp00', 'freehelp_db'); 
        //$mysql = new mysqli ('172.16.1.17', 'developer', 'FreeHelp00', 'freehelp_db'); 
        //$mysql = mysqli_connect ('localhost', 'developer', 'FreeHelp00', 'freehelp_db'); 
        //$mysql = new mysqli ('localhost', 'developer', 'FreeHelp00', 'freehelp_db'); 
        $mysql = new mysqli ($dbip, $userName, $password, 'freehelp_db'); 
        
        $userValidationCount = 1;
        $validLogin = FALSE;
        
        if (isset($_SESSION["admin"]))
        {
            $validLogin = TRUE;
        }
        else if ((  strrpos($query, "INSERT") !== FALSE ||
                    strrpos($query, "UPDATE") !== FALSE))
        {
            if ($_SESSION['ip'] != '' && $_SESSION['ip'] !== MySQL::GetRealIpAddr()) 
            {
                return NULL;
            }
            
            $mail = $_SESSION['mail'];
            $pass = $_SESSION['pass'];
            
            $_SESSION['timeout'] = MySQL::GetTime();
            
            $result = $mysql->query("SELECT id FROM user WHERE mail='$mail' AND password='$pass'");
            if ($result != NULL)
            {
                $rowcount = mysqli_num_rows($result); 
                if ($rowcount == 1)
                {
                    $validLogin = TRUE;   
                }
            }
        }
        else
        {
            $validLogin = TRUE;
        }
        
        $result = $mysql->query($query);   
        
        
        
        if ($result == null)
        {
            $error = $mysql->error;
            /*
            try {
                MySQL::Trace("MySQL ERROR \n" . mysqli_error ());
            }
            catch(Exception $e) 
            {
              MySQL::Trace("nothing found");
            }
            */
        }
        
        $mysql->close();
        return $result;
    }
    
    
    public static function QueryListAsJson($queryList, $default = NULL)
    {
        if ($default == NULL) $default = "{\"data\":[]}";
        
        $json = "{\"data\":[";
        
        $arrcount = 0;
        
        $size = count($queryList);
        
        for ($i = 0; $i < $size; $i++)
        {
            $query = $queryList[$i];
            $result = MySQL::Query($query);

            if ($result != NULL && $result->num_rows > 0) 
            {
              while($row = $result->fetch_assoc())
              {
                  if ($arrcount > 0) $json .= ",";
                  $json .= "{";
                  $count = 0;
                  foreach ($row as $key => $value) 
                  {
                      $value = str_replace('"', "'", $value);
                      if ($count > 0) $json .= ", ";
                      $json .= "\"$key\":\"$value\"";
                      $count++;
                  }
                  $json .= "}";
                  $arrcount++;
              }
            }
        }
        
        $json .= "]}";
        
        utf8_decode($json);
        $json = preg_replace( "/\r|\n/", "", $json );
        $json = str_replace("\t", " ", $json);
        
        //$json = utf8_encode($json);
        
        return $json;
    }
    
    public static function QueryAsJson($query, $default = NULL)
    {
        if ($default == NULL) $default = "{\"data\":[]}";
        $json = $default;
        $result = MySQL::Query($query);
        
        if ($result != NULL && $result->num_rows > 0) 
        {
          $json = "{\"data\":[";
          $arrcount = 0;
          while($row = $result->fetch_assoc())
          {
              if ($arrcount > 0) $json .= ",";
              $json .= "{";
              $count = 0;
              foreach ($row as $key => $value) 
              {
                  if ($count > 0) $json .= ", ";
                  
                  $value = str_replace('"', "'", $value);
                  $json .= "\"$key\":\"$value\"";
                  $count++;
              }
              $json .= "}";
              $arrcount++;
          }
          $json .= "]}";
        }
        
        utf8_decode($json);
        
        $json = preg_replace( "/\r\n/", "\n", $json );
        $json = preg_replace( "/\r/", "\n", $json );
        $json = preg_replace( "/\n/", "<br>", $json );
        
        $json = str_replace("\t", " ", $json);
        //$json = utf8_encode($json);
        return $json;
    }
    
    public static function Value($query)
    {
        $result = MySQL::Query($query);
        $value = mysqli_fetch_object($result);
        
        foreach($value as $prop) {
            return $prop;
        } 
        
        return 0;
    }
    
    public static function Count($query)
    {
        $result = MySQL::Query($query);
        if ($result == NULL) return 0;
        $rowcount = mysqli_num_rows($result);
        return $rowcount;
    }
}
?>