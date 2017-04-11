var SideMenu = {};

SideMenu.lastClick = {};

SideMenu.create = function(user)
{
    Admin.user = user;        
    
    var div = document.getElementById("sidemenu");
    div.innerHTML = "";
    
    div.style.display = (Admin.user == null) ? 'none' : 'block';   
    
    var links = 
    [
        {label:"- Configurações -", type:"label"},
        {label:"Sobre o FreeHelp", type:"table", tag:"about"},
        {label:"Politica de Privacidade", type:"table", tag:"politica"},
        {label:"Textos de Email", type:"table", tag:"email"},
        {type:"space"}, 
        {label:"- Validação -", type:"label"},
        {label:"Comentários (" + Admin.unverifiedCommentCount + ")", type:"table", tag:"unverifiedcomment"},
        {type:"space"}, 
        {label:"- Tabelas -", type:"label"},
        {label:"Categorias (" + Admin.categoryCount + ")", type:"table", tag:"category"},
        {label:"Sub-Categorias (" + Admin.subcategoryCount + ")", type:"table", tag:"subcategory"},
        {label:"Ocupações (" + Admin.occupationCount + ")", type:"table", tag:"occupation"},
        {label:"Fornecedores (" + Admin.userCount + ")", type:"table", tag:"user"},
        {label:"Serviços (" + Admin.serviceCount + ")", type:"table", tag:"service"},
        {label:"Usuários do APP (" + Admin.appuserCount + ")", type:"table", tag:"appuser"},
        {label:"Banners", type:"table", tag:"banner"},
        //{type:"space"}, {label:"Teste", type:"table", tag:"teste"},
        {type:"space"}, 
        {label:"- Administradores -", type:"label"},
        {label:"Administradores", type:"table", tag:"adminuser"},
        {type:"space"},   
        {label:"- Estatísticas -", type:"label"},
        //{label:"Serviços por Categoria", type:"statistic", tag:"category"},
        {label:"Cadastros - App", type:"report", tag:"cadastroapp"},
        {label:"Cadastros - Fornecedor", type:"report", tag:"cadastrofornecedor"},
        {label:"Cadastros - Serviços", type:"report", tag:"cadastroservice"},
        {label:"Acessos - App", type:"report", tag:"acessoapp"},
        {label:"Acessos - Serviços", type:"report", tag:"service"},
        {label:"Acessos - Categorias", type:"report", tag:"category"},
        {label:"Acessos - Sub-Categ.", type:"report", tag:"subcategory"},
        //{label:"Cadastro por Periodo", type:"statistic", tag:"category"},
        
    ];
    
    var str = "";
    
    str += "FREEHELP<br>Painel Administrativo<br><br>";
    
    for (var i = 0; i < links.length; i++)
    {
        if (links[i].type == "label")
        {
            str += links[i].label + "<br>";   
        }
        else if (links[i].type == "space")
        {
            str += "<br>";   
        }
        else
        {
            var linkTag = Admin.user != null ? "<a href=\"javascript:SideMenu.clickMenu('" + links[i].label + "', '" + links[i].type + "', '" + links[i].tag + "');\">" : "";
            var linkTagEnd = Admin.user != null ? "</a>" : "";
            str += linkTag + links[i].label + linkTagEnd + "<br>";
        }
    }
    
    if (Admin.user != null)
    {
        str += "<br><br>";
        str += "- " + SideMenu.GetShortName(Admin.user.name, 2) + " -<br>";
        str += "<a href='javascript:Login.Logout()'><img src='images/exit.png'> logout </a>";
    }
    else
    {
        var overDiv = document.createElement("div");
        overDiv.style.width = '100%';
        overDiv.style.height = '100%';
        overDiv.style.backgroundColor = 'rgba(0, 0, 0, 0.5)';
        overDiv.style.position = "absolute";
        overDiv.style.top = 0;
        overDiv.style.left = 0;

        div.appendChild(overDiv);   
    }
    
    div.innerHTML += str + "<br><br><br>";
    
    
    
}

SideMenu.GetShortName = function(name, num)
{
    if (num == null) num = 1;
    var str = "";
    var parts = name.split(" ");
    for (var i = 0; i < parts.length; i++)
    {
        if (i < num)
        {
            if (str != "") str += " ";
            str += parts[i];   
        }
    }
    return str;
}

SideMenu.clickMenu = function(label, type, tag, dontClearPath, page)
{
    if (dontClearPath != true)
    {
        Admin.ClearClickPath();   
    }
    else
    {
        Admin.SliceClickPath(label);   
    }
    
    SideMenu.lastClick.label = label;
    SideMenu.lastClick.type = type;
    SideMenu.lastClick.tag = tag;
    
    Admin.AddClickPath(label, "Admin.click", [label, type, tag, dontClearPath]);
    
    if (type == "table")
    {
        if (page == undefined) page = 1;
        Admin.showTablePage(tag, page);
    }
    else if (type == "servicebyid")
    {
        Admin.OpenByID("service", tag);
    }
    else if (type == "userbyserviceid")
    {
        
    }
    else if (type == "userbyid")
    {
        Admin.OpenByID("user", tag);
    }
    else if (type == "servicebycategory")
    {
        Admin.OpenServicesByCategory(tag, true);
    }
    else if (type == "commentsbyservice")
    {
        Admin.OpenCommentsByService(tag, true);
    }
    else if (type == "statistic")
    {
         if (tag == "category")
         {
            Statistic.ShowCategoryData();   
         }
    }
    else if (type == "report")
    {
        Report.OnClick(tag, label);
    }
    else if (type == "help")
    {
        if (tag == "tsv")
        {
            Help.TSV();
        }
    }
    else
    {
        Admin.ClearPage();
    }
}
