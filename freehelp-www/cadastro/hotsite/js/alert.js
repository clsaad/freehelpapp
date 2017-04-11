var nextPopupAlert = null;

function internalAlert(title, message, next)
{
    var div = document.getElementById("alerttitle");
    div.innerHTML = title;
    
    var div = document.getElementById("alertmessage");
    div.innerHTML = message;
    
    nextPopupAlert = next;
    
    openPopup("alert");
}

