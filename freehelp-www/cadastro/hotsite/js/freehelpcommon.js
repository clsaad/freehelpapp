String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.split(search).join(replacement);
};

function EncodePasswordDate(text)
{
    var text2 = window.btoa(text);
    text2 = text2.replaceAll("=", "!");
    return text2;
}

function DecodePasswordDate(text)
{
    text = text.replaceAll("!", "=");
    text = window.atob(text);

    var obj = {};

    var parts = text.split("-");
    obj.ip = parts[0];
    obj.id = parts[1];
    obj.date = new Date( parts[2] );

    return obj;
}

function DiffDate(date)
{
    var diff = new Date() - date;

    var obj = {
        seconds: Math.floor( diff / 1000 ),
        minutes: Math.floor( diff / 1000 / 60),
        hours: Math.floor( diff / 1000 / 60 / 60),
        days: Math.floor( diff / 1000 / 60 / 60 / 24)
    }

    return obj;   
}




function CommonStart()
{
    if (BROWSE_PARAMETERS.rp != null)
    {
        var obj = DecodePasswordDate(BROWSE_PARAMETERS.rp);
        // NÃO (MESMO IP E Menos de 2 HORAS)
        if (!(obj.ip == BROWSE_PARAMETERS.ip && DiffDate(obj.date).minutes <= 120))
        {
            obj = null;
        }
        
        RenewPasswordCallback(obj);
        return false;
        
    }
    
    return true;
}
