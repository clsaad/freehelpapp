function Start()
{
    MobileMain.Instance.start();   
    
    Analytics.Track(Analytics.TYPE.SITE_MOBILE, "abriusite");
    
    
}


function RenewPasswordCallback(obj)
{
    if (obj == null)
    {
        //alert("Esse link de troca de senha não é mais válido");   
    }
    else
    {
        //alert("troca de senha liberada!");  
        openPage('redefinirsenha');
    }
}


// ===================


function Invoke(callback, time)
{
    if (time == null) time = 0.5;
    if (callback != null)
    {
        return setTimeout(callback,time*1000);
    }
}

function markFieldError(field, isCorrect)
{
    if (isCorrect == false) formError = true;
    field.style.backgroundColor = isCorrect ? "#FFFFFF" : "#FFCCCC";
    return isCorrect;
}

function CancelInvoke(invoke)
{
    clearTimeout(invoke);
}

window.trace = function() {
    var context = "";
    return Function.prototype.bind.call(console.log, console, context);
}();

//window.trace = function() { }

String.prototype.replaceAll = function(search, replacement) {
    var target = this;
    return target.replace(new RegExp(search, 'g'), replacement);
};

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

function htmlDecode(str)
{
    var d = document.createElement("div");
    d.innerHTML = str; 
    return typeof d.innerText !== 'undefined' ? d.innerText : d.textContent;
}

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

function disableScrolling(){
    
    document.ontouchmove = function(e){ e.preventDefault(); }
    
    var x=window.scrollX;
    var y=window.scrollY;
    window.onscroll=function(){window.scrollTo(x, y);};
}

function enableScrolling(){
    
    document.ontouchmove = function(e){ return true; }
    window.onscroll=function(){};
}


function openURL(url)
{
    /*
    if (url == null) return;
    url = url.trim();
    if (url != '')
    {
        window.location.href = url;
    }*/
    window.open(url, "_blank");
}

function openPage(name)
{
    //window.location.href = "?page=" + name;
    OnClick.canCloseSite = false;
    MobileMain.Instance.openPage(name);
}


// CANCEL BACK BUTTON
history.pushState(null, null, '');
    window.addEventListener('popstate', function(event) {
         history.pushState(null, null, '');
         OnClick.TopoVoltar();
    });

// ===================


function MobileMain() { 
}

function onDataLoaded(index) { MobileMain.Instance.onDataLoaded(index); }

MobileMain.prototype.start = function() {
    trace("Start FreeHelp Mobile");

    var myURL = window.location.href;
    /*
    if (myURL.indexOf("localhost") == -1 && myURL.indexOf("www") == -1)
    {
        window.location.href = "http://www.freehelpapp.com.br/";
        return;
    }
    */
    
    //var page = (window.page == null) ? "mobilehome" : "mobile" + window.page;
    
    this.allPages = [
        {id:'cadastroservico', label:'Cadastro de Negócio'}, 
        {id:'cadastrousuario', label:'Cadastro de Usuário'}, 
        {id:'config', label:'Configuração de Conta'}, 
        //{id:'comofunciona', label:'Como Funciona', bg:"url('hotsite/mobile/images/comofuncionabg.jpg')"}, 
        {id:'comofunciona', label:'Como Funciona'}, 
        {id:'home', label:''}, 
        {id:'login', label:'Login'},
        {id:'recuperarsenha', label:'Recuperar Senha'},
        {id:'redefinirsenha', label:'Redefinir Senha'},
        {id:'politicadeprivacidade', label:'Política de Privacidade'}, 
        {id:'servicelist', label:''}
    ];
    
    var divContent = document.getElementById("content");
    for (var i = 0; i < this.allPages.length; i++)
    {
        var rootDiv = document.createElement("div");
        if (this.allPages[i].bg != null && this.allPages[i].bg != '')
        {
            rootDiv.style.textShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';
              rootDiv.style.backgroundImage = this.allPages[i].bg; 
            rootDiv.style.backgroundSize = 'cover';
        }
        rootDiv.setAttribute('id', this.allPages[i].id);
        rootDiv.style.display = 'none';
        rootDiv.style.position = 'relative';
        this.allPages[i].div = rootDiv;
        divContent.appendChild(rootDiv);
        
        if (this.allPages[i].label != '')
        {
            var titleDiv = document.createElement("div");
            var strTitle = "";
            strTitle += "<div>";  
            strTitle += "<div class='space'></div>";
            strTitle += "<div style='display: table;font-family:FuturaCondensed; font-size:65px;'>";
            strTitle += "<div style='display: table-row;'>";
            strTitle += "<div style=\"padding-left:30px;height:122px;display: table-cell;background-image:url('hotsite/mobile/images/title.png');vertical-align: middle;\">" + this.allPages[i].label.toUpperCase() + "</div>";
            strTitle += "<div style=\"height:122px;width:60px;display: table-cell;background-image:url('hotsite/mobile/images/titleend.png');\">  </div>";
            strTitle += "</div>";
            strTitle += "</div>";
            strTitle += "<div class='space'></div>";
            strTitle += "</div>";
            titleDiv.innerHTML = strTitle;
            rootDiv.appendChild(titleDiv);
        }
        
        var contentDiv = document.createElement('div');
        contentDiv.setAttribute('id', this.allPages[i].id + 'content');
        rootDiv.appendChild(contentDiv);
        
        
        DataManager.loadData("hotsite/mobile/data/mobile" + this.allPages[i].id + ".html", contentDiv.id);
    }
    
    DataManager.loadData("hotsite/mobile/data/mobilehead.html", "head");
    DataManager.loadData("hotsite/mobile/data/mobiletitle.html", "title");
    //DataManager.loadData("hotsite/mobile/data/" + page + ".html", "content");
    DataManager.loadData("hotsite/mobile/data/mobileendcontent.html", "endcontent");
    DataManager.loadData("hotsite/mobile/data/mobilebottom.html", "bottom");
    DataManager.loadData("hotsite/mobile/data/mobilemsgbox.html", "msgbox");
    DataManager.loadData("hotsite/mobile/data/mobilealert.html", "alert");
}

MobileMain.prototype.openPage = function(name)
{
    scroll(0,0);
    
    if (MobileMain.Instance.currentPage == name)
    {
        return;   
    }
    
    MobileMain.Instance.lastPage = MobileMain.Instance.currentPage;
    MobileMain.Instance.currentPage = name;
    
    for (var i = 0; i < this.allPages.length; i++)
    {
        var div = this.allPages[i].div;
        div.style.display = (div.id == name) ? 'block' : 'none';
    }      
    
    // TROCA TRABALHADORES ALEATORIAMENTE
    var w1 = document.getElementById('bottomworkers1');
    var w2 = document.getElementById('bottomworkers2');
    
    w1.style.display = 'none';
    w2.style.display = 'none';
    
    var rnd = Math.random() * 100;
    var w = (rnd < 50) ? w1 : w2;
    w.style.display = 'block';
    
    
    if (window.USER != null && window.USER.id != null)
    {
        if (name == 'home' || name == 'servicelist')
        {
            DataManager.loadData("hotsite/mobile/data/mobileheadloggedin.html", "head");
        }
        else
        {
            DataManager.loadData("hotsite/mobile/data/mobileheadloggedinback.html", "head");
        }
    }
    else
    {
        if (name != 'cadastrousuario')
        {
        DataManager.loadData("hotsite/mobile/data/mobilehead.html", "head");
        }
        else
        {
            DataManager.loadData("hotsite/mobile/data/mobileheadback.html", "head");
        }
    }
    
    var divError = document.getElementById(name + "error");
    if (divError != null) divError.innerHTML = "";
}

MobileMain.prototype.onDataLoaded = function(index)
{
    if (index == 1)
    {
        DataManager.run("getcategories.php", null, Callbacks.onGetCategories);
        DataManager.run("getsubcategories.php", null, Callbacks.onGetSubCategories);
        DataManager.run("getoccupations.php", null, Callbacks.onGetOccupations);
        
        openPage('home');
        
        
        /*
        $("input[name='cpf']").mask("999.999.999-**",{placeholder:"___.___.___-__"});
        $("input[name='end_cep']").mask("99999-999",{placeholder:"_____-___"});
        $("input[name='telefone']").mask("(99) 9999-9999",{placeholder:"(__) ____-____"});
        $("input[name='celular']").mask("(99) 99999-9999",{placeholder:"(__) _____-____"});
        */
        
        
        $("input[name='cpf']").inputmask({"mask": "999.999.999-**"});
        $("input[name='nascimento']").inputmask({"mask": "99/99/9999"});
        $("input[name='end_cep']").inputmask({"mask": "99999-999"});
        $("input[name='telefone']").inputmask({"mask": "(99) 9999-9999"});
        $("input[name='celular']").inputmask({"mask": "(99) 99999-9999"});
        
        if (CommonStart() == true)
        {
            OnClick.AutoLogin();   
        }
    }
    
    this.setTitle();
    
    ToggleImg.Init();
}


MobileMain.prototype.setTitle = function()
{
    var page = (window.page == null) ? "mobilehome" : "mobile" + window.page;
    var title = page;
    var display = 'block';
    
    switch (page)
    { 
        case 'mobilecomofunciona':
            title = 'Como Funciona';
            break;
        case 'mobilecadastroservico':
            title = 'Cadastro de Negócio';
            break;
        case 'mobilelogin':
            title = 'Login';
            break;
        case 'mobilepoliticadeprivacidade':
            title = 'Política de Privacidade';
            break;
        case 'mobilehome':
            display = 'none';
            break;
        default:
            break;
    }
    
    var txtTitle = document.getElementById("txttitle");
    txtTitle.innerHTML = title.toUpperCase();
    
    document.getElementById("title").style.display = display;
}


MobileMain.Instance = new MobileMain();



