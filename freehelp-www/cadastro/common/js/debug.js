var Debug = {};

/*
window.onerror = function(msg, url, linenumber) {
    alert('Error message: '+msg+'\nURL: '+url+'\nLine Number: '+linenumber);
    return true;
}
*/

//var Config = Config || {};

function trace() {
    
    if (typeof Config != 'undefined' && Config.ENABLE_TRACE)
    {
        var context = "";
        return Function.prototype.bind.call(console.log, console, context);
    }
}

/*
if (window.location.href.indexOf("localhost") < 0)
{
    window.alert = function(message) { }  
}
*/

Debug.Log = window.trace;

Debug.onKeyDown = function(e)
{
    if (e.keyCode == 72) // H
    {
        Help.debugNext();
    }
    else if (e.keyCode == 27) // ESC
    {
        if (typeof onReceiveWebViewMessage != 'undefined')
        {
            onReceiveWebViewMessage("onPressBack");   
        }
    }
    
    return;
    
    var objs = document.getElementsByClassName("debugobj");
    for (var i = 0; i < objs.length; i++)
    {
        if (objs[i].style.position == "")
        {
            objs[i].style.position = "relative";   
        }
        
        var numbers = [37, 38, 39, 40];
        var names = ["left", "top", "left", "top"];
        var somas = [-10, -10, 10, 10];
        
        for (var j = 0; j < numbers.length; j++)
        {
            if (e.keyCode == numbers[j])
            {
                if (objs[i].style[names[j]] == "") objs[i].style[names[j]] = 0;
                var num = parseInt( objs[i].style[names[j]].substr(0, objs[i].style[names[j]].length - 2) );
                objs[i].style[names[j]] = (num + somas[j]) + "px";
            }
        }

    }
}


Debug.init = function()
{
    document.addEventListener("keydown",   Debug.onKeyDown); 
}