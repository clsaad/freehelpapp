var Help = {};

Help.TSV = function()
{
    Admin.ClearPage();
    document.getElementById("maincontent").innerHTML = "<div id='help'></div>";
    
    DataManager.loadData("data/helptsv.html", "help");
}