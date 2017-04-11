var DataManager = {};

DataManager.loadedData = [];
DataManager.loadCount = 0;

DataManager.loadDataIndex = 0;

DataManager.showImage = function(src,target) {
  var fr=new FileReader();
  fr.onload = function(e) { target.src = this.result; }
  src.addEventListener("change",function() {  
    fr.readAsDataURL(src.files[0]);
  });
}

DataManager.IncludeRow = function(table)
{
    DataManager.run("php/getmysqldata.php", { sql:"DESCRIBE " + table, type:"json" }, 
    function(data) 
    {
        var json = JSON.parse(data);
        
        var _d = "";
        for (var i = 0; i < json.data.length; i++)
        {
            if (_d != "") _d += ", ";
            _d += "\"" + json.data[i].Field + "\":\"\"";   
        }
        var d = "{\"data\":[{" + _d + "}]}";
        
        DataManager._editData(table, null, "*", d, true);
        
    });
}


DataManager.parseString = function(s)
{
    if (s.indexOf("de amigo")) s = "Indicação de amigo";
    return s;
}

DataManager.editData = function(table, id, vars)
{
    if (vars == null) vars = "*";
    
    DataManager.run("php/getmysqldata.php", { sql:"SELECT " + vars + " FROM " + table + " WHERE id=" + id, type:"json" }, 
    function(data) 
    {
        DataManager._editData(table, id, vars, data, false);
    });
}

DataManager._editData = function(table, id, vars, data, insert)
{
    var div = document.createElement("div");
    var html = "<b>Editando Tabela [ " + table + " ]</b><br><br>";
    data = data.trim().replaceAll('\r', '').replaceAll('\n', "<br>").replaceAll("\t", "    "); 
    
    var data = JSON.parse(data);

    var categoryList = [1, 1, 1];
    var subcategoryList = [1, 1, 1];
    var occupationList = [0, 0, 0];
    var categoryCount = 0;
    var subcategoryCount = 0;
    var occupationCount = 0;
    
    
    var customLinks = 
    [
        {table:""}
    ];


    if (data != null && data.data != null && data.data.length > 0)
    {
        data = data.data[0];
        html += "<form id='editform'><table>\n";
        
        var nameValue = "";
        
        for(var k in data) 
        {
            if (k == "name")
            {
                nameValue = data[k];
            }
            
            
            if (k == "datacadastro" || k == "nascimento")
            {
                data[k] = data[k].substr(8, 2) + "/" + data[k].substr(5, 2) + "/" + data[k].substr(0, 4);
            }

            if (k == "id")
            {

            }
            else if (k == "type" || k == "temppassword" || k == "ipcadastro" || (insert == true && k == "datacadastro"))
            {

            }
            else if (k == "status")
            {
                html += "<tr>";
                html += "<td><div style='text-align:right'>" + TableDic.GetHeader(k) + ":</div></td>";
                html += "<td>";
                html += Admin.GetStatusToggle(table, id, data[k]);
                html += "</td>";
                html += "</tr>";
            }
            else if (k == "image")
            {
                if (table != "appuser")
                {
                    if (data[k].trim() == "")
                    {
                        data[k] = "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAMAAAAoLQ9TAAADAFBMVEX///8ACGtrnMalzt5Ke6UxY4TG3u+MvdY5a5SEtc6lxt5rpcZzrc6cxt6lxtaUxt611ueErcaUvc4AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAEsTfUAAAAAXRSTlMAQObYZgAAAElJREFUKM9jYKAOYGTCFOFjZWFGEmBjZGIT4mBHCLDwMTIJCLIgBFi52RmZ+FmRVHDz8ALNQQiwc3Cyc6HYxczCysKGzXby/AEAns0BOl4Iuf0AAAAASUVORK5CYII=";
                    }
                    html += "<tr>";
                    html += "<td><div style='text-align:right'>" + TableDic.GetHeader(k) + ":</div></td>";
                    html += "<td>";
                    html += "<input id=\"imagesrc\" type=\"file\"/><br>";
                    html += DataManager.parseImage(data[k], 400, null, "imgtarget");
                    html += "</td>";
                    html += "</tr>";
                }
            } 
            else if (k == "description" || 
                     (nameValue == "politica" && k == "value") ||
                     (nameValue.indexOf("mail_") === 0 && k == "value") ||
                     (nameValue == "about" && k == "value"))
            {
                var _data = data[k].replaceAll("<br>", "\n");
                html += "<tr>";
                html += "<td><div style='text-align:right'>" + TableDic.GetHeader(k) + ":</div></td>";
                html += "<td><textarea id='theuniquetextarea' name=\"" + k + "\" style='padding:5px;resize:none;width:400px;height:400px' form='editform'>" + _data + "</textarea></td>"; 
                html += "</tr>";
            }
            else if (k.indexOf("category") == 0 || k.indexOf("subcategory") == 0 || k.indexOf("occupation") == 0)
            {
                html += "<tr>";
                html += "<td><div style='text-align:right'>" + TableDic.GetHeader(k) + ":</div></td>";
                html += "<td>";
                html += "<div id='" + k + "'>";

                if (k.indexOf("category") == 0)
                {
                    if (table == "occupation") k = "category";
                    html += Admin.GetCategorySelectBox(data[k], k, (table == "banner"));
                    categoryList[categoryCount] = data[k];
                    categoryCount++;
                }
                else if (k.indexOf("subcategory") == 0)
                {
                    if (table == "occupation") k = "subcategory";
                    html += Admin.GetSubCategorySelectBox(data[k], categoryList[categoryCount - 1], k);
                    subcategoryList[subcategoryCount] = data[k];
                    subcategoryCount++;
                }
                else
                {
                    if (table == "occupation") k = "occupation";
                    html += Admin.GetOccupationSelectBox(data[k], subcategoryList[subcategoryCount - 1], k);
                    occupationList[subcategoryCount] = data[k];
                    occupationCount++;
                }

                html += "</div>";
                html += "</td>";
                html += "</tr>";
            }
            else
            {
                var inputType = (k == "password") ? "password" : "text";
                //var _disabled = (k == "login" || k == "userid") ? "disabled" : "";
                var _disabled = (k == "login") ? "disabled" : "";
                
                if (table == "admin")
                {
                    _disable = "";
                }
                
                if (table == "appconfig" && k == "name")
                {
                    _disabled = "disabled";
                }

                if (k == "how")
                {
                    _label = "Como conheceu";
                    data[k] = DataManager.parseString(data[k]);
                }
                
                html += "<tr>";
                html += "<td><div style='text-align:right'>" + TableDic.GetHeader(k) + ":</div></td>";
                html += "<td><input style='width:400px' type=\"" + inputType + "\" name=\"" + k + "\" " + _disabled + "  ";
                
                if (k == "cpf")
                {
                    html += " onkeydown=\"mascara(this,Mask_cpf)\"";
                }
                else if (k == "nascimento" || k == "datacadastro")
                {
                    html += " onkeydown=\"mascara(this,Mask_data)\"";
                }
                else if (k == "end_cep")
                {
                    html += " onkeydown=\"mascara(this,Mask_cep)\"";
                }
                else if (k == "telefone" || k == "celular")
                {
                    html += " onkeydown=\"mascara(this,Mask_telefone)\"";
                }
                
                html += " value=\"" + data[k] + "\">";
                if (k == "userid")
                {
                    html += " <a href='javascript:Admin.click(\"Fornecedor " + data[k] + "\", \"userbyid\", " + data[k] + ", true);'>Fornecedor</a>";
                }
                
                if (k == "latitude")
                {
                   html += " <a href='javascript:DataManager.ShowMap();'>Abrir Mapa</a>";
                }
                
                html += "</td>";
                html += "</tr>";
            }
        }

        html += "</table></form>\n"
    }

    html += "<table><tr><td>";
    html += "<button onclick=\"Admin.ClickCancel();\">Cancelar</button>";
    html += "</td><td>";
    var _method = (insert == true) ? "insert" : "update"; 
    html += "<button onclick=\"DataManager.SubmitForm('" + table + "', " + id + ", '" + _method + "');\">Salvar</button>";
    html += "</td></tr></table>";

    div.innerHTML = html;
    document.getElementById("maincontent").appendChild(div);

    var src = document.getElementById("imagesrc");
    var target = document.getElementById("imgtarget");
    if (src && target)
    {
        DataManager.showImage(src,target);
    }
}

DataManager.ShowMap = function()
{
    var all = $("#editform").find(":input");
    
    var latitude = "";
    var longitude = "";
    
    for (var i = 0; i < all.length; i++)
    {
        if (all[i].name == "latitude") latitude = all[i].value.trim();
        if (all[i].name == "longitude") longitude = all[i].value.trim();
    }
    
    var url = "http://maps.google.com/maps?q=loc:" + latitude + "," + longitude;
    //var url = "https://www.google.com.br/maps/@" + latitude + "," + longitude + ",15z";
    
    var win = window.open(url, '_blank');
    win.focus();
    //
}

DataManager.DownloadTSV = function(table)
{
    var link = document.createElement("a");
    link.download = "aaa";
    link.href = "php/downloadtsv.php?table=" + table;
    link.click();
}


DataManager.DownloadBaseTSV = function(table)
{
    var link = document.createElement("a");
    link.download = "aaa";
    link.href = "php/downloadtsv.php?table=" + table + "&emptytable=1";
    link.click();
}


DataManager.createTable = function(table, where, count, page, vars, canEdit, canInclude, customList, width)
{
    if (count == null) count = 100000;
    if (page == null || page < 1) page = 1;
    if (canEdit != true) canEdit = false;
    if (vars == null) vars = "*";
    if (width == null) width = "100%";
    
    var divID = table + "Div";
    
    var sqlTableCount = "SELECT id FROM " + table + " WHERE 1=1";
    var sqlCommand = "SELECT " + vars + " FROM " + table + " WHERE " + where + " LIMIT " + ((page-1) * count) + ", " + count;
    
    var div = document.createElement("div");
    div.setAttribute("id", divID);
    div.style.width = width;
    document.getElementById("maincontent").appendChild(div);
    
    div.innerHTML = "<div id='tableheader'></div><div id='tableerror'></div><div id='tablecontent'></div>"
    
    DataManager.run("php/getcount.php", { sql:sqlTableCount }, function(total)
    {
        var total = parseInt(total.trim());
        
        DataManager.run("php/getmysqldata.php", { sql:sqlCommand, type:"tsv" }, 
        function(data) 
        {
            var str = "";
            var strPages = "";
            var numPages = Math.ceil( total / count );
            if (numPages > 1)
            {
                strPages += "<a href=\"javascript:Admin.showTablePage('" + table + "', 0, 9999999999);\">Mostrar Todos</a> ";
                for (var i = 0; i < numPages; i++)
                {
                    strPages += " - <a href=\"javascript:Admin.showTablePage('" + table + "', " + (i + 1) + ");\">" + (i + 1) + "</a>";   
                }
            }
            
            Admin.AddTableTitle(table, canInclude);
            
            str = DataManager._createTable(table, where, vars, divID, count, page, canEdit, canInclude, customList, width, data);

            if (numPages > 1) str = strPages + "<br><br>" + str + "<br><br>" + strPages;
            
            document.getElementById("tablecontent").innerHTML = str;
            
            var tableID = "_" + divID + "Table";
            $("#" + tableID).tablesorter(); 
        });
    });
}


DataManager._createTable = function(tableName, where, vars, count, page, divID, canEdit, canInclude, customList, width, tsvContent)
{
    if (customList == null) customList = [];
    
    var tableID = "_" + divID + "Table";
    
    var data = tsvContent.replaceAll("<BREAKLINE>", "\n");
    data = data.replaceAll("<TAB>", "\t");
    
    var lines = data.split("\n");
    
    if (lines.length > 1)
    {
        var header = lines[0].split("\t");
        var table = "<table id=\"" + tableID + "\" class=\"tablesorter\">\n<thead>\n<tr>";
        var _count = 0;
        for (var i = 0; i < header.length; i++)
        {        
            if (header[i] == "temppassword") continue;
            if (header[i] == "password") continue;
            table += "<th>" + TableDic.GetHeader(header[i]) + "</th>\n";   

            for (var k = 0; k < customList.length; k++)
            {
                if (customList[k].index == _count)
                {
                    table += "<th>" + customList[k].title + "</th>\n";    
                }
            }
            _count++;
        }

        if (canEdit)  table += "<th>" + TableDic.GetHeader("actions") + "</th>\n";   

        table += "</tr>\n</thead>";


        table += "<tbody>\n";

        for (var i = 2; i < lines.length; i++)
        {
            var line = lines[i].split("\t");
            table += "<tr>\n";

            var id = -1;
            var name = "";
            var _count = 0;

            var _canEdit = true;
            
            for (var j = 0; j < line.length; j++)
            {
                if (header[j] == "id") id = line[j];
                if (header[j] == "name") name = line[j];

                if (header[j] == "temppassword") continue;
                if (header[j] == "password") continue;

                var d = line[j];
                if (header[j] == "password") d = "*****";
                if (header[j] == "image") d = DataManager.parseImage(d, 16);
                
                if (header[j] == "status") d = Admin.GetStatusToggle(tableName, id, d); 
                
                if (header[j] == "serviceid") 
                {
                    d = "<a href='javascript:Admin.click(\"Serviço " + d + "\", \"servicebyid\", " + d + ", true);'>" + d + "</a>";
                }
                
                if (header[j] == "userid") 
                {
                    d = "<a href='javascript:Admin.click(\"Fornecedor " + d + "\", \"userbyid\", " + d + ", true);'>" + d + "</a>";
                }
                
                if (header[j] == "type")
                {
                    if (d != 0) _canEdit = false;
                    var typeImages = ["mail.png", "facebook.png", "google.png"];
                    d = "<img src='images/" + typeImages[d] + "'>";
                }
                
                try
                {
                    
                    if (header[j] == "category")    
                    {
                        d = Admin.GetCategoryByID(d).name;
                        
                    }

                    if (header[j] == "subcategory") 
                    {
                        var _subCategory = Admin.GetSubCategoryByID(d);
                        if (_subCategory != null)
                            d = _subCategory.name;
                    }

                    table += "<td>" + d + "</td>\n";

                    for (var k = 0; k < customList.length; k++)
                    {
                        if (customList[k].index == _count)
                        {
                            var action = customList[k].action.replaceAll("#", id).replaceAll("@", name);
                            table += "<td><a href=\"javascript:" + action + "\">" + customList[k].label + "</a></td>\n";    
                        }
                    }

                    _count++;
                }
                catch (err)
                {
                }
            }

            if (canEdit) 
            {
                table += "<td width='43px'>";
                
                var _editStyle = _canEdit ? "" : "style='opacity:0.35; filter:alpha(opacity=35);'";
                table += _canEdit ? "<a href=\"javascript:Admin.EditField('" + tableName + "', " + id + ", '" + "*" + "');\">" : "";
                table += "<img src='images/edit.gif' " + _editStyle + " >";
                table += _canEdit ? "</a> " : " ";   
                
                table += "<a href=\"javascript:Admin.DeleteField('" + tableName + "', " + id + ", '" + "*" + "');\">";
                table += "<img src='images/delete.gif'>";
                table += "</a>\n";   
            }

            table += "</tr>\n";
        }

        table += "</tbody>\n</table>";        
        return table;
    }
    else
    {
        var str = "<div style='text-align:center'>Nenhuma informação cadastrada</div>";
        return str;
    }
}


DataManager.CheckDataBeforeSubmitForm = function(table, all, allSelect)
{
    if (table == "service")
    {
        var cat1 = 0;
        var cat2 = 0;
        var cat3 = 0;
        var sub1 = 0;
        var sub2 = 0;
        var sub3 = 0;

        for (var i = 0; i < allSelect.length; i++)
        {
            if (allSelect[i].name == "category1") cat1 = allSelect[i].value;
            if (allSelect[i].name == "category2") cat2 = allSelect[i].value;
            if (allSelect[i].name == "category3") cat3 = allSelect[i].value;
            if (allSelect[i].name == "subcategory1") sub1 = allSelect[i].value;
            if (allSelect[i].name == "subcategory2") sub2 = allSelect[i].value;
            if (allSelect[i].name == "subcategory3") sub3 = allSelect[i].value;
        }

        if ((cat1 > 0 && sub1 < 1) || (cat2 > 0 && sub2 < 1) || (cat3 > 0 && sub3 < 1))
        {
            alert("Não é possivel cadastrar uma categoria sem uma sub-categoria!");
            return false;
        }
    }
    else if (table == "banner")
    {
        var image = false;
        var action = "";
        var cat = 0;
        
        
        var photo = document.getElementById("imgtarget");
        if (photo != null)
        {
            var src = document.getElementById("imagesrc");
            if (src.files && src.files[0] != null) image = true;
        }
        
        for (var i = 0; i < all.length; i++)
        {
            if (all[i].name == "action") action = (all[i].value + "").trim();
        }
        
        for (var i = 0; i < allSelect.length; i++)
        {
            if (allSelect[i].name == "category") cat = allSelect[i].value;
        }
        
        if (cat == 0 || action == "" || image == false)
        {
            alert("Preencha todos os campos.");
            return false;
        }
    }
    else if (table == "subcategory")
    {
        var name = "";
        var cat = 0;
        
        for (var i = 0; i < all.length; i++)
        {
            if (all[i].name == "name") name = (all[i].value + "").trim();
        }
        
        for (var i = 0; i < allSelect.length; i++)
        {
            if (allSelect[i].name == "category") cat = allSelect[i].value;
        }
        
        if (cat == 0 || name == "")
        {
            alert("Preencha todos os campos.");
            return false;
        }
    }
    else if (table == "occupation")
    {
        var name = "";
        var cat = 0;
        var sub = 0;
        
        for (var i = 0; i < all.length; i++)
        {
            if (all[i].name == "name") name = (all[i].value + "").trim();
        }
        
        for (var i = 0; i < allSelect.length; i++)
        {
            if (allSelect[i].name == "category") cat = allSelect[i].value;
            if (allSelect[i].name == "subcategory") sub = allSelect[i].value;
        }
        
        if (cat == 0 || sub == 0 || name == "")
        {
            alert("Preencha todos os campos.");
            return false;
        }
    }
    
    return true;
}

DataManager.SubmitForm = function(table, id, type)
{
    if (type == null) return;
    
    var all = $("#editform").find(":input");
    var allSelect = $("#editform").find("select");
    var str = "";
    
    // CHECA SE TEM ALGUMA CATEGORIA SEM SUBCATEGORIA =======
    
    if (DataManager.CheckDataBeforeSubmitForm(table, all, allSelect) == false) return;
    
    // ======================================================
    
    
    
    var data = new FormData();
    
    if (id != null) data.append("id", id);
    data.append("table", table);
    data.append("method", type);
    
    

    for (var i = 0; i < all.length; i++)
    {
        if (str != "") str += ", ";
        if (all[i].name != "")
        {
            var _value = (all[i].value + "").trim();
            str += all[i].name + '="' + _value + '"';  
            data.append(all[i].name, _value);
        }
    }
    
    for (var i = 0; i < allSelect.length; i++)
    {
        if (str != "") str += ", ";
        if (allSelect[i].name != "")
        {
            var _value = (allSelect[i].value + "").trim();
            str += allSelect[i].name + '="' + allSelect[i].value + '"';  
            data.append(allSelect[i].name, allSelect[i].value);
        }
    }
    
    var select =  $("#editform").find("select");
    var all = $("#editform").find("option");

    for (var i = 0; i < select.length; i++)
    {
        if (str != "") str += ", ";
        str += select[i].name + '="' + select[i].value + '"';  
        data.append(select[i].name, select[i].value);
    }

    type = type.toLowerCase();
    data.append("method", type);    

    var photo = document.getElementById("imgtarget");
    if (photo != null)
    {
        var src = document.getElementById("imagesrc");
        if (src.files && src.files[0] != null) data.append("image", src.files[0]);
    }

    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (xhttp.readyState == 4 && xhttp.status == 200)
        {
            var msg = xhttp.responseText.trim();
            if (msg != "1")
            {
                Feedback.Message(msg, false);
            }
            else
            {
                Feedback.Message("Item salvo com sucesso!");
            }
            Admin.RefreshLastPage();
        }
    };
    xhttp.open("POST", "php/insertintable.php", true);
    xhttp.send(data);
}


DataManager.parseImage = function(data, width, height, id)
{
    if (data == null || data.trim() == "") return "<img src='images/null.png'>";
    data = data.trim();
    
    if (id != null) id = "id=\"" + id + "\"";
    
    if (height != null) height = "max-height:"  + height + ""; else height = ""; 
    if (width != null) width = "max-width:"  + width + ""; else width = ""; 
    
    if (data.indexOf("http") >= 0) return "<img style=\"" + height + ";" + width + "\" alt=\"Embedded Image\" src=\"" + data + "\" />";;
    return "<img " + id + " " + height + " alt=\"Embedded Image\" style=\"" + height + ";" + width + "\" src=\"data:image/jpeg;base64," + data + "\" />";
}


DataManager.getValuesFromForm = function(formName) 
{
    var obj = {};
    var all = $("#" + formName).find(":input");
    for (var i = 0; i < all.length; i++)
    {
        if (all[i].name.indexOf("js_") != 0)
        {
            var val = all[i].value;
            if (all[i].name == "mail") val = val.toLowerCase();
            //if (encode == true) val = SPY.Encode(val);
            obj[all[i].name] = val; 
        }  
    }
    return obj;
}

DataManager.fillForm = function(formName, jsonData) 
{
    var all = $("#" + formName).find(":input");
    
    if (jsonData == null) jsonData = {data:[]};
    var json = jsonData.data[0];
    
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
                    
                    
                    Toggle.value("cadastrocheckbox", true);
                    
                    all[i].disabled = achou;
                }
            }
        }
    }
}


DataManager.onCompleteLoadData = function(data, divName)
{
    var el = document.getElementById(divName);
    if (el == null)
    {
        DataManager.loadedData[divName ] = data;
    }
    else
    {
        el.innerHTML = data; 
    }
    
    DataManager.loadCount--;
    
    if (DataManager.loadCount == 0)
    {
        DataManager.loadDataIndex++;
        if (window['onDataLoaded'] != null) window['onDataLoaded'](DataManager.loadDataIndex);   
    }
}



DataManager.run = function(url, params, callback)
{
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            if (callback != null)
            {
                var data = xmlhttp.responseText;
                var realData = data.replace(/<trace>.*<\/trace>/, '');
                realData = realData.trim();
                
                var traces = [];
                data.replace(/<trace>(.*?)<\/trace>/g, function () {
                    //arguments[0] is the entire match
                    traces.push(arguments[1]);
                });
                
                callback(realData, params);   
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
    
    xmlhttp.open("POST", urlToCall, true);
    
    //Send the proper header information along with the request
    xmlhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

    xmlhttp.send(strParams);
}


DataManager.loadData = function(url, divName, params)
{
    DataManager.loadCount++;
    
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == 4 && xmlhttp.status == 200) {
            DataManager.onCompleteLoadData(xmlhttp.responseText, divName);
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


DataManager.OnTSVSelected = function(table)
{
    ///*
    var file = document.getElementById("importtsv");
    if (file != null && file.files != null && file.files.length > 0)
    {
        var output = "";
        var file = file.files[0];
        if (file) {
            var reader = new FileReader();
            
            reader.onload = function (evt) {
                DataManager.ImportTSV(table, evt.target.result);
            }
            reader.onerror = function (evt) {
                alert("error reading file");
            }
            
            console.log(DataManager.encoding);
            
            reader.readAsText(file, DataManager.encoding);
        }
    }
    //*/
    /*
    var file = document.getElementById("importtsv");
    if (file != null && file.files != null && file.files.length > 0)
    {
        var output = "";
        var file = file.files[0];
        if (file) {
            var reader = new FileReader();
            
            reader.onload = function (evt) {
                DataManager.ImportTSV2(table, evt.target.result);
            }
            reader.onerror = function (evt) {
                alert("error reading file");
            }
            
            reader.readAsArrayBuffer(file, "UTF-8");
        }
    }
    */
}

DataManager.utf8Encode = function(unicodeString) {
    if (typeof unicodeString != 'string') throw new TypeError('parameter ‘unicodeString’ is not a string');
    const utf8String = unicodeString.replace(
        /[\u0080-\u07ff]/g,  // U+0080 - U+07FF => 2 bytes 110yyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xc0 | cc>>6, 0x80 | cc&0x3f); }
    ).replace(
        /[\u0800-\uffff]/g,  // U+0800 - U+FFFF => 3 bytes 1110xxxx, 10yyyyyy, 10zzzzzz
        function(c) {
            var cc = c.charCodeAt(0);
            return String.fromCharCode(0xe0 | cc>>12, 0x80 | cc>>6&0x3F, 0x80 | cc&0x3f); }
    );
    return utf8String;
}

var Base64={_keyStr:"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=",encode:function(e){var t="";var n,r,i,s,o,u,a;var f=0;e=Base64._utf8_encode(e);while(f<e.length){n=e.charCodeAt(f++);r=e.charCodeAt(f++);i=e.charCodeAt(f++);s=n>>2;o=(n&3)<<4|r>>4;u=(r&15)<<2|i>>6;a=i&63;if(isNaN(r)){u=a=64}else if(isNaN(i)){a=64}t=t+this._keyStr.charAt(s)+this._keyStr.charAt(o)+this._keyStr.charAt(u)+this._keyStr.charAt(a)}return t},decode:function(e){var t="";var n,r,i;var s,o,u,a;var f=0;e=e.replace(/[^A-Za-z0-9+/=]/g,"");while(f<e.length){s=this._keyStr.indexOf(e.charAt(f++));o=this._keyStr.indexOf(e.charAt(f++));u=this._keyStr.indexOf(e.charAt(f++));a=this._keyStr.indexOf(e.charAt(f++));n=s<<2|o>>4;r=(o&15)<<4|u>>2;i=(u&3)<<6|a;t=t+String.fromCharCode(n);if(u!=64){t=t+String.fromCharCode(r)}if(a!=64){t=t+String.fromCharCode(i)}}t=Base64._utf8_decode(t);return t},_utf8_encode:function(e){e=e.replace(/rn/g,"n");var t="";for(var n=0;n<e.length;n++){var r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r)}else if(r>127&&r<2048){t+=String.fromCharCode(r>>6|192);t+=String.fromCharCode(r&63|128)}else{t+=String.fromCharCode(r>>12|224);t+=String.fromCharCode(r>>6&63|128);t+=String.fromCharCode(r&63|128)}}return t},_utf8_decode:function(e){var t="";var n=0;var r=c1=c2=0;while(n<e.length){r=e.charCodeAt(n);if(r<128){t+=String.fromCharCode(r);n++}else if(r>191&&r<224){c2=e.charCodeAt(n+1);t+=String.fromCharCode((r&31)<<6|c2&63);n+=2}else{c2=e.charCodeAt(n+1);c3=e.charCodeAt(n+2);t+=String.fromCharCode((r&15)<<12|(c2&63)<<6|c3&63);n+=3}}return t}}


DataManager.ImportTSV = function(table, tsv)
{
    var lines = tsv.split("\n");
    if (lines.length >= 3)
    {
        var div = document.getElementById("tableerror");
        if (div != null)
        {
            div.innerHTML = "";
        }
        
        var header = lines[0] + "\n" + lines[1];
        var included = 0;
        var erros = 0;
        var lineCount = 0;
        
        for (var i = 2; i < lines.length; i++)
        {
            var strLine = lines[i].trim();
            if (strLine == "") continue;
            
            strLine = strLine;
            
            lineCount++;
            var _tsv = header + "\n" + strLine;
            
            //_tsv = Base64.encode(_tsv);
            
            DataManager.run("php/importtsv.php", {table:table, tsv:_tsv}, function(data)
            {
                data = data.trim();
                if (data == "0")
                {
                    included++;
                }
                else
                {
                    erros++;
                }
                
                if (included + erros == lineCount)
                {
                    alert(included + " de " + lineCount + " incluidos com sucesso");
                    Admin.RefreshLastPage();
                    var div = document.getElementById("tableerror");
                    if (data != "0" && div != null)
                    {
                        div.innerHTML += data + "<br><br>";
                    }
                }               
            });
        }
    }
    else
    {
        Admin.RefreshLastPage();
    }
}



