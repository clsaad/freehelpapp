var ServiceController = {};

ServiceController.fillForm = function(service)
{
    ServiceController.selectedServiceToEdit = (service == null) ? 0 : service.id;
    
    var lixeira = document.getElementById('lixeiraservico');
    lixeira.style.display = (service == null) ? 'none' : 'block';
    
    var btnSalvar = document.getElementById('btnsalvarcadastroservico');
    
    document.getElementById('btn_efetuarcadastro').style.display = (service == null) ? 'block' : 'none';
    document.getElementById('btn_salvarcadastro').style.display =  (service != null) ? 'block' : 'none';
    
    if (service == null)
    {
        var x = document.getElementById("formcadastroservico");
        if (x != null)
        {
            for (var i = 0; i < x.elements.length; i++)
            {
                x.elements[i].value = '';
            }
        }
        
        
        var img = document.getElementById("imgcadastroservico");
        img.style.display = 'none';
        
        ServiceController.hideCategory(2); 
        ServiceController.hideCategory(3); 
        
        return;
    }
    
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
                    var str = service[x.elements[i].name].trim();
                    str = str.replace(/(?:<br>)/g, '\n');
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
        {
            cat.value = service["category" + i];
            if ( i >= 2)
            {
                ServiceController.addCategory(i); 
            }
        }
        else
        {
            if ( i >= 2)
            {
                ServiceController.hideCategory(i); 
            }
        }
       
        ServiceController.onServiceChangeCategory(i);
        
        if (service["subcategory" + i] != "0")
            sub.value = service["subcategory" + i];
        
        ServiceController.onServiceChangeSubCategory(i);
        
        if (service["occupation" + i] != "0")
            occ.value = service["occupation" + i];
    }
    
    var img = document.getElementById("imgcadastroservico");
    if (service["image"] != undefined && service["image"] != "")
    {
        img.src = "data:image/jpeg;base64," + service["image"];
        img.style.display = 'block';
    }
    else
    {
        img.style.display = 'none';
    }
    
    /*
    var div = document.getElementById("divcadastroservicoimagem");
    div.innerHTML = "";
    
    if (service["image"] != undefined && service["image"] != "")
    {
        div.innerHTML = "<img width='108px' height='108px' src='data:image/jpeg;base64," + service["image"] + "'>" ;
    }
    */
}


ServiceController.addCategory  = function(line)
{
    var btn = document.getElementById('btnaddcategory' + line);
    btn.style.display = 'none';
    
    var div = document.getElementById('divcategory' + line);
    div.style.display = 'block';
}

ServiceController.hideCategory  = function(line)
{
    var btn = document.getElementById('btnaddcategory' + line);
    btn.style.display = 'block';
    
    var div = document.getElementById('divcategory' + line);
    div.style.display = 'none';
}


ServiceController.onServiceChangeSubCategory  = function(line)
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

ServiceController.onServiceChangeCategory  = function(line)
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
    
    ServiceController.onServiceChangeSubCategory(line);
}



ServiceController.handleFiles = function(files) {
  
    
  for (var i = 0; i < files.length; i++) 
  {
    var file = files[i];
    var imageType = /^image\//;
    
    if (!imageType.test(file.type)) {
      continue;
    }
      
      
    var img = document.getElementById("imgcadastroservico");
    img.classList.add("obj");
    img.file = file;
      
    var reader = new FileReader();
    reader.onload = (function(aImg) 
    { 
        return function(e) 
        {
            aImg.src = e.target.result; 
            aImg.style.display = 'block';
        }; 
    })(img);
    reader.readAsDataURL(file);
  }
}



ServiceController.getCategoryAsString = function(id)
{
    for (var i = 0; i < window.CATEGORY.length; i++)
    {
        if (window.CATEGORY[i].id == id) return window.CATEGORY[i].name;
    }
    return "";
}

ServiceController.getSubCategoryAsString = function(id)
{
    for (var i = 0; i < window.SUBCATEGORY.length; i++)
    {
        if (window.SUBCATEGORY[i].id == id) return  window.SUBCATEGORY[i].name;
    }
    return "";
}

ServiceController.getOccupationAsString = function(id)
{
    if (id > 0)
    {
        for (var i = 0; i < window.OCCUPATION.length; i++)
        {
            if (window.OCCUPATION[i].id == id) return window.OCCUPATION[i].name;
        }
    }
    return "";
}




ServiceController.cadastraServico = function()
{
    var form_data = new FormData();  
    
    
    var file_data = $('#cadastroservicoimage').prop('files')[0];                
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
                x.elements[i].name.indexOf("category") != 0 &&
                x.elements[i].name.indexOf("subcategory") != 0 &&
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
        
        if (document.getElementById("formcadastrocategoria2").selectedIndex != 0)
            markFieldError(document.getElementById("formcadastrosubcategoria2"), document.getElementById("formcadastrocategoria2").selectedIndex != 0);
        
        if (document.getElementById("formcadastrocategoria3").selectedIndex != 0)
        markFieldError(document.getElementById("formcadastrosubcategoria3"), document.getElementById("formcadastrocategoria3").selectedIndex != 0);
        
        
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
                var val = x.elements[i].value.trim();
                form_data.append(x.elements[i].name, val);
            }
            else if (x.elements[i].name.indexOf("additional") == 0)
            {
                var val = x.elements[i].value.trim(); 
                form_data.append(x.elements[i].name, val);
            }
            else
            {
                var val = x.elements[i].value.trim();
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
    
    
    if (ServiceController.selectedServiceToEdit != undefined && ServiceController.selectedServiceToEdit > 0)
    {
        form_data.append("update", "1");
        form_data.append("serviceid", ServiceController.selectedServiceToEdit);
        Analytics.Track(Analytics.TYPE.SITE_MOBILE, "atualizaservico");
    }
    else
    {
        Analytics.Track(Analytics.TYPE.SITE_MOBILE, "cadastroservico");   
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
                    
                    Callbacks.onCadastroServicoCallback(php_script_response);
                    
                }
     });
 //*/
}


