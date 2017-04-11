<?php

class SPY
{
    static function Decode($value)
    {
        return $value;
        
        /*
        
        // replace all
        $val = $value;
        while ($pos = strpos($val, '.') !== FALSE)
        {
            $val = str_replace('.', '=', $val);
        }
        
        $val = base64_decode($val);
        return $val;
        */
    }
    
    static function Encode($value)
    {
        return $value;
        
        /*
        $val = base64_encode($value);
        
        while ($pos = strpos($val, '=') !== FALSE)
        {
            $val = str_replace('=', '.', $val);
        }
        return $val;
        */
    }
}

?> 