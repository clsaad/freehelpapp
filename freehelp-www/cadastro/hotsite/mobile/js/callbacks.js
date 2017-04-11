var Callbacks = {};

Callbacks.onLogoutCallback = function(data)
{
    window.USERMAIL = null;
    window.USER = {};
    DataManager.loadData("hotsite/mobile/data/mobilehead.html", "head");
    openPage('home');
    
    
}

Callbacks.onClickReviewCadastro = function()
{
    OnClick.OpenCadastrarUsuario(true);
}

Callbacks.onLoginCallback = function(data)
{
    data = data.trim();
    
    Callbacks.loginData = data;
    
    var firstChar = data.substr(0, 1);
    
    if (firstChar == "x")
    {
        Alert.Show("Oops!!", "Parece que seu cadastro está incompleto, por favor confirme as informações de cadastro!", Callbacks.onClickReviewCadastro);
    }
    else if (isNaN(firstChar))
    {
        if (data.toLowerCase().trim() == "b")
        {
            var x = document.getElementById("loginerror");
            x.style.display = "block";
            x.innerHTML = "Conta bloqueada.\nEntre em contato através do e-mail sac@freehelpapp.com.br";  
            
            Alert.Show("Oops!!", "Parece que seu cadastro foi bloqueado, por favor entre em contato através do e-mail sac@freehelpapp.com.br");
        }
        else if (data.trim() != "E")
        {
            var x = document.getElementById("loginerror");
            x.style.display = "block";
            x.innerHTML = data;  
        }
    }
    else
    {
        Analytics.Track(Analytics.TYPE.SITE_MOBILE, "login");
        Callbacks.onGetUserData(data);
    }
}

Callbacks.onGetUserData = function(data)
{
    data = data.trim();
    
    var count = data.substr(0, 1);
    
    if (count != "x")
    {
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

            if (count == "0")
                Callbacks.onEnterWithNoServices();
            else
            {
                if (window.USER.status == 0)
                {
                    Alert.Show("Usuário bloqueado", "Seu usuário está temporariamente bloqueado e não aparacerá na busca do app. Por favor entre em contato com nossa equipe.")
                }
            }

            Callbacks.refreshServices();

            //var div = document.getElementById("usermail");
            //div.innerHTML = "<center>" + window.USER.mail + "</center>";  
        }
    }
}

Callbacks.onChangePassword = function(data)
{
    // TODO: SHOW MESSAGE HERE
    Alert.Show("Senha modificada!", "Agora você poderá logar-se com sua nova senha!");   
    OnClick.GoHome();
}


Callbacks.confirmaExclusaoDeConta = function()
{
    DataManager.run("deleteuser.php", {"userid":window.USER.id}, Callbacks.onUserDeleted);
}

Callbacks.onUserDeleted = function()
{
    OnClick.Logout();
    Analytics.Track(Analytics.TYPE.SITE_MOBILE, "contaexcluida");
}

Callbacks.onEnterWithNoServices = function()
{

}

Callbacks.refreshServices = function()
{
    DataManager.run("getuserservices.php", {"userid":USER.id }, Callbacks.showServices);
}

Callbacks.addServiceData = function(json, container)
{
    var div = document.createElement("div");
    container.appendChild(div);
    
    div.style.background = "url('hotsite/mobile/images/servicemoldura.png')";
    div.style.position = 'relative';
    div.style.fontSize = '50px';
    div.style.width = 900;
    div.style.height = 227;
    div.style.marginTop = 25;
    div.style.marginBottom = 25;
    div.style.left = 30;
    
    var posY = [60, 40, 30];
    var posIndex = -1;
    
    var categoryText =  '';
    
    for (var i = 1; i <= 3; i++)
    {
        if (json['category' + i] > 0)
        {
            var str = ServiceController.getOccupationAsString(json['occupation' + i]);
            if (str == '') str = ServiceController.getSubCategoryAsString(json['subcategory' + i]);
            if (str == '') str = ServiceController.getCategoryAsString(json['category' + i])
            
            categoryText += str + '<br>';
            
            /*
    categoryText += ServiceController.getCategoryAsString(json['category' + i]) + 
                    ServiceController.getSubCategoryAsString(json['subcategory' + i]) +
                    ServiceController.getOccupationAsString(json['occupation' + i]) + '<br>';
                    */
            
            posIndex++;
        }
    }
    
    var divText = document.createElement('div');
    divText.style.position = 'absolute';
    divText.style.left = 250;
    divText.style.top = posY[posIndex];
    divText.innerHTML = json.name;
    div.appendChild(divText);
    
    divText = document.createElement('div');
    divText.style.fontSize = '3vw';
    divText.style.lineHeight = '120%';
    divText.style.position = 'absolute';
    divText.style.left = 250;
    divText.style.top = posY[posIndex] + 60;
    divText.innerHTML = categoryText;
    div.appendChild(divText);
    
    var img = document.createElement('img');
    var imgSrc = (json.image == "" || json.image == null) ? "hotsite/images/serviceimagesmall.png" : "data:image/jpeg;base64," + json.image;
    img.setAttribute('src', imgSrc);
    img.setAttribute('height', 200);
    img.style.borderRadius = '100px';
    img.style.position = 'absolute';
    img.style.left = 14;
    img.style.top = 14;
    
    var btnEdit = document.createElement('img');
    btnEdit.setAttribute('src', 'hotsite/mobile/images/btn_editar_0.png');
    btnEdit.style.position = 'absolute';
    btnEdit.style.left = 700;
    btnEdit.style.top = 75;
    btnEdit.setAttribute('alt', "OnClick.OpenCadastrarService(" + JSON.stringify(json) +  ")");
    btnEdit.setAttribute('class', "toggleimg");
    
    div.appendChild(img);
    div.appendChild(btnEdit);

}

Callbacks.onCadastroServicoCallback = function(data)
{
    if (data.trim() == "0")
    {
        Alert.Show("Oops!!", "Não foi possivel localizar seu endereço, por favor revise as informações do cadastro");   
    }
    else
    {
        Callbacks.refreshServices();
    }
}

Callbacks.showServices = function(data)
{
    openPage('servicelist');
    
    data = data.replace(/(?:\r\n|\r|\n)/g, '<br>');
    
    var json = JSON.parse(data.trim());
    var container = document.getElementById('servicebox');
    
    container.innerHTML = "";
    
    var trapezio = document.createElement('div');
    trapezio.style.fontSize = 40;
    trapezio.style.width = 850;
    trapezio.style.position = 'absolute';
    trapezio.style.left = 50;
    trapezio.style.top = -5;
    trapezio.style.paddingTop = 10;
    trapezio.style.height = 79;
    trapezio.style.textAlign = 'center';
    trapezio.style.background = "url('hotsite/mobile/images/trapezio.png')";
    trapezio.innerHTML = window.USER.mail;
    container.appendChild(trapezio);
    
    var separator = document.createElement('div');
    separator.style.position = 'relative';
    separator.style.height = 60;
    separator.style.width = 60;
    container.appendChild(separator);
    
    if (json.data.length > 0)
    {
        for (var i = 0; i < json.data.length; i++)
        {
            Callbacks.addServiceData(json.data[i], container);
        }
    }
    else
    {
        var divText = document.createElement("div");
        divText.style.position = "absolute";
        divText.style.width = 900;
        divText.style.top = 200;
        divText.style.fontSize = "4vw";
        divText.style.color = "FFFFFF";
        divText.style.textShadow = '3px 3px 10px rgba(0, 0, 0, 0.5)';
        divText.style.textAlign = "center";
        divText.innerHTML = "Esse espaço é seu.<br>Utilize o botão \"Adicionar Negócio\"<br>para cadastrar quantos serviços quiser.";
        
        container.appendChild(divText);
        
        if (window.USER.showPopup != true)
        {
            window.USER.showPopup = true;
            Alert.Show("Bem vindo ao FreeHelp!", "Cadastre um ou mais serviços para que seus clientes possam te encontrar.", OnClick.OpenCadastrarService);
        }
    }
    
    ToggleImg.Init();
}

Callbacks.onCadastroUsuarioCallback = function(data)
{

    data = data.trim();
    var firstChar = data.substr(0, 1);
    if (isNaN(firstChar))
    {
        var x = document.getElementById("cadastroerror");
        x.style.display = "block";
        x.innerHTML = data;   
    }
    else
    {
        Callbacks.onGetUserData(data);
        
        Analytics.Track(Analytics.TYPE.SITE_MOBILE, "cadastrousuario");
    }
}


Callbacks.ordenaLista = function(lista)
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


Callbacks.onGetCategories = function(data)
{
    window.CATEGORY = Callbacks.ordenaLista(JSON.parse(data)["data"]);
    
    for (var j = 1; j <= 3; j++)
    {
        var sel = document.getElementById('formcadastrocategoria' + j);
        for (var i = 0; i < window.CATEGORY.length; i++)
        {
            sel.options[i + 1] = new Option(htmlDecode(window.CATEGORY[i].name), window.CATEGORY[i].id);
        }
    }
}


Callbacks.onGetSubCategories = function(data)
{
    window.SUBCATEGORY = Callbacks.ordenaLista(JSON.parse(data)["data"]);

}

Callbacks.onGetOccupations = function(data)
{
    window.OCCUPATION = Callbacks.ordenaLista(JSON.parse(data)["data"]);   
    window.OCCUPATION.push(
    {
        category:'-1',
        subcategory:'-1',
        id:'-1',
        name:'- Outros'
    });
}


Callbacks.fillByCep = function()
{
    var cep = "";
    var x = document.getElementById("formcadastroservico");
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {   
            if (x.elements[i].name == "end_cep")
            {
                cep = getNumbersOfString(x.elements[i].value.trim());
            }
        }
    }
    
   //run("http://cep.republicavirtual.com.br/web_cep.php?cep=" + cep + "&formato=json", {}, onCepCallback);
   if (cep.length == 8)
        DataManager.run("cep.php", {"cep":cep}, Callbacks.onCepCallback);
    else
        Callbacks.onCepCallback("{'erro':true}");
    
    return false;  
}

Callbacks.onCepCallback = function(data)
{
    var json = null;
    var empty = true;
    if (IsJsonString(data))
    {
        json = JSON.parse(data); 
        empty = (json.erro == true);
    }
    
    if (empty == false)
    {
        var x = document.getElementById("formcadastroservico");
        if (x != null)
        {
            for (var i = 0; i < x.length ;i++) 
            {   
                if (x.elements[i].name == "end_endereco")
                {
                    x.elements[i].value = json.logradouro;
                }

                if (x.elements[i].name == "end_numero")
                {
                    x.elements[i].value = "";
                }

                if (x.elements[i].name == "end_complemento")
                {
                    x.elements[i].value = "";
                }

                if (x.elements[i].name == "end_bairro")
                {
                    x.elements[i].value = json.bairro + " - " + json.localidade + " - " + json.uf;
                }
            }
        }
    }
}




Callbacks.onChangeComoSoube = function()
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
            
            if (x.elements[i].name == "js_other")
            {
                if (how == '')
                {
                    x.elements[i].style.display = 'block';
                    how = x.elements[i].value;
                }
                else
                {
                    x.elements[i].style.display = 'none';
                }
            }
            
            if (x.elements[i].name == "how")
            {
                x.elements[i].value = how;
            }
        }
    }
}





