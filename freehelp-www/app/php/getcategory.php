<?php 
    //error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 

    require_once('../../common/php/mysql.php');
?>

<?php
    function GetJsonDataByName($name) 
    {
        $query = "SELECT * FROM $name WHERE 1=1 ORDER BY name";
        $result = MySQL::Query($query);
        if ($result == NULL)
        {
            return "\"$name\":[]";
        }
        else if ($result->num_rows > 0) {
            $json = "\"$name\":[";
            $arrcount = 0;
            while($row = $result->fetch_assoc()) {
                if ($arrcount > 0) $json .= ",";
                
                $cat = isset($row["category"]) ? $row["category"] : 0;
                $sub = isset($row["subcategory"]) ? $row["subcategory"] : 0;
                
                $json .= "{\"id\":" . $row['id'] . ", \"cat\":" . $cat . ", \"sub\":" . $sub . " ,\"name\":\"" . $row['name'] . "\"}";
                $arrcount++;
            }
            $json .= "]";
            return $json;
        }
        
    }

    $json  = "{";
    $json .= GetJsonDataByName("category") . ", ";
    $json .= GetJsonDataByName("subcategory") . ", ";
    $json .= GetJsonDataByName("occupation");
    $json .= "}";
    echo($json);
?>
