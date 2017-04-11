<?php 
    error_reporting(E_ERROR | E_PARSE);
    header('Access-Control-Allow-Origin: *'); 
    require_once('../../common/php/mysql.php');

    $sub = $_POST["sub"];
    $cat = $_POST["cat"];
    $distance = $_POST["distance"];
    $latitude = $_POST["latitude"];
    $longitude = $_POST["longitude"];


    /*//Teste
    $sub = 4;
    $cat = 2;
    $distance = 200;
    $latitude = -23.5302240;
    $longitude = -46.5756940;
    */

    /*
    function prettyPrint( $json )
    {
        $result = '';
        $level = 0;
        $in_quotes = false;
        $in_escape = false;
        $ends_line_level = NULL;
        $json_length = strlen( $json );

        for( $i = 0; $i < $json_length; $i++ ) {
            $char = $json[$i];
            $new_line_level = NULL;
            $post = "";
            if( $ends_line_level !== NULL ) {
                $new_line_level = $ends_line_level;
                $ends_line_level = NULL;
            }
            if ( $in_escape ) {
                $in_escape = false;
            } else if( $char === '"' ) {
                $in_quotes = !$in_quotes;
            } else if( ! $in_quotes ) {
                switch( $char ) {
                    case '}': case ']':
                        $level--;
                        $ends_line_level = NULL;
                        $new_line_level = $level;
                        break;

                    case '{': case '[':
                        $level++;
                    case ',':
                        $ends_line_level = $level;
                        break;

                    case ':':
                        $post = " ";
                        break;

                    case " ": case "\t": case "\n": case "\r":
                        $char = "";
                        $ends_line_level = $new_line_level;
                        $new_line_level = NULL;
                        break;
                }
            } else if ( $char === '\\' ) {
                $in_escape = true;
            }
            if( $new_line_level !== NULL ) {
                $result .= "\n".str_repeat( "\t", $new_line_level );
            }
            $result .= $char.$post;
        }

        echo($result);
        return $result;
    }
    */
    
    $vars = "service.id, service.name, service.image, service.end_endereco, service.end_numero, service.end_bairro, service.latitude, service.longitude, service.subcategory1, service.subcategory2, service.subcategory3, service.occupation1, service.occupation2, service.occupation3";

    $where = "( (service.subcategory1=$sub AND service.category1=$cat) OR (service.subcategory2=$sub AND service.category2=$cat) OR (service.subcategory3=$sub AND service.category3=$cat) )";

    $queryDistance = "(( 3959 * acos( cos( radians(service.latitude) ) * cos( radians( $latitude ) )  * cos( radians($longitude) - radians(service.longitude)) + sin(radians(service.latitude)) * sin( radians($latitude)))) * 1.60934) AS distance";

    $query = "SELECT DISTINCT $vars, (SELECT COALESCE(sum(comment.stars)/count(comment.stars), 0) FROM comment WHERE service.id=comment.serviceid LIMIT 1) as median_stars, \"\" as str_occupation, $queryDistance FROM service LEFT JOIN comment ON comment.serviceid=service.id WHERE $where HAVING distance < $distance ORDER BY distance";

    $json = MySQL::QueryAsJson($query, "{\"data\":[]}");

    echo($json);

?>