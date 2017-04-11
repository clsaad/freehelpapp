var selectedServiceToEdit = -1;
var userServiceList = [];

var formError = false;


function refreshServices()
{
    run("getuserservices.php", {"userid":USER.id }, showServices);
    openPage("loading");
}


function novoServico()
{
    selectedServiceToEdit = -1;
    clearCadastro();
    openPopup("cadastroservico");
}

function IsJsonString(str) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}



function onCepCallback(data)
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
                    x.elements[i].value = empty ? "" : json.logradouro;
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
                    x.elements[i].value = empty ? "" : json.bairro + " - " + json.localidade + " - " + json.uf;
                }
            }
        }
    }
    
    /*
    var json = JSON.parse(data);  
    var empty = (json.resultado != "1")
    
   var x = document.getElementById("formcadastroservico");
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {   
            if (x.elements[i].name == "end_endereco")
            {
                x.elements[i].value = empty ? "" : json.tipo_logradouro + " " + json.logradouro;
            }

            if (x.elements[i].name == "end_numero")
            {
                x.elements[i].value = "";
            }

            if (x.elements[i].name == "end_bairro")
            {
                x.elements[i].value = empty ? "" : json.bairro;
            }
        }
    }
    */
}

function fillByCep()
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
        run("cep.php", {"cep":cep}, onCepCallback);
    else
        onCepCallback("{'erro':true}");
    
    return false;  
}


function clearCadastro()
{
    document.getElementById("formcadastroservico").reset();
    
    var x = document.getElementById("formcadastroservico");
    var location = "";
    
    if (x != null)
    {
        for (var i = 0; i < x.elements.length; i++)
        {
            x.elements[i].style.backgroundColor = "#FFFFFF";
        }
    }
    
    for (var j = 1; j <= 3; j++)
    {
        var sel = document.getElementById('formcadastrocategoria' + j);
        
         while (sel.length > 0)
        {
            sel.remove(0);   
        }
        
         sel.options[0] = new Option(" -- Categoria -- ");
            sel.options[0].selected="selected";
        
        for (var i = 0; i < window.CATEGORY.length; i++)
        {
            sel.options[i + 1] = new Option(htmlDecode(window.CATEGORY[i].name), window.CATEGORY[i].id);
        }
        
        sel.selectedIndex = 0;
        
        sel.style.backgroundColor = "#FFFFFF";
        
        
        sel = document.getElementById('formcadastrosubcategoria' + j);
        
         while (sel.length > 0)
        {
            sel.remove(0);   
        }
        
        sel.options[0] = new Option(" -- Sub-Categoria -- ");
        sel.options[0].selected="selected";
        
        
        sel.selectedIndex = 0;
        
        sel.style.backgroundColor = "#FFFFFF";
    }
    
    var img = document.getElementById("imgcadastroservico");
    img.style.display = 'none'    
}



function onCadastroServicoCallback(data)
{
    if (data.trim() == "0")
    {
        document.getElementById("divcadastroservico").style.display = 'none';
        internalAlert("Oops!!", "Não foi possivel localizar seu endereço, por favor revise as informações do cadastro", function()
        {
            document.getElementById("divcadastroservico").style.display = 'block';
            document.getElementById("shadow").style.display = 'block';
        });   
    }
    else
    {
        closePopup();
        refreshServices();
    }
}


function getCategoryAsString(id)
{
    for (var i = 0; i < window.CATEGORY.length; i++)
    {
        if (window.CATEGORY[i].id == id) return window.CATEGORY[i].name;
    }
    return "";
}

function getSubCategoryAsString(id)
{
    for (var i = 0; i < window.SUBCATEGORY.length; i++)
    {
        if (window.SUBCATEGORY[i].id == id) return window.SUBCATEGORY[i].name;
    }
    return "";
}

function getOccupationAsString(id)
{
    for (var i = 0; i < window.OCCUPATION.length; i++)
    {
        if (window.OCCUPATION[i].id == id) return window.OCCUPATION[i].name;
    }
    return "- Outros";
}


function getSubCategoriaByService(service)
{
    var str = "";
    for (var j = 1; j <= 3;j++)
    {
        var _str = "";
        
        _str += getCategoryAsString(service["category" + j])
        if (_str != "")
        {
            if (str != "") str += "<br>";
            _str += " | " + getSubCategoryAsString(service["subcategory" + j]);

            if (service["occupation" + j] > 0)
            {
                 _str += " | " + getOccupationAsString( service["occupation" + j] );  
            }
        }
        
        str += _str;
    }
        
    return str;
}

function showServices(services)
{
    var _div = document.getElementById("lixeiracadastroservico");
    _div.style.visibility='hidden';
    
    _div = document.getElementById("btnsalvarcadastro");
    _div.style.visibility='hidden';
    
    services = services.trim().replace(/(?:\r\n|\r|\n)/g, '<br>');
    
    var el = document.getElementById("servicescontent");
    el.innerHTML = "";
    var html = "";
    
    userServiceList = [];
    
    var showEmptyMessage = true;
    
    if (services != "0")
    {
        var baseData = loadedData["servicedata"];
        var json = JSON.parse(services);

        if (json["data"] == undefined)
        {
            // EMPTY MESSAGE
        }
        else
        {
            userServiceList = json["data"];
            for (var i = 0; i < json["data"].length; i++)
            {
                showEmptyMessage = false;
                
                var name = json["data"][i]["name"];
                var txt = baseData.replace("#title", SPY.Decode( name ));
                
                var subcategorias = json["data"][i];
                
                txt = txt.replace("#desc", getSubCategoriaByService(json["data"][i]));
                txt = txt.replace("#id", i);
                
                if (json["data"][i]["image"] == "")
                {
                    txt = txt.replace("#img", "hotsite/images/serviceimagesmall.png");
                }
                else
                {
                    txt = txt.replace("#img", "data:image/jpeg;base64," + json["data"][i]["image"]);
                }
                
                html += txt;
            }
        }
    }
    
    
    if (showEmptyMessage == true)
    {
        html = "<div style='position:relative;top:65px'><center><img src='hotsite/images/noservicefound.png'></center></div>";   
    }
    
    
    el.innerHTML = html; 
    
    
    
    
    openPage("services");

}



function onClickEditService(id)
{
    selectedServiceToEdit = userServiceList[id].id;
    
    
    
    clearCadastro();
    fillCadastroForm(userServiceList[id]);
    
    openPopup("cadastroservico");
    
    var _div = document.getElementById("lixeiracadastroservico");
    _div.style.visibility='visible';
    
    _div = document.getElementById("btnsalvarcadastro");
    _div.style.visibility='visible';
}



function fillCadastroForm(service)
{    
    var x = document.getElementById("formcadastroservico");
    
    if (x != null)
    {
        for (var i = 0; i < x.elements.length; i++)
        {
            if (x.elements[i].name == "name" ||
                x.elements[i].name == "additional1" ||
                x.elements[i].name == "additional2" ||
                x.elements[i].name == "additional3" ||
                x.elements[i].name == "end_cep" ||
                x.elements[i].name == "end_endereco" ||
                x.elements[i].name == "end_numero" ||
                x.elements[i].name == "end_bairro" ||
                x.elements[i].name == "end_complemento" ||
                x.elements[i].name == "celular" ||
                x.elements[i].name == "telefone" ||
                x.elements[i].name == "site" ||
                x.elements[i].name == "mail" ||
                x.elements[i].name == "description" )
            {
                if (service[x.elements[i].name] != null)
                {
                    var str = SPY.Decode( service[x.elements[i].name].trim() ).trim();
                    x.elements[i].value =  str;
                }
            }
        }
    }
    
    for (var i = 1; i <= 3; i++)
    {
        var cat = document.getElementById("formcadastrocategoria" + i);
        var sub = document.getElementById("formcadastrosubcategoria" + i);
        var occ = document.getElementById("formcadastrooccupation" + i);
        
        if (service["category" + i] != "0")
            cat.value = service["category" + i];
       
        onServiceChangeCategory(i);
        
        if (service["subcategory" + i] != "0")
            sub.value = service["subcategory" + i];
        
        onServiceChangeSubCategory(i);
        
        if (service["occupation" + i] != "0")
            occ.value = service["occupation" + i];
    }
    
    if (service["image"] != null && service["image"] != '')
    {
        var img = document.getElementById("imgcadastroservico");
        img.src = "data:image/jpeg;base64," + service["image"];
        img.style.display = 'block';
    }
}

/*
function handleFiles(files) {
  for (var i = 0; i < files.length; i++) 
  {
    var file = files[i];
    var imageType = /^image\//;
    
    if (!imageType.test(file.type)) {
      continue;
    }
    
    var img = document.createElement("img");
    img.classList.add("obj");
    img.file = file;
    var div = document.getElementById("divcadastroservicoimagem");
    div.innerHTML = "";
    div.appendChild(img); // Assuming that "preview" is the div output where the content will be displayed.
    
    var reader = new FileReader();
    reader.onload = (function(aImg) 
    { 
        return function(e) 
        {
            aImg.src = e.target.result; 
            aImg.width = "108";
            aImg.height = "108";
        }; 
    })(img);
    reader.readAsDataURL(file);
  }
}
*/

function onLixeiraCadastroOver(over)
{
    var lixeiraID = (over == true) ? "1" : "0";
    var div = document.getElementById("cadastrolixeira");   
    div.style.backgroundImage="url(hotsite/images/excluir_negocio_" + lixeiraID + ".png)";
}


function onFotoOver(over)
{
    var id = (over == true) ? "2" : "1";
    var div = document.getElementById("cadastroservicoimageminneronoff");   
    div.style.backgroundImage="url(hotsite/images/foto" + id + ".png)";
}


function onClickCadastroImage()
{
    var fileElem = document.getElementById("cadastroservicoimage");

    if (fileElem) 
    {
        fileElem.click();
    }
}


function onClickCadastrar()
{
    cadastraServico();
}


function markFieldError(field, isCorrect)
{
    if (isCorrect == false) formError = true;
    field.style.backgroundColor = isCorrect ? "#FFFFFF" : "#FFCCCC";
    return isCorrect;
}


function cadastraServico()
{
    var file_data = $('#cadastroservicoimage').prop('files')[0];  
    var form_data = new FormData();                  
    form_data.append('file', ImgHandler.file);
    
    ImgHandler.file = null;
    
    var x = document.getElementById("formcadastroservico");
    
    // CHECK ERROR
    
    var eCelular = null;
    var eTelefone = null;
    
    formError = false;
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {   
            if (x.elements[i].name == "telefone")
            {
                eTelefone = x.elements[i];
            }
            else if (x.elements[i].name == "celular")
            {
                eCelular = x.elements[i];
            }
            
            if (x.elements[i].name != "image" && 
                x.elements[i].name.indexOf("occupation") != 0 &&
                x.elements[i].name.indexOf("telefone") != 0 &&
                x.elements[i].name.indexOf("celular") != 0 &&
                x.elements[i].name.indexOf("site") != 0 &&
                x.elements[i].name.indexOf("mail") != 0 &&
               x.elements[i].name.indexOf("end_complemento") != 0)
            {
                markFieldError(x.elements[i], x.elements[i].value.trim() != "");
            }
            
            
            if (x.elements[i].name == "end_cep")
            {
                markFieldError(x.elements[i], validaCep(x.elements[i].value.trim()));
            }
            
            /*
            if (x.elements[i].name == "celular")
            {
                markFieldError(x.elements[i], validaCelular(x.elements[i].value));
            }
            */
            /*
            if (x.elements[i].name == "telefone")
            {
                markFieldError(x.elements[i], validaTelefone(x.elements[i].value));
            }
            */
        }
        
        if ((validaTelefone(eTelefone.value) ||
            validaCelular(eCelular.value)) == false)
        {
            markFieldError(eTelefone, false);
            markFieldError(eCelular, false);
        }
        else
        {
            if (validaTelefone(eTelefone.value) == false) eTelefone.value = "";
            if (validaCelular(eCelular.value) == false) eCelular.value = "";
        }
        
        markFieldError(document.getElementById("formcadastrocategoria1"), document.getElementById("formcadastrocategoria1").selectedIndex != 0);
       
        markFieldError(document.getElementById("formcadastrosubcategoria1"), document.getElementById("formcadastrosubcategoria1").selectedIndex != 0);
        
        markFieldError(document.getElementById("formcadastrocategoria2"), document.getElementById("formcadastrosubcategoria2").selectedIndex != 0 ||  document.getElementById("formcadastrocategoria2").selectedIndex == 0);
        
        markFieldError(document.getElementById("formcadastrocategoria3"), document.getElementById("formcadastrosubcategoria3").selectedIndex != 0 ||  document.getElementById("formcadastrocategoria3").selectedIndex == 0);
    
        
        if (formError)
        {
            $( "#effect_cadastroservico" ).effect( "shake" );
            return;
        }
    }
    else
    {
        return;   
    }
    
    
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {   
            if (x.elements[i].name.indexOf("js_") == 0)
            {
                // do nothing :))   
            }
            else if (x.elements[i].name.indexOf("end_") == 0)
            {
                var val = x.elements[i].value;
                val = SPY.Encode(val);  
                form_data.append(x.elements[i].name, val);
            }
            else if (x.elements[i].name.indexOf("additional") == 0)
            {
                var val = x.elements[i].value;
                val = SPY.Encode(val);  
                form_data.append(x.elements[i].name, val);
            }
            else
            {
                var val = x.elements[i].value;
                val = SPY.Encode(val);  
                form_data.append(x.elements[i].name, val);
            }
        }
    }
    
    for (var i = 1; i <= 3; i++)
    {
        var cat = document.getElementById("formcadastrocategoria" + i).value;
        var sub = document.getElementById("formcadastrosubcategoria" + i).value;
        var occ = document.getElementById("formcadastrooccupation" + i).value;
        
        if (isNaN(cat)) cat = '0';
        if (isNaN(sub)) sub = '0';
        if (isNaN(occ)) occ = '0';
        
        form_data.append("category" + i, cat);
        form_data.append("subcategory" + i, sub);
        form_data.append("occupation" + i, occ);
    }
    
    form_data.append("userid", window.USER.id);
    
    
    if (selectedServiceToEdit != undefined && selectedServiceToEdit > 0)
    {
        form_data.append("update", "1");
        form_data.append("serviceid", selectedServiceToEdit);
        Analytics.Track(Analytics.TYPE.SITE_DESKTOP, "atualizaservico");
    }
    else
    {
        Analytics.Track(Analytics.TYPE.SITE_DESKTOP, "cadastroservico");
    }
    
    
    if (x != null)
    {
        for (var i = 0; i < x.length ;i++) 
        {  
            markFieldError(x.elements[i], true);
        }
    }
    
    //*
    
    
    $.ajax({
                url: DOMAIN + '/php/updateservice.php', // point to server-side PHP script 
                dataType: 'text',  // what to expect back from the PHP script, if anything
                cache: false,
                contentType: false,
                processData: false,
                data: form_data,                         
                type: 'post',
                success: function(php_script_response){
                    onCadastroServicoCallback(php_script_response);
                }
     });
     //*/
}




var onServiceChangeSubCategory  = function(line)
{
    var sel = document.getElementById('formcadastrosubcategoria' + line);
    var id = sel.value;

    sel = document.getElementById('formcadastrooccupation' + line);

    while (sel.length > 0)
    {
        sel.remove(0);   
    }

    sel.options[0] = new Option(" -- Ocupação -- ");

    var count = 1;

    for (var i = 0; i < window.OCCUPATION.length; i++)
    {
        if (window.OCCUPATION[i].subcategory == id || window.OCCUPATION[i].subcategory == -1)
        {
            sel.options[count] = new Option(htmlDecode(window.OCCUPATION[i].name), window.OCCUPATION[i].id);
            count++;
        }
    }
}

var onServiceChangeCategory  = function(line)
{
    var sel = document.getElementById('formcadastrocategoria' + line);
    var id = sel.value;

    sel = document.getElementById('formcadastrosubcategoria' + line);

    while (sel.length > 0)
    {
        sel.remove(0);   
    }

    sel.options[0] = new Option(" -- Sub-Categoria -- ");

    var count = 1;

    for (var i = 0; i < window.SUBCATEGORY.length; i++)
    {
        if (window.SUBCATEGORY[i].category == id)
        {
            sel.options[count] = new Option(htmlDecode(window.SUBCATEGORY[i].name), window.SUBCATEGORY[i].id);
            count++;
        }
    }
    
    onServiceChangeSubCategory(line);
}


function alertClickRemoveService()
{
    MSGBOX_NO = null;
    MSGBOX_YES = onClickRemoveService;
    msgbox("Tem certeza?", "Ao excluir seu serviço, ele não ficará mais visível aos usuários!");   
}

function onClickRemoveService()
{
    var form_data = new FormData();                  
    form_data.append("serviceid", selectedServiceToEdit);
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
                    //trace(php_script_response); // display response from the PHP script, if any
                    onCadastroServicoCallback(php_script_response);
                    
                    Analytics.Track(Analytics.TYPE.SITE_DESKTOP, "servicoexcluido");
                }
     });
}
