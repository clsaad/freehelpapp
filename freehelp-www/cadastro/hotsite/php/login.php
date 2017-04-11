<?php 
ob_start();

//error_reporting(E_ERROR | E_PARSE);
if (!headers_sent()) {
header('Access-Control-Allow-Origin: *'); 
}

$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");

require_once("../../common/php/mysql.php");


function CheckCadastroCompleto($userid)
{
    $result = MySQL::Query("SELECT mail, cpf, nascimento, how, status FROM user WHERE id=$userid");
    
    if ($result != NULL && $result->num_rows > 0) 
    {
        while($row = $result->fetch_assoc())
        {
            foreach ($row as $key => $value) 
            {
                if ($value == NULL || trim($value) == "")
                {
                    return FALSE;   
                }
            }
        }
    }
    
    return TRUE;
}

    
    session_start();

    $mail = $_POST["mail"];
    $pass = $_POST["pass"];
    if ($pass == NULL || $pass == "") $pass = $_POST["password"];

    $exit = $_POST["exit"];

    if ($exit == "1")
    {        
        session_unset();
        echo("E");
        ob_end_flush ();
        exit();
    }

    MySQL::CheckSessionTimeout();

    if (isset($session_id) == false)
        $session_id = $_SESSION['userid'];

    if ((isset($mail) && isset($pass)) || isset($session_id))
    {
         
        // GET FROM PARAMS OR LOGOUT
        if (isset($mail) && isset($pass))
        {
            $mail = trim($mail);
            $pass = trim($pass);
            if (($mail != "" && $pass != "")
             && ($mail != "null" && $pass != "null"))
            {
              $sql = "SELECT * FROM user WHERE mail='$mail' AND (password='$pass' OR temppassword='$pass') LIMIT 1";
                
              $query = MySQL::Query($sql);
            
              if ($query == NULL)
              {
                   $session_id = NULL;
              }
              else
              {
                  $resultado = $query->fetch_assoc();

                  // Verifica se encontrou algum registro
                  if (empty($resultado)) 
                  {
                      $session_id = NULL;
                  }
                  else 
                  {
                      $session_id = $resultado["id"];
                      $updateQuery = "UPDATE user SET temppassword='', password='$pass' WHERE id=$session_id";
                      MySQL::Query($updateQuery);
                  }
              }
            }
        }

        if ($session_id != NULL)
        {
            $count = MySQL::Count("SELECT id FROM service WHERE userid=$session_id");
            
            $sql = "SELECT id, mail, password, cpf, nascimento, how, status FROM user WHERE id=$session_id LIMIT 1";
            $defaultResponse = "E-mail ou senha incorretos!";
            $json = MySQL::QueryAsJson($sql, $defaultResponse);
            
            $status = '1';
            $faltandoCampos = "";
            if (strcmp($json, $defaultResponse) !== 0)
            {
                $jsonObj = json_decode($json, TRUE);
                $mail = $jsonObj['data'][0]['mail'];
                $pass = $jsonObj['data'][0]['password'];
                
                $_SESSION['mail'] = $mail;
                $_SESSION['pass'] = $pass;
                $_SESSION['ip'] = MySQL::GetRealIpAddr();
                $_SESSION['useid'] = $session_id;
                $_SESSION['timeout'] = MySQL::GetTime();
                
                $status = $jsonObj['data'][0]['status'];
                
                //$updateQuery = "UPDATE user SET temppassword='', password='$pass' WHERE id=$session_id";
                //MySQL::Query($updateQuery);
            }
            
           // echo($status);
            
            if ($status == '0')
            {
                $count = 'b';
                $json = '';
                
                // logout
                $_SESSION['mail'] = NULL;
                $_SESSION['pass'] = NULL;
                $_SESSION['ip'] = NULL;
                $_SESSION['useid'] = NULL;
                $_SESSION['timeout'] = NULL;
            }
            else if (CheckCadastroCompleto($session_id) == FALSE)
            {
                $count = "x";
                $json = MySQL::QueryAsJson("SELECT mail, cpf, nascimento, password, how, status FROM user WHERE id=$session_id");
            }
            
            echo ($count . $json);
        }
        else
        {
            echo("E-mail ou senha incorretos!");
            
            $_SESSION['mail'] = NULL;
            $_SESSION['pass'] = NULL;
            $_SESSION['ip'] = NULL;
            $_SESSION['useid'] = NULL;
            $_SESSION['timeout'] = NULL;
        }

        $_SESSION['userid'] = $session_id;
    }
    else
    {
        echo("bbb");
        $_SESSION['mail'] = NULL;
        $_SESSION['pass'] = NULL;
        $_SESSION['ip'] = NULL;
        $_SESSION['useid'] = NULL;
        $_SESSION['timeout'] = NULL;
        echo("E");   
    }

ob_end_flush (); 

?>