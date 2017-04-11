var Toggle = {};

Toggle.OnClick = function(id)
{
    var normal = document.getElementById(id + "0");
    var sel = document.getElementById(id + "1");
    
    var temp = sel.style.display;
    sel.style.display = normal.style.display;
    normal.style.display = temp;
}

Toggle.value = function(id, value)
{    
    var normal = document.getElementById(id + "0");
    var sel = document.getElementById(id + "1");
    
    if (value != undefined && value != null)
    {
        normal.style.display = (value != true) ? "block" : "none";
        sel.style.display = (value == true) ? "block" : "none";
    }
    
    return (sel.style.display.localeCompare('block') == 0);
}

