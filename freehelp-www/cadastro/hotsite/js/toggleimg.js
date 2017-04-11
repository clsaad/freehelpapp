var ToggleImg = {}

ToggleImg.Init = function()
{
    var mobile = isMobile();
    
    var all = document.getElementsByClassName("toggleimg");
    for (var i = 0; i < all.length; i++)
    {
        var btn = all[i];
        
        var normal = btn.src.replace("1", "0");
        var hover = normal.replace("0", "1");
        btn.normal = normal;
        btn.hover = hover;
        
        if (mobile == true)
        {
            btn.action = (all[i].alt == null || btn.alt.trim() == "") ? null : btn.alt.trim();
            
            btn.onmouseover=function(e) { e.target.setAttribute('src', e.target.hover); };   
            
            btn.onclick = function(e) 
            {
                var _btn = e.target;
                //_btn.setAttribute('src', _btn.hover);
                Invoke( function() {
                    if (_btn.action != null) eval(_btn.action);
                }, 0.15);
                Invoke( function() {
                    _btn.setAttribute('src', _btn.normal);    
                }, 0.35);
            };
        }
        else
        {
            all[i].onmouseover=function(e) { e.target.setAttribute('src', e.target.hover); };   
            all[i].onmouseout =function(e) { e.target.setAttribute('src', e.target.normal); };  
        }
    }   
}
