<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');

    $id = $_POST["id"];
    $userid = isset($_POST['userid']) ? $_POST['userid'] : NULL;
    $latitude = isset($_POST['latitude']) ? $_POST['latitude'] : 0;
    $longitude = isset($_POST['longitude']) ? $_POST['longitude'] : NULL;

    function GetStars($serviceid)
    {
        $val = MySQL::Value("(SELECT COALESCE(sum(comment.stars)/count(comment.stars), 0) FROM comment WHERE comment.serviceid=$id LIMIT 1) as median_stars");
        
        return $val;
            
        /*
        $query = "SELECT stars FROM comment WHERE serviceid=$serviceid";
        $result = MySQL::Query($query);

        $total = 0;
        $count = 0;

        if ($result->num_rows > 0) 
        {
          while($row = $result->fetch_assoc())
          {
              $total += $row["stars"];
              $count++;
          } 
        }

        if ($count == 0) return 0;

        return ($total / $count);
        */
    }

    function QueryAsInternalJson($query, $name)
    {
        $result = MySQL::Query($query);
        
        if ($result == NULL)
        {
            return "\"$name\":[]";
        }
        else
        {
            $json = "";
            if ($result->num_rows > 0) 
            {
              $json = "\"$name\":[";
              $arrcount = 0;
              while($row = $result->fetch_assoc())
              {
                  if ($arrcount > 0) $json .= ",";
                  $json .= "{";
                  $count = 0;
                  foreach ($row as $key => $value) 
                  {
                      $val = $row[$key];
                      if ($count > 0) $json .= ", ";

                      //if ($key != "image")
                      //{
                        $json .= "\"$key\":\"$val\"";
                      /*}
                      else
                      {
                          $json .= "\"$key\":\"" . base64_encode($val). "\"";
                      }*/

                      $count++;
                  }
                  $json .= "}";
                  $arrcount++;
              }
              $json .= "]";
            }
            return $json;
        }
    }


    $json = "{";

    $json .= QueryAsInternalJson("SELECT *, (( 3959 * acos( cos( radians(latitude) ) * cos( radians( $latitude ) )  * cos( radians($longitude) - radians(longitude)) + sin(radians(latitude)) * sin( radians($latitude)))) * 1.60934) AS distance FROM service WHERE id=$id", "service");

    $queryComment = "SELECT appuser.name, appuser.id, appuser.login, appuser.type, appuser.image, comment.date, comment.stars, comment.text FROM comment LEFT JOIN appuser ON comment.userid=appuser.id WHERE comment.serviceid=$id AND comment.status=1";

    //$comments = QueryAsInternalJson("SELECT * FROM comment WHERE serviceid=$id", "comment");
    $comments = QueryAsInternalJson($queryComment, "comment");
    if ($comments != "")
    {
        $json .= ", " . $comments;   
    }
    $json .= ", \"stars\": " . GetStars($id);
    $json .= ", \"str_occupation\": \"\"";
    $json .= "}";

    if ($userid != NULL)
    {
        $count = MySQL::Count( "SELECT serviceid FROM appuserhistory WHERE userid=$userid AND serviceid=$id" );
        if ($count == 0)
        {
            $query = "INSERT INTO appuserhistory (userid, serviceid) VALUES ($userid, $id)";
        }
        else
        {
            $query = "UPDATE appuserhistory SET date=now() WHERE userid=$userid AND serviceid=$id"; 
        }
        
        MySQL::Query($query);
        MySQL::Query("INSERT INTO statistic_clickservice (service) VALUES ($id)");
    }
    else
    {
        $userid = 0;   
    }

    Statistic::ViewService($id, $userid);
    echo($json);
?>
