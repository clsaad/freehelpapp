var Feedback = {};
Feedback.show = false;
Feedback.div = null;
Feedback.y = -100;
Feedback.timeout = null;

Feedback.Update = function()
{
    if (Feedback.div == null) Feedback.div = document.getElementById("topfeedback");
    
    if (Feedback.show == true)
    {
        if (Feedback.y < 0) Feedback.y += 2;
    }
    else
    {
        if (Feedback.y > -50) Feedback.y--;
    }
    
    Feedback.div.style.top = Feedback.y;
    requestAnimationFrame(Feedback.Update);
}

Feedback.Message = function(message, success)
{
    var _s = (success == null) ? true : success;
    
    Feedback.div.style.backgroundColor = (_s == true) ? '#FFFFCC' : '#FF9999';
    
    clearTimeout(Feedback.timeout);
    Feedback.y = -50;
    Feedback.show = true;
    Feedback.div.innerHTML = "<img src='images/warning.png'> " + message;
    Feedback.timeout = setTimeout(function() {
        Feedback.show = false;
    }, 5000);   
}
