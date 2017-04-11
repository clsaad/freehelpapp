var OnClick = {};


OnClick.OpenRecuperarSenha = function()
{
    var x = document.getElementById("formrecuperarsenha");
    if (x != null)
    {
        for (var i = 0; i < x.elements.length; i++)
        {
            x.elements[i].value = '';
        }
    }
    
    openPage('recuperarsenha');
}



OnClick.ClosePoliticaDePrivacidade = function()
{
    var lastPage = MobileMain.Instance.lastPage;
    if (lastPage == "politicadeprivacidade") lastPage = "home";
    openPage(lastPage);
}


OnClick.AceitarPoliticaDePrivacidade = function()
{
    Toggle.value("cadastrocheckbox", true);
    OnClick.ClosePoliticaDePrivacidade();
}


OnClick.RedefinirSenha = function()
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
         DataManager.run("renewpassword.php", {"rp":BROWSE_PARAMETERS.rp, "id":obj.id, "pass":pass}, function(data) {

            if (data.trim() == "0")
            {
            
                // MENSAGEM DE ERRO
                var div = document.getElementById("redefinirsenhaerror");
                div.innerHTML = "Ocorreu um erro ao redefinir sua senha, por favor tente novamente.";
            }
            else
            {
                Callbacks.onLoginCallback(data.trim());
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

OnClick.RecuperarSenha = function()
{
    var x = document.getElementById("formrecuperarsenha");
    var mail = "";
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {
            if (x.elements[i].name == "mail")
            {
                mail = x.elements[i].value.toLowerCase().trim();
            }
        }
    }
    
    if (mail != "")
    {
    
        DataManager.run("renewpassword.php", {"mail":mail}, function(data) {

            if (data.trim() == "1")
            {
            
            Alert.Show("Recuperação de Senha", "Um e-mail foi enviado com os dados de recuperação de senha para " + mail + ".", OnClick.GoHome);
                
            }
            else
            {
                var div = document.getElementById("recuperarsenhaerror");
                div.innerHTML = "E-mail não cadastrado.";
            }

        });   
        
    }
    else
    {
        var div = document.getElementById("recuperarsenhaerror");
        div.innerHTML = "Preencha o campo e-mail";
    }
}

OnClick.TopoVoltar = function()
{    
    if (MobileMain.Instance.currentPage.indexOf("cadastro") >= 0)
    {
        Alert.Show("Tem certeza?", "Deseja realmente interromper o cadastro?", OnClick.GoHome);
    }
    else if (MobileMain.Instance.currentPage.indexOf("servicelist") >= 0 ||
             MobileMain.Instance.currentPage.indexOf("home") >= 0)
    {
        //Alert.Show("Tem certeza?", "Deseja fechar o site FreeHelp?<br>" + document.referrer, OnClick.CloseSite);
    }
    else
    {
        var lastPage = MobileMain.Instance.lastPage;
        if (lastPage == "politicadeprivacidade") lastPage = "home";
        openPage(lastPage);
        
        OnClick.GoHome();   
    }
}


OnClick.CloseSite = function()
{
    //window.open("", "_self");
}

OnClick.GoHome = function()
{
    if (window.USER != null && window.USER.id != null)
    {
        openPage('servicelist');
    }
    else
    {
        openPage('home');
    }
}

// USUARIO =======

OnClick.ExcluirConta = function()
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
    
    if (password == window.USER.password)
    {
        //MSGBOX_NO = null;
        //MSGBOX_YES = confirmaExclusaoDeConta;
        //msgbox("Tem certeza?", "Ao excluir sua conta de usuário, seus serviços também serão excluidos!");
        
        MsgBox.Show("Deseja realmente excluir sua conta? Todos os seus registros serão apagados, e seus clientes não poderão mais encontra-lo no aplicativo FreeHelp", function() 
        {
        
            Callbacks.confirmaExclusaoDeConta();
            
        });
    }
    else
    {
        var div = document.getElementById("configerror");
        div.innerHTML = "Senha inválida";
        
        //$( "#effect_userconfig" ).effect( "shake" );
    }
        
}

OnClick.UpdateUserData = function()
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
    
    if (password == window.USER.password &&
       newpassword1.length >= 8 && newpassword1 == newpassword2)
    {
        DataManager.run("updateuser.php", {"userid":window.USER.id, "newpass":newpassword1}, Callbacks.onChangePassword);
    }
    else
    {
        var div = document.getElementById("configerror");
        div.innerHTML = "Senha inválida";
        
        //$( "#effect_userconfig" ).effect( "shake" );
    }
}

OnClick.OpenLogin = function()
{
    var x = document.getElementById("formlogin");
    if (x != null)
    {
        for (var i = 0; i < x.elements.length; i++)
        {
            x.elements[i].value = '';
        }
    }
    
    openPage("login");
    
    // focu no primeiro campodo formulario
    document.getElementById("formloginmail").focus();
    //DataManager.loadData("hotsite/mobile/data/mobilelogin.html", "content");
}

OnClick.OpenUserConfig = function()
{
    openPage("config");
    //DataManager.loadData("hotsite/mobile/data/mobilelogin.html", "content");
}

OnClick.Logout = function()
{
    DataManager.run("login.php", {exit:'1'}, Callbacks.onLogoutCallback);
}

OnClick.AutoLogin = function()
{
    DataManager.run("login.php", null, Callbacks.onLoginCallback);
}

OnClick.Login = function()
{
    var formValues = DataManager.getValuesFromForm("formlogin", true);
    
    formValues.mail = (formValues.mail == null) ? null : formValues.mail.trim();
    formValues.pass = (formValues.pass == null) ? null : formValues.pass.trim();
    
    if (formValues.mail == "")
    {
        var x = document.getElementById("loginerror");
        x.innerHTML = "E-mail não preenchido.";           
        $( "#effect_login" ).effect( "shake" );
    }
    else
    {
        DataManager.run("login.php", formValues, Callbacks.onLoginCallback);
    }
}

OnClick.OpenCadastrarUsuario = function(dadosIncompletos)
{    
    DataManager.fillForm('formcadastro');
    openPage("cadastrousuario");
    
    DataManager.updateCadastro = false;
    var firstChar = Callbacks.loginData.substr(0, 1);
    
    if (dadosIncompletos)
    {
        DataManager.updateCadastro = true;
        var data = Callbacks.loginData.substr(1);
        var json = JSON.parse(data);
        
        DataManager.fillForm("formcadastro", json);
    }
    
    //DataManager.loadData("hotsite/mobile/data/mobilecadastroservico.html", "content");
}

OnClick.CadastrarUsuario = function()
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
        concordou = Toggle.value("cadastrocheckbox");
        if (concordou == false) error = "Você deve concordar com os termos.";
    }
    
    
    
    if (error == "")
    {
        var formValues = DataManager.getValuesFromForm("formcadastro", true);
        formValues['table'] = 'user';
        formValues['temppassword']='';
        window.USERMAIL = formValues.mail;
        
        if (DataManager.updateCadastro == true)
        {
            formValues['update'] = '1';
        }
        
        DataManager.run("createuser.php", formValues, Callbacks.onCadastroUsuarioCallback);
    }
    else
    {
        var x = document.getElementById("cadastroerror");
        x.style.display = "block";
        x.innerHTML = error;   
        
        //$( "#effect_cadastro" ).effect( "shake" );  
    }
}

OnClick.DeletarUsuario = function()
{

}

// COMO FUNCTIONA =======

OnClick.ComoFunciona = function()
{
    if (MobileMain.Instance.currentPage.indexOf("cadastro") >= 0)
    {
        Alert.Show("Tem certeza?", "Deseja realmente interromper o cadastro?", function() {  openPage("comofunciona"); } );
    }
    else
    {
        openPage("comofunciona");  
    }    
}

// SERVICO =======

OnClick.ExcluirServico = function()
{
    MsgBox.Show("Deseja realmente excluir esse negócio? Seus clientes não poderão mais encontra-lo no aplicativo FreeHelp", function() 
    {
        var form_data = new FormData();                  
        form_data.append("serviceid", ServiceController.selectedServiceToEdit);
        form_data.append("delete", "1");

        $.ajax({
                    url: DOMAIN + '/php/updateservice.php', // point to server-side PHP script 
                    dataType: 'text',  // what to expect back from the PHP script, if anything
                    cache: false,
                    contentType: false,
                    processData: false,
                    data: form_data,                         
                    type: 'post',
                    success: function(php_script_response){
                        Callbacks.onCadastroServicoCallback(php_script_response);
                        
                        Analytics.Track(Analytics.TYPE.SITE_MOBILE, "servicoexcluido");
                    }
         });   
    });
}

OnClick.AbrirPoliticaDePrivacidade = function(showAccept)
{
    var el = document.getElementById('btnaceitarpoliticadeprivacidade');
    el.style.display = (showAccept == true) ? 'block' : 'none';
    
    openPage("politicadeprivacidade");
    //DataManager.loadData("hotsite/mobile/data/mobilepoliticadeprivacidade.html", "content");
}

OnClick.OpenCadastrarService = function(service)
{
    openPage('cadastroservico');
    ServiceController.fillForm(service);
}

OnClick.CadastrarService = function()
{
    ServiceController.cadastraServico();   
}

OnClick.CadastroImage = function()
{
    var fileElem = document.getElementById("cadastroservicoimage");

    if (fileElem) 
    {
        fileElem.click();
    }
}


OnClick.SelectionarFoto = function()
{

}

OnClick.DeleteService = function()
{

}


// BOTTOM =========

OnClick.AnuncieComAgente = function()
{
    openURL('mailto:midia@freehelpapp.com.br');
}

OnClick.Facebook = function()
{
    openURL('https://m.facebook.com/FreeHelp-1035604109784152/');
}
