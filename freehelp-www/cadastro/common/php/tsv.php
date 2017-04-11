<?php

require_once("mysql.php");

class TSV
{
    public $value = "";
    public $type = "";
    public $name = "";
    
    public static function Create($name, $type, $value)
    {
        $data = new TSV();
        $data->name = $name;
        $data->type = $type;
        $data->value = $value;
        
        return $data;
    }
    
    public static function Parse($tsv, $byIndex = false)
    {
        $tsv = trim($tsv);
        $arr = array();
        $types = array();
        
        if ($tsv != "")
        {
            $lines = explode("\n", $tsv);
            $lineCount = count($lines);
            if ($lineCount >= 3)
            {
                $names = explode("\t", $lines[0]);
                $types = explode("\t", $lines[1]);
                
                $namesCount = count($names);
                
                for ($i = 2; $i < $lineCount; $i++)
                {
                    $cols = explode("\t", $lines[$i]);
                    $data = array();
                    
                    for ($j = 0; $j < $namesCount; $j++)
                    {
                        $name = $names[$j];
                        $type = $types[$j];
                        $val = $cols[$j];
                        $t = TSV::Create($name, $type, $val);
                        if ($byIndex) array_push($data, $t); 
                        else $data[$name] = $t;
                    }
                    
                    array_push($arr, $data);
                }
            }
        }
        
        return $arr;
    }
    
    
    public static function QueryAsTSV($query, $empty = FALSE)
    {
        $data = "";
        $result = MySQL::Query($query);
        
        if ($result != NULL && $result->num_rows > 0) 
        {
            $vars = "";
            $types = "";
            
            while ($column_info = $result->fetch_field())
            {
                if ($column_info->name != "image")
                {
                    if ($vars != "") $vars .= "\t";
                    if ($types != "") $types .= "\t";

                    $t = $column_info->type;

                    if ($t == 1) $t = "bool";
                    else if ($t == 3) $t = "int";
                    else if ($t == 4) $t = "float";
                    else $t = "string"; 

                    $vars .= $column_info->name;
                    $types .= $t;
                }
            }
            
            $count = 0;
            $linecount = 0;
            
            if ($empty !== TRUE)
            {
                while ($row = $result->fetch_assoc())
                {
                    $line = "";
                    $count = 0;
                    foreach ($row as $key => $value) 
                    {   
                        if ($key != "image")
                        {
                            if ($line != "") $line .= "\t";
                            $value = trim($value);
                            
                            if ($key == "datacadastro")// || $key == "nascimento")
                            {
                                $value = substr($value, 8, 2) . "/" . substr($value, 5, 2) . "/" . substr($value, 0, 4);
                            }
                            
                            //if ($value == "") $value = "null";

                            $value = str_replace("\r", "", $value);
                            $value = str_replace("\t", "    ", $value);
                            $value = str_replace("\n", "<br>", $value);
                            $value = trim($value);

                            $line .= $value; 
                            $count++;
                        }
                    }
                    
                    $linecount++;

                    if ($data != "") $data .= "\n";
                    $data .= $line;
                }
            }
            else
            {
                
            }
            
            if ($linecount > 0)
            {
                $data = $vars . "\n" . $types . "\n" . $data;
            }
            else
            {
                $data = $vars . "\n" . $types;
            }
            
            utf8_decode($data);
        }
        
        
        return $data; 
    }
    
    
    public static function InsertInTable($table, $tsv)
    {
        $lines = explode("\n", $tsv);
        $lineCount = count($lines);
        
        MySQL::Trace("lineCount = $lineCount");
        
        if ($lineCount > 2)
        {
            $header = explode("\t", $lines[0]);
            $headerCount = count($header);
            $fields = "";
            for ($j = 0; $j < $headerCount; $j++)
            {
                if ($fields != "") $fields .= ", ";
                $fields .= $header[$j];
            }
            
            for ($i = 2; $i < $lineCount; $i++)
            {
                $data = explode("\t", $lines[$i]);
                $values = "";
                $update = "";
                
                for ($j = 0; $j < $headerCount; $j++)
                {
                    if ($values != "") $values .= ", ";
                    if ($update != "") $update .= ", ";
                    
                    $values .= "'" .( $data[$j] ) . "'";
                    $update .= $header[$j] . "='" . $data[$j] . "'";
                }
                
                
                $sql = "INSERT INTO $table ($fields) VALUES ($values) ON DUPLICATE KEY UPDATE $update";
                MySQL::Query($sql);
            }
        }
    }
}


/*
$testtsv = "id\tpais\nin\tTstring\n0\tIndefinido\n1\tEUA\n2\tArgentina\n3\tBrasil\n4\tJapao\n5\tChina\n6\tFrança\n7\tInglaterra\n8\tAlemanha\n9\tItalia\n10\tEspanha\n11\tBolivia\n12\tUruguai\n13\tColombia\n14\tPeru\n15\tEquador\n16\tChile\n17\tParaguai\n18\tVanezuela";

$arr = TSVData::Parse($testtsv);

//echo(print_r($arr[0]));
echo($arr[5]["pais"]->value);
echo("<br>");

TSVData::InsertInTable("Paises", $testtsv);
*/

?>