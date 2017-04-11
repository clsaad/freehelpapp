<?php
/*
require_once ("../../common/php/path.php");
require_once("../../common/php/base.php");
$table = "service";
$error = "";
$result = MySQL::Query("SELECT id FROM $table WHERE 1=1 ORDER BY id DESC LIMIT 1", $error);
echo($error);
*/

require "PhpExcel.php";


function fromString($data=null)
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


$inputFileName = 'Teste.xls';
/** Load $inputFileName to a PHPExcel Object **/
$objPHPExcel = PHPExcel_IOFactory::load($inputFileName);

echo ExcelToTSV($objPHPExcel);


?>