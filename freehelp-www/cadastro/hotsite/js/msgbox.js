var MSGBOX_NO = null;
var MSGBOX_YES = null;

function msgbox(title, msg)
{
    var div = document.getElementById("msgboxtitle");
    div.innerHTML = title;
    
    div = document.getElementById("msgboxtext");
    div.innerHTML = msg;
    
    openPopup("msgbox");
}

function onClickMsgBoxYes()
{
    if (MSGBOX_YES != null) MSGBOX_YES();
    
    MSGBOX_NO = null;
    MSGBOX_YES = null;
    
    closePopup("divmsgbox");
}

function onClickMsgBoxNo()
{
    if (MSGBOX_NO != null) MSGBOX_NO();
    
    MSGBOX_NO = null;
    MSGBOX_YES = null;
    
    closePopup("divmsgbox");
}
