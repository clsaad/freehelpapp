// DEFAULT =========================================

function isInternetExplorer () {
  var myNav = navigator.userAgent.toLowerCase();
  return (myNav.indexOf('msie') != -1) ? parseInt(myNav.split('msie')[1]) : false;
}

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

window.trace = function() {
    var context = "";
    return Function.prototype.bind.call(console.log, console, context);
}();

//window.trace = function() { }

function isMobile() { 
 if( navigator.userAgent.match(/Android/i)
 || navigator.userAgent.match(/webOS/i)
 || navigator.userAgent.match(/iPhone/i)
 || navigator.userAgent.match(/iPad/i)
 || navigator.userAgent.match(/iPod/i)
 || navigator.userAgent.match(/BlackBerry/i)
 || navigator.userAgent.match(/Windows Phone/i)
 ){
    return true;
  }
 else {
    return false;
  }
}

var loadedData = [];
var loadCount = 0;

var loadDataIndex = 0;


function onCompleteLoadData2(data, divName)
{
    var el = document.getElementById(divName);
    if (el == null)
    {
        loadedData[divName ] = data;
    }
    else
    {
        el.innerHTML = data; 
    }
    
    loadCount--;
    
    if (loadCount == 0)
    {
        loadDataIndex++;
        if (onDataLoaded != null) onDataLoaded(loadDataIndex);   
    }
}

function onCompleteLoadData(e)
{
    var reader = e.target;
    
    if (reader.readyState==4)
    {
        onCompleteLoadData2(reader.responseText, reader.div);
    }
}


function run(url, params, callback)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (callback != null)
            {
                var data = xmlhttp.responseText;
                var realData = data;
                
                var lastIndex = data.lastIndexOf("</trace>");
                if (lastIndex >= 0)
                {
                    realData = data.substr(lastIndex + ("</trace>".length));
                    
                    data = data.replaceAll("<trace>", "");
                    
                    var parts = data.split("</trace>");
                    if (parts.length > 1)
                    {
                        for (var i = 0; i < parts.length - 1; i++)
                        {
                            console.log(parts[i].trim()); // TRACE 
                        }
                    }
                                        
                }
                
                realData = realData.trim();
                callback(realData);   
            }
        }
    };
    
    var strParams = null;
    if (params == null) params = {};
    //params["page"] = url;

    strParams = "";
    for (var property in params) 
    {
        if (params.hasOwnProperty(property))  
        {
            if (strParams != "") strParams += "&";
            strParams += property + "=" + params[property];
        }
    }

    
    
    var urlToCall = url;
    if (urlToCall.indexOf("http") != 0)
    {
        urlToCall = DOMAIN + "/php/" +  url;   
    }
    
    xmlhttp.open("POST", urlToCall, true);
    
    //Send the proper header information along with the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xmlhttp.send(strParams);
}


function loadData(url, divName, params)
{
    loadCount++;
    /*
    var reader = new XMLHttpRequest() || new ActiveXObject("Microsoft.XMLHTTP");
    reader.div = divName;
    reader.open('get', url, true); 
    reader.onreadystatechange = onCompleteLoadData;
    reader.send(null);*/
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            onCompleteLoadData2(xmlhttp.responseText, divName);
        }
    };
    
    
    var strParams = "";
    if (params == null)
    {
        params = {};
    }
    else
    {
        for (var property in params) 
        {
            if (params.hasOwnProperty(property)) 
            {
                if (strParams != "") strParams += "&";
                strParams += property + "=" + params[property];
            }
        }
    }
    
    
    xmlhttp.open(strParams == "" ? "GET" : "POST", url, true);
    xmlhttp.send(strParams);
}
        


// =================================================

var openedPage = undefined;
var popupList = [];

function closePopup(name)
{
    var div = null;
    
    document.getElementById("shadow").style.display = 'none';
    
    var _div = document.getElementById("lixeiracadastroservico");
    _div.style.visibility='hidden';
    
    _div = document.getElementById("btnsalvarcadastro");
    _div.style.visibility='hidden';
    
    _div = document.getElementById("divcheckbox");
    _div.style.display='none';
    
    if (name != null)
    {
        div = document.getElementById(name);
        div.style.visibility = "hidden";
    }
    else
    {
        for (var i = 0; i < popupList.length; i++)
        {
            div = document.getElementById(popupList[i]);
            div.style.visibility = "hidden";
        }
    }
    
    if (name == 'divalert')
    {
        if (nextPopupAlert != null) nextPopupAlert();   
    }
}



function clearBasicPopups()
{
    CheckBox.Clear();
    
    var forms = ["formcadastro", "formlogin", "formuserconfig"];
    for (var i = 0; i < forms.length; i++)
    {
        var form = document.getElementById(forms[i]);
        if (form != null)
        {
            form.reset();
        }
    }
    
    var errors = ["loginerror", "cadastroerror", "configerror"];
    for (var i = 0; i < forms.length; i++)
    {
        var x = document.getElementById(errors[i]);
        if (x != null) x.innerHTML = "";
    }
}


function clearCadastroPopup(manterReviewData)
{
    if (manterReviewData != true)
        reviewData = null;
    
    CheckBox.Clear();
    clearForms(["formcadastro"], ["cadastroerror"]);
    
    var all = $("#" + "formcadastro").find(":input");
    for (var i = 0; i < all.length; i++)
    {
        all[i].value = "";
        all[i].disabled = false;
    }
    
    document.getElementById("comosoubeoutro").style.display = "none";
}

function clearBasicPopups()
{
    clearForms(["formlogin", "formuserconfig"], ["loginerror", "configerror"]);
}

function clearForms(forms, errors)
{
    if (forms == null) forms = [];
    if (errors == null) errors = [];
    
    for (var i = 0; i < forms.length; i++)
    {
        var form = document.getElementById(forms[i]);
        if (form != null)
        {
            form.reset();
        }
    }
    
    for (var i = 0; i < forms.length; i++)
    {
        var x = document.getElementById(errors[i]);
        if (x != null) x.innerHTML = "";
    }
}


var beforePolitidaDePrivacidade = null;
var lastPopup = "";

function openPopup(divName)
{
    
    
    if (divName != 'politicadeprivacidade')
        beforePolitidaDePrivacidade = divName;
    
    var close = true;
    
    if (divName == "alert" && lastPopup == "cadastroservico") close = false;
    
    if (close) closePopup();
    
    
    
    if (divName != "alert")
    {   
        clearBasicPopups();
    }
    
    lastPopup = divName;
    
    var effectDiv = "#effect_" + divName;
    divName = "div" + divName;
    
    var div = document.getElementById(divName);
    div.style.visibility = "visible";
    
    if (divName == 'divcadastro')
    {
        _div = document.getElementById("divcheckbox");
        _div.style.display='block';   
    }
    
    if (window.USER != null)
    {
        var vars = ["mail", "cpf", "nascimento"];
        for (var i = 0; i < vars.length; i++)
        {
            var inp = document.getElementById("js_config" + vars[i]);
            if (inp != null)
            {
                inp.disabled = true;
                inp.value = window.USER[vars[i]];
            }
        }
    }
    
    
    document.getElementById("shadow").style.display = 'block';
    
    for (var i = 0; i < popupList.length; i++)
    {
        if (popupList[i] == divName) return;   
    }
    
    
    
    popupList.push(divName);
}


function openPage(pageName)
{
    var div = null;
    
    if (openedPage != undefined)
    {
        div = document.getElementById(openedPage);
        div.style.visibility = "hidden";
    }
    
    div = document.getElementById(pageName);
    div.style.visibility = "visible";
    
    openedPage = pageName;
    
    document.getElementById("epoxposition").style.left = (openedPage == "home") ? 625 : 725;
    
    var img = document.getElementById("imgfacebook");
    if (openedPage == "home")
    {
        img.src = "hotsite/images/buttons/facebook_large0.png";
        img.normal = "hotsite/images/buttons/facebook_large0.png";
        img.hover = "hotsite/images/buttons/facebook_large1.png";
        img.style.left = 0;
    }
    else
    {
        img.src = "hotsite/images/buttons/facebook0.png";
        img.normal = "hotsite/images/buttons/facebook0.png";
        img.hover = "hotsite/images/buttons/facebook1.png";
        img.style.left = 60;
    }
}



// =================================================



onDataLoaded = function()
{
    // nothing yet
}



function getValuesFromForm(formName, encode) 
{
    /*
    var x = document.getElementById(formName);
    var obj = {};
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {
            if (x.elements[i].name.indexOf("js_") != 0)
            {
                var val = x.elements[i].value;
                if (x.elements[i].name == "mail")
                {
                    val = val.toLowerCase();
                }
                
                if (encode == true) val = SPY.Encode(val);
                obj[x.elements[i].name] = val;
            }
        }
    }
    return obj;
    */
    
    
    var obj = {};
    var all = $("#" + formName).find(":input");
    for (var i = 0; i < all.length; i++)
    {
        if (all[i].name.indexOf("js_") != 0)
        {
            var val = all[i].value;
            if (all[i].name == "mail") val = val.toLowerCase();
            if (encode == true)
            {
                val = SPY.Encode(val);
            }
            obj[all[i].name] = val; 
        }  
    }
    return obj;
}


function novoUsuario()
{
    document.getElementById("formcadastro").reset();
    openPopup("cadastro");
}


function logout()
{
    var selectedServiceToEdit = -1;
    var userServiceList = [];
    var formError = false;
    
    var el = document.getElementById("servicescontent");
    el.innerHTML = "";
    
    
    
    run("login.php", { exit:"1"}, onLogoutCallback);
    openPage("home");
}

function onLogoutCallback(data)
{
}


function onClickReviewCadastro()
{
    clearCadastroPopup(true);
    openPopup("cadastro");
    fillCadastroPopup(reviewData);
}


function fillCadastroPopup(data)
{
    var json = JSON.parse(data.substr(1));
    json = json.data[0];
    
    var all = $("#" + "formcadastro").find(":input");
    
    for (var i = 0; i < all.length; i++)
    {
        all[i].value = "";
        all[i].disabled = false;
    }

    for(var key in json)
    {
        for (var i = 0; i < all.length; i++)
        {
            if (json[key] != null && json[key].trim() != '')
            {
                var val = json[key];
                if (all[i].name == key)
                {
                    all[i].value = val;
                    all[i].disabled = true;
                }
                else if (all[i].name == "js_how" && key == "how")
                {
                    var achou = false;
                    val = removeAcentoSimples(val);
                    
                    for (var j = 0; j < all[i].length; j++)
                    {
                        var valorAtual = removeAcentoSimples(all[i][j].value);
                        
                        if (valorAtual == val)
                        {
                            achou = true;
                            all[i][j].selected = true;
                        }
                        else
                        {
                            all[i][j].selected = false;   
                        }
                    }
                    
                    all[i].disabled = achou;
                }
            }
        }
    }
    
    CheckBox.Clear();
    CheckBox.OnClick();
}


function login(formValues)
{
    var entrouVazio = (formValues != null && formValues.mail == null);
    if (formValues == null)
    {
        formValues = getValuesFromForm("formlogin", true);
    }
    
    formValues.mail = (formValues.mail == null) ? null : formValues.mail.trim();
    formValues.pass = (formValues.pass == null) ? null : formValues.pass.trim();
    
    if (entrouVazio == false && formValues.mail == "")
    {
        var x = document.getElementById("loginerror");
        x.innerHTML = "E-mail não preenchido.";           
        $( "#effect_login" ).effect( "shake" );
    }
    else
    {
        run("login.php", formValues, onLoginCallback);
    }
}

var firstShake = true;
var reviewData = null;

function onLoginCallback(data)
{
    data = data.trim();
    
    reviewData = null;
    var firstChar = data.substr(0, 1);
    
    if (firstChar == "b")
    {
        internalAlert("Cadastro bloqueado!", "Seu cadastro encontra-se bloqueado.\nPor favor entre em contato com nossa equipe através do e-mail sac@freehelpapp.com.br");
        return;
    }
    else if (firstChar == "x")
    {
        reviewData = data;
        internalAlert("Oops!!", "Parece que seu cadastro está incompleto, por favor confirme as informações de cadastro!", onClickReviewCadastro);
    }
    else if (isNaN(firstChar))
    {
        if (firstShake == true)
        {
            firstShake = false;
            return;
        }
        var x = document.getElementById("loginerror");
        x.innerHTML = data;           
        $( "#effect_login" ).effect( "shake" );
    }
    else
    {
        Analytics.Track(Analytics.TYPE.SITE_DESKTOP, "login");
        onGetUserData(data);
    }
}





function cadastrarUsuario()
{
    var pass1 = "";
    var pass2 = "";
    var concordou = false;
    var error = "";
    
    var x = document.getElementById("formcadastro");
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {
            
            
            if (x.elements[i].name == "mail")
            {
                x.elements[i].value = x.elements[i].value.trim();
                window.USERMAIL = x.elements[i].value;
                if (validaEmail(x.elements[i].value) != true)
                {
                    error = "E-mail inválido.";
                    break;
                }
            }
            
            
            if (x.elements[i].name == "nascimento")
            {
                x.elements[i].value = x.elements[i].value.trim();
                if (validaDataDeNascimento(x.elements[i].value) != true)
                {
                    error = "Data de nascimento inválida.";
                    break;
                }
            }
            
            
            if (x.elements[i].name == "password")
            {
                pass1 = x.elements[i].value.trim();
                
                if (pass1.length < 8)
                {
                    error = "A senha deve ter pelo menos 8 digitos.";
                    break;
                }
            }
            
            
            if (x.elements[i].name == "cpf")
            {
                if (validaCPF(x.elements[i].value) == false)
                {
                    error = "CPF inválido.";
                    break;
                }
            }
            
            
            if (x.elements[i].name == "js_password2")
            {
                pass2 = x.elements[i].value.trim();
                
                if (pass1 != pass2)
                {
                    error = "Confirmação de senha inválida.";
                    break;
                }
            }
            
            if (x.elements[i].name == "how")
            {
                var how = x.elements[i].value;
                
                if (how.trim().length <= 0)
                {
                    error = "Indique como conheceu o FreeHelp.";
                    break;
                }
            }
        }
    }
    
    
    if (error == "")
    {
        if (document.getElementById(""))
        {
            
        }
    }
    
    
    if (error == "")
    {
        concordou = CheckBox.value;
        if (CheckBox.MarkError(!concordou))
        {
            error = "Você deve concordar com os termos.";
        }
    }
    
    
    if (error == "")
    {
        var formValues = getValuesFromForm("formcadastro", true);
        formValues['table'] = 'user';
        formValues['temppassword']='';
        
        if (reviewData != null)
        {
            formValues['update'] = '1'; 
        }
        
        window.USERMAIL = formValues.mail;
        
        run("createuser.php", formValues, onCadastroUsuarioCallback);
    }
    else
    {
        var x = document.getElementById("cadastroerror");
        x.innerHTML = error;   
        
        $( "#effect_cadastro" ).effect( "shake" );  
    }
}



function onCadastroUsuarioCallback(data)
{
    var firstChar = data.trim().substr(0, 1);
    if (isNaN(firstChar))
    {
        var x = document.getElementById("cadastroerror");
        x.innerHTML = data;   
        
        $( "#effect_cadastro" ).effect( "shake" );       
    }
    else
    {
        getUserData();
        
        Analytics.Track(Analytics.TYPE.SITE_DESKTOP, "cadastrousuario");
    }
}


function getUserData()
{
    run("getuserdata.php", {"usermail": SPY.Encode(window.USERMAIL) }, onGetUserData);
}


function onGetUserData(data)
{
    closePopup();
    
    data = data.trim();
    
    var count = data.substr(0, 1);
    var data = data.substr(data.indexOf("{"));
    
    
    var canParseJson = false;
    var json = null;
    try
    {
        var json = JSON.parse(data);
        canParseJson = true;
    }
    catch (e) {}
    
    
    if (canParseJson == true)
    {
        window.USER = json["data"][0];
        
        if (count == "0")
            onEnterWithNoServices();
        else
        {
            if (window.USER.status == 0)
            {
                internalAlert("Usuário bloqueado", "Seu usuário está temporariamente bloqueado e não aparacerá na busca do app. Por favor entre em contato com nossa equipe.")
            }
        }

        refreshServices();
        var div = document.getElementById("usermail");
        div.innerHTML = "<center>" + window.USER.mail + "</center>";
    }
}


function onEnterWithNoServices()
{
    internalAlert("Bem vindo ao FreeHelp", "Cadastre seus serviços, para que possam ser facilmente localizados por usuários que estejam próximos a você!", novoServico);    
}


var beforeOpenPolitica = null;

function closePolitica()
{
     openPopup( beforePolitidaDePrivacidade ); 
}


function recuperarSenha()
{
    //recuperarsenhaerror
    var x = document.getElementById("formrecuperarsenha");
    var mail = "";
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {
            if (x.elements[i].name == "mail")
            {
                mail = SPY.Encode( x.elements[i].value.toLowerCase() );
            }
        }
    }
    
    mail = mail.trim();
    if (mail == '')
    {
        var div = document.getElementById("recuperarsenhaerror");
        div.innerHTML = "Preencha o campo de e-mail.";
        
        $( "#effect_recuperarsenha" ).effect( "shake" );
    }
    else
    {
    
        run("renewpassword.php", {"mail":mail}, onGetNewPassword);
    }
}

function onGetNewPassword(data)
{
    console.log(data);
    if (data.trim().indexOf("1") == 0)
    {
        var mail = "";
        var x = document.getElementById("formrecuperarsenha");
        if (x != null)
        {
            for (var i = 0; i < x.length ;i++) 
            {
                if (x.elements[i].name == "mail")
                {
                    mail = x.elements[i].value.toLowerCase();
                }
            }
        }
        
        internalAlert("Recuperação de senha", "Uma nova senha de acesso foi enviada para " + mail);
    }
    else
    {
        var div = document.getElementById("recuperarsenhaerror");
        div.innerHTML = "Usuário não encontrado";
        
        $( "#effect_recuperarsenha" ).effect( "shake" );
    }
}


// ========================================



function clearDiv(divName)
{
    var div = document.getElementById(divName);
    if (div != null) div.innerHTML = "";
}


function addButton(divName, label, cssClass, onClick, position)
{
    var div = document.getElementById(divName);
    
    if (div == null) div = document.getElementsByName(divName);
    
    if (div == null) 
    {
        return;
    }
    
    if (position == null) position = {x:0, y:0};
    
    var html = "";
    html += "<div style='position:absolute;top:" + position.y + "px;left:" + position.x + "px;'>";
    html += "<div class='" + cssClass + "'><b>";
    html += "<a href=\"javascript:" + onClick + "\">";
    html += label;
    html += "</a></b></div></div>";
    
    div.innerHTML = html;
}


function onChangeComoSoubeOther()
{
    var how = "";
    var x = document.getElementById("formcadastro");
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {
            if (x.elements[i].name == "js_other")
            {
                how = x.elements[i].value;
            }
            
            if (x.elements[i].name == "how")
            {
                x.elements[i].value = how;
            }
        }
    }
}

function onChangeComoSoube()
{
    var how = "";
    var x = document.getElementById("formcadastro");
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {
            if (x.elements[i].name == "js_how")
            {
                how = x.elements[i].value;
            }
        }
        
        for (var i = 0; i < x.length ;i++) 
        {
            if (x.elements[i].name == "js_other")
            {
                x.elements[i].disabled = (how != "");
                if (how != "")
                {
                    x.elements[i].value = "";
                }
            }
            
            if (x.elements[i].name == "how")
            {
                x.elements[i].value = how;
            }
        }
    }
    
    document.getElementById("comosoubeoutro").style.display = (how == null || how == "") ? "block" : "none";
}

function addStoreButton(divName, store)
{
    var div = document.getElementById(divName);
    var url = APP_URL[store].trim();
    if (url != "")
    {
        div.innerHTML = "<a href='" + url + "' target='_blank'><img src='hotsite/images/" + store + ".png'></a>";
    }
    else
    {
        div.innerHTML = "<img src='hotsite/images/" + store + ".png'>";
    }
}





function updateUser()
{
    var password = "";
    var newpassword1 = "";
    var newpassword2 = "";
    
    var x = document.getElementById("formuserconfig");
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {
            if (x.elements[i].name == "password")
            {
                password = x.elements[i].value;
            }
            
            if (x.elements[i].name == "newpassword")
            {
                newpassword1 = x.elements[i].value;
            }
            
            if (x.elements[i].name == "js_newpassword")
            {
                newpassword2 = x.elements[i].value;
            }
        }
    }
    
    if (SPY.Encode(password) == window.USER.password &&
       newpassword1.length >= 8 && newpassword1 == newpassword2)
    {
        run("updateuser.php", {"userid":window.USER.id, "newpass":SPY.Encode(newpassword1)}, onChangePassword);
    }
    else
    {
        var div = document.getElementById("configerror");
        div.innerHTML = "Senha inválida";
        
        $( "#effect_userconfig" ).effect( "shake" );
    }
}


function onChangePassword(data)
{
    //alert(data);
    closePopup();
    internalAlert("Senha modificada!", "Agora você poderá logar-se com sua nova senha!");
}

function excluirConta()
{
    var password = "";
    
    var x = document.getElementById("formuserconfig");
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {
            if (x.elements[i].name == "password")
            {
                password = x.elements[i].value;
            }
        }
    }
    
    if (SPY.Encode(password) == window.USER.password)
    {
        MSGBOX_NO = null;
        MSGBOX_YES = confirmaExclusaoDeConta;
        msgbox("Tem certeza?", "Ao excluir sua conta de usuário, seus serviços também serão excluidos!");
    }
    else
    {
        var div = document.getElementById("configerror");
        div.innerHTML = "Senha inválida";
        
        $( "#effect_userconfig" ).effect( "shake" );
    }
}


function confirmaExclusaoDeConta()
{
    run("deleteuser.php", {"userid":window.USER.id}, onUserDeleted);
}


function onUserDeleted(data)
{
    logout(); 
    closePopup();
    internalAlert("Usuario removido!", "Sua conta foi excluida, você poderá criar uma nova a qualquer momento.");
    Analytics.Track(Analytics.TYPE.SITE_DESKTOP, "contaexcluida");
}


function onLixeiraOver(over)
{
    var lixeiraID = (over == true) ? "2" : "";
    var div = document.getElementById("configlixeira");   
    div.style.backgroundImage="url(hotsite/images/lixeira" + lixeiraID + ".png)";
}



function ordenaLista(lista)
{
    var novaLista = [];
    for (var i = 0; i < lista.length; i++) {
        novaLista.push(lista[i]);   
    }
    
    novaLista.sort(function(a, b){
        if(a.name < b.name) return -1;
        if(a.name > b.name) return 1;
        return 0;
    });
    
    return novaLista;
}


function onGetCategories(data)
{
    window.CATEGORY = ordenaLista(JSON.parse(data)["data"]);
    
    for (var j = 1; j <= 3; j++)
    {
        var sel = document.getElementById('formcadastrocategoria' + j);
        for (var i = 0; i < window.CATEGORY.length; i++)
        {
            sel.options[i + 1] = new Option(htmlDecode(window.CATEGORY[i].name), window.CATEGORY[i].id);
        }
    }
}


function onGetSubCategories(data)
{
    window.SUBCATEGORY = ordenaLista(JSON.parse(data)["data"]);
}

function onGetOccupations(data)
{
    window.OCCUPATION = ordenaLista(JSON.parse(data)["data"]);   
    window.OCCUPATION.push(
    {
        category:'-1',
        subcategory:'-1',
        id:'-1',
        name:'- Outros'
    });
}


function htmlDecode(str)
{
    var d = document.createElement("div");
    d.innerHTML = str; 
    return typeof d.innerText !== 'undefined' ? d.innerText : d.textContent;
}









