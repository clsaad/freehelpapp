function Main() {};

Main.prototype.onDataLoaded = function(index)
{
    if (window.oldBrowser == false)
    {
        if (index == 1)
        {

            loadData("hotsite/data/services.html", "servicedata");
            loadData("hotsite/data/politicadeprivacidade.html", "politicadeprivacidade");
            loadData("hotsite/data/cadastro.html", "cadastro");
            loadData("hotsite/data/login.html", "login");
            loadData("hotsite/data/recuperarsenha.html", "recuperarsenha");
            loadData("hotsite/data/redefinirsenha.html", "redefinirsenha");
            loadData("hotsite/data/homeleft.html", "homeleft");
            loadData("hotsite/data/homeright.html", "homeright");
            loadData("hotsite/data/comofunciona.html", "comofunciona");
            loadData("hotsite/data/cadastroservico.html", "cadastroservico");
            loadData("hotsite/data/userconfig.html", "userconfig");
        }
        else if (index == 2)
        {
            //login({"mail":"bGVhbmRyb0ByZWxvYWRnYW1lc3R1ZGlvLmNvbQ..", "pass":""});

            CheckBox.Create("divcheckbox");

            run("getcategories.php", null, onGetCategories);
            run("getsubcategories.php", null, onGetSubCategories);
            run("getoccupations.php", null, onGetOccupations);

            addStoreButton("storegoogleplay", "googleplay");
            addStoreButton("storeappstore", "appstore");


            // CONFIG BUTTONS
            for (var i = 1; i <=3; i++)
            {
                addButton("homeMainButtonLeft" + i, "COMO FUNCIONA", "leftbutton", "openPopup('comofunciona');", {x:-39, y:50});
            }

            addButton("homeMainButtonRight1", "CADASTRE SEU NEGÓCIO", "rightbutton", "clearCadastroPopup();openPopup('cadastro');", {x:684, y:50});

            addButton("homeMainButtonRight3", "ADICIONAR NEGÓCIO", "rightbutton", "novoServico();", {x:684, y:50});

            openPage("home");


            configInputMasks();

            ToggleImg.Init();

            if (CommonStart() == true)
            {
                login({});
            }
        }
    }
    else
    {
        if (index == 1)
        {
            for (var i = 0; i < NAVEGADORES.length; i++)
            {
                var div = document.getElementById("nav" + i);
                div.innerHTML = "<a href='" + NAVEGADORES[i].url + "' target='_blank'><img src='hotsite/images/" + NAVEGADORES[i].img + "'></a>";
            }
        }
    }
}

var onDataLoaded = function(index)
{
    Main.Instance.onDataLoaded(index);
}

function configInputMasks()
{
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
}

function onGetImage(data)
{

}

function Start()
{
    Main.Instance = new Main();

    Main.isMobile = isMobile();

    var myURL = window.location.href;
    if (myURL.indexOf("localhost") == -1 && myURL.indexOf("cadastro") == -1)
    {
        window.location.href = "http://www.freehelpapp.com.br/";
        return;
    }

    window.oldBrowser = false;
    if (window['FormData'] != null && window['btoa'] != null)
    {
        loadData("hotsite/data/main.html", "main");
    }
    else
    {
        oldBrowser = true;
        loadData("hotsite/data/oldbrowser.html", "main");
    }

    Analytics.Track(Analytics.TYPE.SITE_DESKTOP, "abriusite");
}


function RenewPasswordCallback(obj)
{
    if (obj == null)
    {
        //alert("Esse link de troca de senha não é mais válido");
    }
    else
    {
        openPopup("redefinirsenha");
    }
}


var redefinirSenha = function()
{
    var x = document.getElementById("formredefinirsenha");
    var pass = "";
    var pass2 = "";
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++)
        {
            if (x.elements[i].name == "password")
            {
                pass = x.elements[i].value.trim();
            }
            else if (x.elements[i].name == "js_password2")
            {
                pass2 = x.elements[i].value.trim();
            }
        }
    }

    if (pass != "" && pass.length >= 8 && pass == pass2)
    {
        var obj = DecodePasswordDate(BROWSE_PARAMETERS.rp);
         run("renewpassword.php", {"rp":BROWSE_PARAMETERS.rp, "id":obj.id, "pass":pass}, function(data) {

            if (data.trim() == "0")
            {

                // MENSAGEM DE ERRO
                var div = document.getElementById("redefinirsenhaerror");
                div.innerHTML = "Ocorreu um erro ao redefinir sua senha, por favor tente novamente.";
            }
            else
            {
                onLoginCallback(data.trim());
            }

        });
    }
    else
    {
        // ERRO DE SENHA NO FORM
        var div = document.getElementById("redefinirsenhaerror");

        if (pass.length < 8)
            div.innerHTML = "Sua senha deve ter 8 ou mais caracteres.";

        if (pass != pass2)
            div.innerHTML = "Sua senha e a confirmação não correspondem.";
    }
}
