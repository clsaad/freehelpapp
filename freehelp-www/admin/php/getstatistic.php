<?php

$domain = $_SERVER['SERVER_NAME'];
require_once ("../../common/php/path.php");

require_once("../../common/php/base.php");

$type = $_POST["type"];




function GetCategoryData()
{
    $now = date("d/m/Y",time());
    $startDate = isset($_POST['startDate']) ? $_POST['startDate'] : "00/00/0000";
    $endDate = isset($_POST['endDate']) ? $_POST['endDate'] : $now;
    $sqlTime = "((datacadastro <= STR_TO_DATE('$endDate','%d/%m/%Y')) AND (datacadastro >= STR_TO_DATE('$startDate','%d/%m/%Y')))";
    
    $sql = "SELECT id, name FROM category WHERE 1=1";
    $result = MySQL::Query($sql);
    
    $str = "";
    if ($result != NULL && $result->num_rows > 0) 
    {
      while($row = $result->fetch_assoc())
      {
          $id = $row['id'];
          $name = $row['name'];
          $sql = "SELECT id FROM service WHERE (category1=$id OR category2=$id OR category3=$id) AND $sqlTime";
          $count = MySQL::Count($sql);
          
          //$str .= $sql;
          
          
          if ($str != "") $str .= "\n";
          $str .= "$id\t$name\t$count";
      }
    }
    
    return $str;
}


function GetSubCategoryData($cat)
{
    $now = date("d/m/Y",time());
    $startDate = isset($_POST['startDate']) ? $_POST['startDate'] : "00/00/0000";
    $endDate = isset($_POST['endDate']) ? $_POST['endDate'] : $now;
    $sqlTime = "((datacadastro <= STR_TO_DATE('$endDate','%d/%m/%Y')) AND (datacadastro >= STR_TO_DATE('$startDate','%d/%m/%Y')))";
    
    $sql = "SELECT id, name FROM subcategory WHERE category=$cat";
    $result = MySQL::Query($sql);
    
    $str = "";
    if ($result != NULL && $result->num_rows > 0) 
    {
      while($row = $result->fetch_assoc())
      {
          $id = $row['id'];
          $name = $row['name'];
          
          $sql = "SELECT id FROM service WHERE (subcategory1=$id OR subcategory2=$id OR subcategory3=$id) AND $sqlTime";
          $count = MySQL::Count($sql);
          
          //$str .= $sql;
          
          if ($str != "") $str .= "\n";
          $str .= "$id\t$name\t$count";
      }
    }
    
    return $str;
}



if ($type == "category")
{
    echo GetCategoryData();
    exit();
}
else if ($type == "subcategory")
{
    $cat = $_POST["category"];
    echo GetSubCategoryData($cat);
    exit();
}



?>


<?php

?>