<?php 
    //error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 

    require_once('../../common/php/mysql.php');
?>


<?php


if (isset($_POST["term"]))
{
    $term = $_POST["term"];
    $distance = $_POST["distance"];
    $latitude = $_POST["latitude"];
    $longitude = $_POST["longitude"];
    
    // FIX IT
    //$distance = 3000;
    
   $queryList = array();
    
    for ($i = 1; $i <= 3; $i++)
    {
    
        $vars = "service.id, service.name, service.image, service.end_endereco, service.end_numero, service.end_bairro, service.latitude, service.longitude, occupation.name AS occupation";
        $queryDistance = ", (( 3959 * acos( cos( radians(service.latitude) ) * cos( radians( $latitude ) )  * cos( radians($longitude) - radians(service.longitude)) + sin(radians(service.latitude)) * sin( radians($latitude)))) * 1.60934) AS distance ";
        $ljCategory = "LEFT JOIN category ON category.id=service.category$i";
        $ljSubcategory = "LEFT JOIN subcategory ON subcategory.id=service.subcategory$i";
        $ljOccupation = "LEFT JOIN occupation ON occupation.id=service.occupation$i";
        $order = " ORDER BY distance ";
        $where = "WHERE (service.name LIKE '%$term%' OR category.name LIKE '%$term%' OR subcategory.name LIKE '%$term%' OR occupation.name LIKE '%$term%') ";


        if (isset($_POST['cat']))
        {
            $cat = $_POST['cat'];
            $where .= " AND category.id='$cat' ";
        }

        if (isset($_POST['subcat']))
        {
            $subcat = $_POST['subcat'];
            $where .= " AND subcategory.id='$subcat' ";
        }


        $query = "SELECT DISTINCT $vars $queryDistance, 0 as median_stars, \"\" as str_occupation FROM service $ljCategory $ljSubcategory $ljOccupation $where HAVING distance < $distance $order";
        
        $queryList[$i - 1] = $query; 
        
    }
    $json = MySQL::QueryListAsJson($queryList);
    echo($json);
}
else
{
    echo("0");   
}

?>

