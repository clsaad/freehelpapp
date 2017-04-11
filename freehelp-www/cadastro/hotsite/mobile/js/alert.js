/*
var CustomAlert = {};

CustomAlert.ON_YES = null;
CustomAlert.ON_NO = null;

CustomAlert.Show = function(text, onYes, onNo)
{
    CustomAlert.ON_YES = onYes;
    CustomAlert.ON_NO = onNo;
    
    document.getElementById("alert").style.display = 'block';
    disableScrolling();
}

CustomAlert.OnClickNo = function()
{
    document.getElementById("alert").style.display = 'none';
    enableScrolling(); 
    if (CustomAlert.ON_NO != null) CustomAlert.ON_NO();
}

CustomAlert.OnClickYes = function()
{
    document.getElementById("alert").style.display = 'none';
    enableScrolling(); 
    if (CustomAlert.ON_YES != null) CustomAlert.ON_YES();
}
*/

var MsgBox = {};

MsgBox.ON_YES = null;
MsgBox.ON_NO = null;

MsgBox.Show = function(text, onYes, onNo)
{
    MsgBox.ON_YES = onYes;
    MsgBox.ON_NO = onNo;
    
    document.getElementById("msgbox").style.display = 'block';
    
    document.getElementById('txtmsgbox').innerHTML = text;
    
    disableScrolling();
}

MsgBox.OnClickNo = function()
{
    document.getElementById("msgbox").style.display = 'none';
    enableScrolling(); 
    if (MsgBox.ON_NO != null) MsgBox.ON_NO();
}

MsgBox.OnClickYes = function()
{
    document.getElementById("msgbox").style.display = 'none';
    enableScrolling(); 
    if (MsgBox.ON_YES != null) MsgBox.ON_YES();
}



// ============================


var Alert = {};

Alert.ON_CLICK_OK = null;

Alert.Show = function(title, text, onConfirm)
{
    Alert.ON_CLICK_OK = onConfirm;
    
    document.getElementById("alert").style.display = 'block';
    document.getElementById("alertno").style.display = (onConfirm != null) ? 'block' : 'none';
    document.getElementById('txtalerttitle').innerHTML = title;
    document.getElementById('txtalertmsg').innerHTML = text;
    
    disableScrolling();
}

Alert.OnClickOK = function()
{
    Alert.OnClickNO();    
    if (Alert.ON_CLICK_OK != null) Alert.ON_CLICK_OK();
}

Alert.OnClickNO = function()
{
    document.getElementById("alert").style.display = 'none';
    enableScrolling(); 
}



