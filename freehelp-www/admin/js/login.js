var Login = {};

Login.LoginScreen = function(errorMessage)
{
    var mainDiv = document.getElementById("maincontent");
    mainDiv.innerHTML = "";
    var div = document.createElement("div");
    mainDiv.appendChild(div);
    
    var str = "<div style='font-size:150%'><b>FREEHELP</b></div>Painel Administrativo<br><br>";
    str += "User:\t<input id='loginuser' type='text'></input><br>";
    str += "Pass:\t<input id='loginpass' type='password'></input><br><br>";
    str += "<button onclick='Login.OnClickLogin()'>Login</button>";
    
    if (errorMessage != null && errorMessage != "" && errorMessage != "0")
    {
        str += "<br><br><div><font color='#FF0000'>" + errorMessage + "</font></div>";
    }
    
    div.innerHTML = str;
    div.style.textAlign = 'center';
    div.style.position = 'relative';
    div.style.left = -120;
    div.style.top = 50;
}

Login.Logout = function()
{
    DataManager.run("php/login.php", {exit:1}, Login.OnLoginCallback );
}

Login.Check = function()
{
    DataManager.run("php/login.php", {check:1}, Login.OnLoginCallback );
}


Login.OnClickLogin = function()
{
    var _user = document.getElementById('loginuser').value;
    var _pass = document.getElementById('loginpass').value;
    
    DataManager.run("php/login.php", {user:_user, pass:_pass}, Login.OnLoginCallback );
}


Login.OnLoginCallback = function(data)
{
    data = data.trim();
    if (data == "logout")
    {
        Login.LoginScreen();
        SideMenu.create();
    }
    else if (data != "")
    {
        if (data[0] != '{')
        {
            Login.LoginScreen(data);
        }
        else
        {
            data = JSON.parse(data);
            SideMenu.create(data);
            SideMenu.clickMenu("Categorias", "table", "category");
        }
    }
    else
    {
        Login.LoginScreen();
    }
}

