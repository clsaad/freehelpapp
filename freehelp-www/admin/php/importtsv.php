<?php
header('Content-type: text/plain; charset=utf-8');

require_once ("../../common/php/path.php");
require_once("../../common/php/base.php");
require_once("../../common/php/geoapp.php");

require_once("../../common/php/encoding.php");

/*
require "PHPExcel.php";

function ExcelFromString($data=null)
{
    $file = tempnam(sys_get_temp_dir(), 'excel_');
    $handle = fopen($file, "w");
    fwrite($handle, $data);
    $return = PHPExcel_IOFactory::load($file);
    fclose($handle);
    unlink($file);
    return $return;
}

function ExcelToTSV($objPHPExcel)
{
    //  Get worksheet dimensions
    $sheet = $objPHPExcel->getSheet(0); 
    $highestRow = $sheet->getHighestRow(); 
    $highestColumn = $sheet->getHighestColumn();

    $tsv = "";

    //  Loop through each row of the worksheet in turn
    for ($r = 1; $r <= $highestRow; $r++){ 
        //  Read a row of data into an array
        $rowData = $sheet->rangeToArray('A' . $r . ':' . $highestColumn . $r,
                                        NULL,
                                        TRUE,
                                        FALSE);
        //  Insert row data array into your database of choice here
        for ($i = 0; $i < sizeof($rowData); $i++)
        {
            $row = $rowData[$i];
            $line = "";

            for ($i2 = 0; $i2 < sizeof($row); $i2++)
            {
                if ($line !== "") $line .= "\t";
                $line .= $row[$i2];
            }

            if ($tsv !== "") $tsv .= "\n";
            $tsv .= $line;
        }
    }
    
    return $tsv;
}
*/
function tirarAcentos($string){
    return str_replace('&', 'e', strtolower( preg_replace( '/[`^~\'"]/', null, iconv( 'UTF-8', 'ASCII//TRANSLIT', $string ) ) ));
}

function GetIDFromString($table, $entry)
{
    $entry = tirarAcentos($entry);
    $query = "SELECT id, name FROM $table WHERE 1=1";
    $result = MySQL::Query($query);

    if ($result != NULL && $result->num_rows > 0) 
    {
      while($row = $result->fetch_assoc())
      {
          $id = 0;
          $name = "";
          foreach ($row as $key => $value) 
          {
              if ($key == "id") $id = $value;
              if ($key == "name") $name = tirarAcentos($value);
          }

            if (strpos($name, $entry) !== false) {
                return $id;
            }
      }
    }
    
    return 0;
}

function utf8Fix($string)
{ 
    //$string = utf8_encode($msg);
    return $string;
    /*
    $strlen = strlen($string);
    $charCode = array();
    for ($i = 0; $i < $strlen; $i++) {
        $charCode[] = ord(substr($string, $i, 1));
    }
    
    $result = json_encode($charCode);
    
    $charCode = json_decode($result);
    $result = '';
    foreach ($charCode as $code) {
        $result .= chr($code);
    };
    return $result;
    
    //$msg = utf8_encode($msg);
    //return $msg;
    /*
$accents = array("á", "à", "â", "ã", "ä", "é", "è", "ê", "ë", "í", "ì", "î", "ï", "ó", "ò", "ô", "õ", "ö", "ú", "ù", "û", "ü", "ç", "Á", "À", "Â", "Ã", "Ä", "É", "È", "Ê", "Ë", "Í", "Ì", "Î", "Ï", "Ó", "Ò", "Ô", "Õ", "Ö", "Ú", "Ù", "Û", "Ü", "Ç");
$utf8 = array("Ã¡","Ã ","Ã¢","Ã£","Ã¤","Ã©","Ã¨","Ãª","Ã«","Ã­","Ã¬","Ã®","Ã¯","Ã³","Ã²","Ã´","Ãµ","Ã¶","Ãº","Ã¹","Ã»","Ã¼","Ã§","Ã","Ã€","Ã‚","Ãƒ","Ã„","Ã‰","Ãˆ","ÃŠ","Ã‹","Ã","ÃŒ","ÃŽ","Ã","Ã“","Ã’","Ã”","Ã•","Ã–","Ãš","Ã™","Ã›","Ãœ","Ã‡");
    
$fix = str_replace($utf8, $accents, $msg);
return $fix;
*/
}

function GetData($tabela, $cabecalho, $data, $error)
{
    $data = trim($data);
    if ($tabela == "service")
    {
        $dataEntrada = $data;
        
        //*
        if ($cabecalho === "category1" || $cabecalho === "category2" || $cabecalho === "category3")
        {
            $data = GetIDFromString("category", $dataEntrada);
        }
        else if ($cabecalho === "subcategory1" || $cabecalho === "subcategory2" || $cabecalho === "subcategory3")
        {
            $data = GetIDFromString("subcategory", $dataEntrada);
        }
        else if ($cabecalho === "occupation1" || $cabecalho === "occupation2" || $cabecalho === "occupation3")
        {
            $data = GetIDFromString("occupation", $dataEntrada);
        }
        else if ($cabecalho == "status")
        {
            $data = tirarAcentos(strtolower($data));
            $data = ($data === "nao") ? '0' : '1';
        }
        //*/
        
        //echo($dataEntrada . " - " . $data . "<br>");
    }
                                 
    if ($cabecalho == "datacadastro" || $cabecalho == "nascimento")
    {
        $_val = substr($data, 6, 4) . "-" . substr($data, 3, 2) . "-" . substr($data, 0, 2);
        $data = "TIMESTAMP('$_val')";
    }
    else
    {
        $data = '"' . $data . '"';
    }
    
    
    
    return $data;
}

function GetHeader($tabela, $entrada)
{
    if ($tabela == "service")
    {
        $dic = array(
            'id' => 'id',
            'name' => 'Nome',
            'datacadastro' => 'Data Cadastro',
            'status' => 'Ativo',
            'datacadastro' => 'Data de Cadastro',
            'category1' => 'Categoria 1',
            'subcategory1' => 'Sub Categoria 1',
            'occupation1' => 'Ocupacao 1',
            'category2' => 'Categoria 2',
            'subcategory2' => 'Sub Categoria 2',
            'occupation2' => 'Ocupacao 2',
            'category3' => 'Categoria 3',
            'subcategory3' => 'Sub Categoria 3',
            'occupation3' => 'Ocupacao 3',
            'end_cep' => 'CEP',
            'end_endereco' => 'Rua',
            'end_numero' => 'Numero',
            'end_bairro' => 'Bairro',
            'end_complemento' => 'Complemento',
            'celular' => 'Celular',
            'telefone' => 'Telefone',
            'description' => 'Descricao',
            'site' => 'Site',
            'mail' => 'Email',
        );
        
        $entrada = strtoupper(tirarAcentos($entrada));
        
        foreach ($dic as $key => $value)
        {
            if (strtoupper($value) === $entrada)
            {
                return $key;
            }
        }
    }
    
    
    return $entrada;
}

$table = $_POST["table"];

$tsv = $_POST["tsv"];

//$tsv = base64_decode( $_POST["tsv"] );
//$tsv = str_replace("<<br>>", "\n", $tsv);
//echo($tsv);

$lines = preg_split("/\\r\\n|\\r|\\n/", $tsv);
$lineCount = count($lines);

$errors = "";
$lastID = 0;

if ($lineCount > 2)
{
    // LAST ID
    if (MySQL::Count("SELECT id FROM $table WHERE 1=1 LIMIT 1") > 0)
    {
        $lastID = intval(MySQL::Value("SELECT id FROM $table WHERE 1=1 ORDER BY id DESC LIMIT 1") . "");
    }
    $header = split("\t", $lines[0]);
    $headerCount = count($header);
    $fields = "";
    for ($j = 0; $j < $headerCount; $j++)
    {
        $header[$j] = trim(GetHeader($table, $header[$j]));
        
        if ($header[$j] !== "")
        {
            if ($fields != "") $fields .= ", ";

            if ($header[$j] != "id")
                $fields .= $header[$j];
        }
    }

    for ($i = 2; $i < $lineCount; $i++)
    {
        $data = explode("\t", $lines[$i]);
        
        $values = "";
        $update = "";

        $id = 0;
        $idIndex = 0;
        
        $error = null;
        
        $address = "";
        
        for ($j = 0; $j < $headerCount; $j++)
        {
            
            
            $data[$j] = GetData($table, $header[$j], $data[$j], $error);

            // CASO SEJA ALGO RELACIONADO A ENDEREÇO
            if (strpos($header[$j], "end_") !== false) 
            {
                if ($address !== "") $address .= " - ";
                $address .= $data[$j];
            }
            
            if ($header[$j] !== "")
            {
                if ($values != "") $values .= ", ";
                if ($update != "") $update .= ", ";
                
                if ($header[$j] == "id")
                {
                    $idIndex = $j;
                    $id = $data[$j];
                }
                else   
                {
                    $values .=  utf8Fix($data[$j]);
                    $update .= $header[$j] . "=" . utf8Fix($data[$j]);
                }
            }
        }
        
        // address
        if ($table == "service")
        {
            $app = new GeoApp();
            $geo = $app->GetGeoPosition($address);
            
            $fields .= ",latitude, longitude";
            
            $values .=  ",\"" . $geo->latitude  . "\"";
            $values .=  ",\"" . $geo->longitude . "\"";
            
            $update .= ",latitude=\""  . $geo->latitude  . "\"";
            $update .= ",longitude=\"" . $geo->longitude . "\"";
        }
        
        $result = null;
        $type = "include - ";
        
        $query = "";
        
        if(MySQL::Count("SELECT id FROM $table WHERE id=$id") > 0)
        {
           //found
            $type = "update - ";
            $query = "UPDATE $table SET $update WHERE id=$id";
            $result = MySQL::Query($query, $error);
        }
        else
        {
           // not fount
            $lastID++;
            $data[$idIndex] = $lastID;
            $query = "INSERT INTO $table ($fields) VALUES ($values)";
            $result = MySQL::Query($query, $error);
        }
        
        if ($error != null)
        {
            $linha = $i + 1;
            $errors .= "Não foi possivel incluir a linha <b>$linha</b> $error\n$query";
        }
    }
}

if ($errors == "")
{
    $errors = "0";
}

echo($errors);
?>
