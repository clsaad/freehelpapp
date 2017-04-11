var CheckBox = {};

CheckBox.value = false;

CheckBox.Create = function(where)
{
    var str = "";
    str += "<div id='checkboxcircle' style='position:absolute; top:0px; left:0px;'>";
    str += "<div style='position:relative; top:-1px; left:-1px; width:50px; height:50px;'>";
    str += "<div id='checkboxcirclered' style='position:absolute; top:0px; left:0px;'></div>";
    str += "<div id='checkboxcirclehover' style='position:absolute; top:0px; left:0px;'></div>";
    str += "<div id='checkboxcircleselected'></div>";
    str += "</div>";
    str += "</div>";
    
    var div = document.getElementById(where);
    div.innerHTML = str;
    
    $("#checkboxcircle").click(function(){
			CheckBox.OnClick();
		});
    
    $("#checkboxcircle").mouseenter(function(){
			CheckBox.OnMouseOver(true);
		});
    
    $("#checkboxcircle").mouseleave(function(){
			CheckBox.OnMouseOver(false);
		});
    
    CheckBox.Clear();
}


CheckBox.OnMouseOver = function(over)
{
    var div = document.getElementById("checkboxcirclehover");
    div.style.visibility = over ? "visible" : "hidden";
}

CheckBox.OnClick = function()
{
    CheckBox.value = !CheckBox.value;
    var div = document.getElementById("checkboxcircleselected");
    div.style.visibility = CheckBox.value ? "visible" : "hidden";
}

CheckBox.MarkError = function(value)
{
    var div = document.getElementById("checkboxcirclered");
    div.style.visibility = value ? "visible" : "hidden";
    return value;
}


CheckBox.Clear = function()
{
    CheckBox.MarkError(false);
    
    CheckBox.value = false;
    var div = document.getElementById("checkboxcircleselected");
    div.style.visibility = CheckBox.value ? "visible" : "hidden";
}


