var _gaq = _gaq || [];
_gaq.push(['second._setAccount', 'UA-74484802-1']);
_gaq.push(['_setAccount', 'UA-41989805-2']);

(function() {
  var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
  //ga.src = '//www.google-analytics.com/analytics.js';
  ga.src = '//ssl.google-analytics.com/ga.js';
  var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();

var Analytics = {};

Analytics.TYPE = {};
Analytics.TYPE.SITE = 0;
Analytics.TYPE.SITE_DESKTOP = 1;
Analytics.TYPE.SITE_MOBILE = 2;
Analytics.TYPE.APP = 3;

Analytics.Track = function(type, action, label)
{    
    if (type == Analytics.TYPE.SITE_DESKTOP || type == Analytics.TYPE.SITE_MOBILE) {
        Analytics.Track(Analytics.TYPE.SITE, action, label);
    }
    
    var category = "site";
    if (type == Analytics.TYPE.SITE_DESKTOP) category = "site_desktop";
    if (type == Analytics.TYPE.SITE_MOBILE) category = "site_mobile";
    if (type == Analytics.TYPE.APP) category = "app";
    
    for (var i = 0; i < 2; i++)
    {
        var params = [];
        params.push((i == 0) ? '_trackEvent' : 'second._trackEvent');
        if (category != null) params.push(category);
        if (action != null) params.push(action);
        if (label != null) params.push(label);

        _gaq.push(params);
    }
}


