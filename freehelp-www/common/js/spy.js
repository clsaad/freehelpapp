var SPY = {};

SPY.Encode = function(value)
{
    return value.replace(new RegExp('\r?\n','g'), '<br>').replace(/[\\"]/g, '');
    
    /*
    var str = Base64.encode(value);
    while (str.indexOf('=') != -1) str = str.replace('=', '.');
    return str;
    */
}

SPY.Decode = function(value)
{   
    return value.replace(new RegExp('<br>','g'), '\n');
    
    /*
    var str = value;
    while (str.indexOf('.') != -1) str = str.replace('.', '=');
    str = Base64.decode(str);
    return str;
    */
}
