var Admin = {};
Admin.user = {id:-1, user:null};
Admin.clickPath = [];
Admin.lastPage = 1;


Admin.ClearClickPath = function()
{
    Admin.clickPath = [];   
}

Admin.AddClickPath = function(label, func, params)
{
    label = label + "";
    var parenteses = label.indexOf("(");
    if (parenteses > 0) label = label.substr(0, parenteses - 1);
    label = label.charAt(0).toUpperCase() + label.slice(1);
    
    // cleck last label
    if (Admin.clickPath.length > 0 && Admin.clickPath[Admin.clickPath.length - 1].label == label) return;
    Admin.clickPath.push({label:label, func:func, params:params});
}

Admin.SliceClickPath = function(name)
{
    var index = -1;
    
    if (Admin.clickPath.length > 0)
    {
        for (var i = Admin.clickPath.length - 1; i >= 0; i--)
        {
            if (Admin.clickPath[i].label == name)
            {
                index = i;
                break;
            }
        }
        
        if (index >= 0)
        {
            for (var i = Admin.clickPath.length - 1; i >= index; i--)
            {
                Admin.clickPath.splice(i, 1);
            }
        }
    }
    
    if (index >= 0) Admin.clickPath.slice(index);
}

Admin.GetClickPath = function()
{
    var str = "";
    for (var i = 0; i < Admin.clickPath.length; i++)
    {
        if (str != "") str += " > ";
        var params = "";
        for (var j = 0; j < 15; j++)
        {
            if (params != "") params += ", ";
            var v = Admin.clickPath[i].params[j];
            if (v == true || v == false || v == undefined) params += v;
            else if (isNaN(v) == false) params += v;
            else params += "'" + v + "'";
        }
        if (i == Admin.clickPath.length - 1) str += "<b><u>";
        str += "<a href=\"javascript:" + Admin.clickPath[i].func + "(" + params + ");\">" + Admin.clickPath[i].label + "</a>";
        if (i == Admin.clickPath.length - 1) str += "</u></b>";
    }
    return str;
}

Admin.ClearPage = function()
{
    var mainContent = document.getElementById("maincontent");
        mainContent.innerHTML = "";
}

Admin.ClickCancel = function()
{
    var r = confirm("Deseja sair sem salvar as alterações?");
    if (r == true) Admin.RefreshLastPage();   
}

Admin.RefreshLastPage = function()
{
    SideMenu.clickMenu(SideMenu.lastClick.label, SideMenu.lastClick.type, SideMenu.lastClick.tag, true, Admin.lastPage);
}

Admin.ApproveField = function(table, id)
{
    var command = "UPDATE " + table + " SET status=1 WHERE id=" + id;
    DataManager.run("php/runmysqlcommand.php", {sql:command}, function(data)
    {
        if (table == "comment")
        {
            Admin.unverifiedCommentCount--;
        }
        SideMenu.create(Admin.user);
        Admin.RefreshLastPage();        
    });
}

Admin.EditField = function(table, id, vars)
{
    var mainContent = document.getElementById("maincontent");
    mainContent.innerHTML = "";
    
    DataManager.editData(table, id, vars);
}


Admin.DeleteField = function(table, id)
{
    var r = confirm("Deseja realmente excluir esse item?");
    if (r == true) 
    {
        DataManager.run("php/deletefield.php", {table:table, id:id}, function()
        {
            Feedback.Message("ID " + id + " deletado da tabela " + table + " com sucesso!");
            Admin.RefreshLastPage(); 
        });
    }
}

Admin.OpenCommentsByService = function(serviceid, dontClearPath)
{
    Admin.showTablePage("comment", 0, null, "serviceid=" + serviceid);
}


Admin.OpenByID = function(table, id)
{
    Admin.showTablePage(table, 0, null, "id=" + id);
}

Admin.OpenServicesByUser = function(userid, dontClearPath)
{
    Admin.showTablePage("service", 0, null, "userid=" + userid);
}

Admin.OpenServicesByCategory = function(category, dontClearPath)
{
    Admin.showTablePage("service", 0, null, "(category1=" + category + " OR category2=" + category + " OR category3=" + category + ")");
}

Admin.OpenServicesBySubCategory = function(subcategory, dontClearPath)
{
    Admin.showTablePage("service", 0, null, "(subcategory1=" + subcategory + " OR subcategory2=" + subcategory + " OR subcategory3=" + subcategory + ")");
}

Admin.showTablePage = function(name, page, limit, where, label)
{
    Admin.ClearPage();
    
    if (limit == null) limit = 25;
    if (page == null || page <= 0) page = 1;
    
    Admin.lastPage = page;
    
    var canInclude = true;
    var needApprove = false;
    //var canEdit = (name == "category") ? false : true; 
    var canEdit = true;
    var vars = "*";
    if (where == null) where = "1=1";
    var customList = [];
    
    if (name == "unverifiedcomment")
    {
        needApprove = true;
        name = "comment";
        where = "status=0";
    }
    if (name == "politica")
    {
        canInclude = false;
        name = "appconfig";
        vars = "id, name"
        where = "id=1";
    }
    if (name == "email")
    {
        canInclude = false;
        name = "appconfig";
        vars = "id, name"
        where = "id=3 OR id=4 OR id=5 OR id=6 OR id=7";
    }
    if (name == "about")
    {
        canInclude = false;
        name = "appconfig";
        vars = "id, name"
        where = "id=2";
    }
    if (name == "category")
    {
        canInclude = false;
        customList = [{index:1, title:"services", label:"services", action:"Admin.click('@', 'servicebycategory', #, true);"}];
    }
    else if (name == "subcategory")
    {
        customList = [{index:2, title:"services", label:"services", action:"Admin.OpenServicesBySubCategory('@', #, true);"}];
    }
    else if (name == "service") 
    {
        canInclude = false;
        vars = "id, status, userid, name, datacadastro";
        customList = [];
        customList.push({index:2, title:"comments", label:"comments", action:"Admin.click('Comentarios em @', 'commentsbyservice', #, true);"});
        customList.push({index:2, title:"map", label:"view map", action:"Admin.OpenMap(#);"});
    }
    else if (name == "user") 
    {
        canInclude = false;
        vars = "id, status, mail, cpf, nascimento, datacadastro";
        customList = [{index:4, title:"services", label:"services", action:"Admin.OpenServicesByUser(#);"}];
    }
    else if (name == "comment") 
    {
       
    }
    else if (name == "appuser")
    {
        vars = "id, status, image, name, login, datacadastro, type";
        canInclude = false;   
    }
    
    
    DataManager.createTable(name, where, limit, page, vars, canEdit, canInclude, needApprove, customList, "100%");
}

Admin.IncludeRow = function(table)
{
    var mainContent = document.getElementById("maincontent");
    mainContent.innerHTML = "";
    
    DataManager.IncludeRow(table);
}

Admin.ClickImportTSV = function(encoding)
{
    DataManager.encoding = encoding;
    document.getElementById('importtsv').click();
}

Admin.AddTableTitle = function(table, canInclude)
{
    var str = "";
    str += "<div class='title'>";
    str += "<div style='text-align:center'>" + Admin.GetClickPath() + "<br>";
    if (canInclude == true)
    {
        str += "<a href=\"javascript:Admin.IncludeRow('" + table + "');\">Incluir Registro</a>";
        str += " - ";
    }
    str += "<a href=\"javascript:DataManager.DownloadTSV('" + table + "');\">Exportar TSV</a>";
    
    
    if (table == 'service' || table == 'teste')
    {
        str += " - ";
        str += "<a href=\"javascript:DataManager.DownloadBaseTSV('" + table + "');\">Base TSV</a>"
        str += " - ";
        str += "<a href=\"\" onclick=\"Admin.ClickImportTSV('UTF-8'); return false;\">Importar TSV</a>"
        str += " - ";
        str += "<a href=\"\" onclick=\"Admin.ClickImportTSV('ISO-8859-1'); return false;\">Importar TSV (ISO-8859-1)</a>"
        str += " - ";
        str += "<a href=\"javascript:SideMenu.clickMenu('Sobre Arquivos TSV', 'help', 'tsv')\">Como usar arquivos TSV</a>"
        str += "<input onchange=\"javascript:DataManager.OnTSVSelected('" + table + "');\" type=\"file\" id=\"importtsv\" name=\"upload\" style=\"visibility: hidden; width: 1px; height: 1px\" multiple />";
    }
    
    str += "</div></div><br>";
    
    document.getElementById("tableheader").innerHTML = str;
    
    return str;
}


Admin.OnGetCategoryData = function(data, type)
{
    Admin[type] = JSON.parse(data)["data"];
}

Admin.GetCategoryByID = function(id)
{
    if (id <= 0) return {id:0, name:"Página Inicial"};
    for (var i = 0; i < Admin.category.length; i++)
    {
        var obj = Admin.category[i];
        if (obj.id == id) return obj;
    }
    return null;
}


Admin.GetSubCategoryByID = function(id)
{
    for (var i = 0; i < Admin.subcategory.length; i++)
    {
        var obj = Admin.subcategory[i];
        if (obj.id == id) return obj;
    }
    return null;
}


Admin.GetOccupationByID = function(id)
{
    for (var i = 0; i < Admin.occupation.length; i++)
    {
        var obj = Admin.occupation[i];
        if (obj.id == id) return obj;
    }
    return null;
}

Admin.ToggleStatus = function(table, id, currentStatus)
{
    var action = (currentStatus <= 0 ? "ATIVAR" : "DESATIVAR");
    var r = confirm("Deseja realmente " + action + " esse registro?");
    if (r == true)
    {
        /*
        var nextStatus = (currentStatus == 0) ? 1 : 0;
        var command = "UPDATE " + table + " SET status=" + nextStatus + " WHERE id=" + id;
        DataManager.run("php/runmysqlcommand.php", {sql:command}, function(data)
        {
            if (table == "comment")
            {
                Admin.unverifiedCommentCount--;
            }
            SideMenu.create(Admin.user);
            Admin.RefreshLastPage();        
        });
        */
        
        var nextStatus = (currentStatus == 0) ? 1 : 0;
        DataManager.run("php/togglestatus.php", {table:table, status:nextStatus, id:id}, function(data)
        {
            if (table == "comment")
            {
                Admin.unverifiedCommentCount--;
            }
            SideMenu.create(Admin.user);
            Admin.RefreshLastPage();        
        });
    }
}

Admin.GetStatusToggle = function(table, id, status)
{
    var image = 'toggle_' + (status <= 0 ? 'off' : 'on');
    var str = "<a href=\"javascript:Admin.ToggleStatus('" + table + "', " + id + ", " + status + ");\"><img height='16px' src='images/" + image + ".png'></a>";
    return str;
}

Admin.GetCategorySelectBox = function(id, divName, forBanners)
{
    var index = "";
    for (var i = 0; i < divName.length; i++)
    {
        var c = divName.charAt(i);
        if (isNaN(c) == false) index += c;
    }
    //if (index == "") index = 0;
    
    var html = "";
    html += "<select style=\"width:400px;padding:5px\" onchange=\"Admin.GetSubCategorySelectBox(null, null, 'subcategory" + index +"');\" id=\"select" + divName + "\" name=\"" + divName + "\">";
    
    html += "<option value=\"0\">- Nenhum -</option>";
    
    if (forBanners == true)
    {
        var obj = {id:0, name:"Página Principal"};
        var selected = obj.id == id ? "selected=\"selected\"" : "";
        html += "<option value=\"" + obj.id + "\" " + selected + ">" + obj.name + "</option>";
    }
    
    for (var i = 0; i < Admin.category.length; i++)
    {
        var obj = Admin.category[i];
        var selected = obj.id == id ? "selected=\"selected\"" : "";
        html += "<option value=\"" + obj.id + "\" " + selected + ">" + obj.name + "</option>";
    }        
    html += "</select>";
    return html;
}

Admin.GetSubCategorySelectBox = function(id, cat, divName)
{
    var index = "";
    for (var i = 0; i < divName.length; i++)
    {
        var c = divName.charAt(i);
        if (isNaN(c) == false) index += c;
    }
    //if (index == "") index = 0;
    
    index = index.trim();
    
    var div = null;
    if (divName != null) div = document.getElementById(divName);
    if (cat == null || cat == "") 
    {
        var s = document.getElementById("selectcategory" + index);
        if (s != null) 
        {
            cat = s.value;
        }
        else cat = 0;
    }
    
    var html = "";
    html += "<select style=\"width:400px;padding:5px\" onchange=\"Admin.GetOccupationSelectBox(null, null, 'occupation" + index +"');\" id=\"select" + divName + "\" name=\"" + divName + "\">";
    
   html += "<option value=\"0\">- Nenhum -</option>";
    
    
    if (cat > 0)
    {
        for (var i = 0; i < Admin.subcategory.length; i++)
        {
            var obj = Admin.subcategory[i];
            if (obj.category == cat)
            {
                var selected = obj.id == id ? "selected=\"selected\"" : "";
                html += "<option value=\"" + obj.id + "\" " + selected + ">" + obj.name + "</option>";
            }
        } 
    }
    html += "</select>";
    if (div != null) div.innerHTML = html;
    
    Admin.GetOccupationSelectBox(null, null, "occupation" + index);
    
    return html;
}

Admin.GetOccupationSelectBox = function(id, subcat, divName)
{
    var index = "";
    for (var i = 0; i < divName.length; i++)
    {
        var c = divName.charAt(i);
        if (isNaN(c) == false) index += c;
    }
    //if (index == "") index = 0;
    
    var div = null;
    if (divName != null) div = document.getElementById(divName);
    
    if (subcat == null) 
    {
        var s = document.getElementById("selectsubcategory" + index);
        if (s != null) subcat = s.value;
        else subcat = 0;
    }
    
    var html = "";
    html += "<select style=\"width:400px;padding:5px\" id=\"select" + divName + "\" name=\"" + divName + "\">";
    
    html += "<option value=\"0\">- Nenhum -</option>";
    
    if (subcat > 0)
    {
        for (var i = 0; i < Admin.occupation.length; i++)
        {
            var obj = Admin.occupation[i];
            if (obj.subcategory == subcat)
            {
                var selected = obj.id == id ? "selected=\"selected\"" : "";
                html += "<option value=\"" + obj.id + "\" " + selected + ">" + obj.name + "</option>";
            }
        }  
    }

    html += "</select>";
    if (div != null) div.innerHTML = html;
    return html;
}



Admin.OnInfoGetted = function(callback)
{
    Admin.startInfoCount++;
    
    if (Admin.startInfoCount >= Admin.startInfoTotal)
    {
        if (callback != null) callback();
    }
}

Admin.OnGetTableCount = function(table, count)
{
    
}

Admin.GetStartInfo = function(callback)
{
    var tableCount = ["service", "user", "category", "subcategory", "occupation", "appuser"];
    Admin.startInfoTotal = tableCount.length + 4;
    Admin.startInfoCount = 0;
    
    DataManager.run("php/getmysqldata.php", {sql:"SELECT * FROM category WHERE 1=1", type:"json"}, function(data)
    {
        Admin.OnGetCategoryData(data, "category");
        Admin.OnInfoGetted(callback);
    });
    
    DataManager.run("php/getmysqldata.php", {sql:"SELECT * FROM subcategory WHERE 1=1", type:"json"}, function(data)
    {
        Admin.OnGetCategoryData(data, "subcategory");
        Admin.OnInfoGetted(callback);
    });
    
    DataManager.run("php/getmysqldata.php", {sql:"SELECT * FROM occupation WHERE 1=1", type:"json"}, function(data)
    {
        Admin.OnGetCategoryData(data, "occupation");
        Admin.OnInfoGetted(callback);
    });
    
    for (var i = 0; i < tableCount.length; i++)
    {
        var table =  tableCount[i];
        DataManager.run("php/getcount.php", {sql:"SELECT id FROM " + table + " WHERE 1=1", prefix:table + ";"}, function(data)
        {
            var parts = data.trim().split(";");
            var name = parts[0] + "Count";
            Admin[name] = parts[1];
            Admin.OnInfoGetted(callback);
        });
    }
    
    DataManager.run("php/getcount.php", {sql:"SELECT id FROM comment WHERE status=0", prefix:"unverifiedComment;"}, function(data)
    {
        var parts = data.trim().split(";");
        var name = parts[0] + "Count";
        Admin[name] = parts[1];
        Admin.OnInfoGetted(callback);
    });
}


Admin.OpenMap = function(serviceid)
{
    DataManager.run("php/getmysqldata.php", {sql:"SELECT latitude, longitude FROM service WHERE id=" + serviceid, type:"json"}, function(data)
    {
        data = JSON.parse(data).data[0];
        var pos = data.latitude + "," + data.longitude;
        var url = "https://www.google.com/maps/place/"+ pos + "/@" + pos + ",15z";
        window.open(url, '_blank');
    });
}

Admin.click = function(label, type, tag, dontClearPath)
{
    SideMenu.clickMenu(label, type, tag, dontClearPath);
}

