function none() {}


var Report = {};

Report.data = "{}";
Report.ano = 2016;
Report.mes = 1;

Report.OnClick = function(tag, label)
{
    Report.AddTableTitle(label);
    var mainDiv = document.getElementById("tablecontent");
    
    var currentTime = new Date()
    var month = currentTime.getMonth() + 1
    var day = currentTime.getDate();
    var year = currentTime.getFullYear();
    
    
    
    
    //if (tag == "service" || tag == "category" || tag == "subcategory")
    {
        var path = "php/report/click.php";
        DataManager.run(path, { type:tag }, 
        function(data) 
        {
            Report.ShowClickByDate(data, year, month);
        });
    }
    /*
    else
    {
        var path = "php/report/" + tag + ".php";
        DataManager.run(path, { }, 
        function(data) 
        {
            Report.ShowTableByDate(data, year, month);
        });
    }
    */
}

Report.GetMonth = function(mes)
{
    var meses = ["", "JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
    
    return meses[mes];
}

Report.GetDaysInMonth = function(ano, mes)
{
    var meses = [0, 31, (ano % 4 == 0) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    
    return meses[mes];
}

Report.ShowClickByDate = function(data, ano, mes)
{
    Report.data = data;
    Report.mes = mes;
    Report.ano = ano;
    
    var json = JSON.parse(data)["data"];
    var list = [];
    var totalCadastros = 0;
    
    for (var i = 0; i < json.length; i++)
    {
        var obj = json[i];
        if (obj.ano == ano && (mes == null || obj.mes == mes))
        {
            list.push(obj);
            totalCadastros++;
        }
    }
    
    var jsonStr = "";
    

    {
        var jsonList = [];
        var meses = [];
        for (var i = 1; i <= 12; i++) meses.push(0);
        
        for (var i = 0; i < list.length; i++)
        {
            var obj = list[i];
            var listObj = null;
            
            for (var j = 0; j < jsonList.length; j++)
            {
                if (jsonList[j].nome === list[i].name)
                {
                    listObj = jsonList[j];
                }
            }
            
            if (listObj == null)
            {
                listObj = {
                    id:list[i].id,
                    nome:list[i].name,
                    quantidade:0,
                    
                };
                
                jsonList.push(listObj);
            }
            
            listObj.quantidade++;
        }
    
        var jsonObj = {data:jsonList};
        jsonStr = JSON.stringify( jsonObj );
    }

    
    var strReturn = "<center>";
    
    strReturn += "<a href='javascript:none();' id='anoprev'>«</a>";
    strReturn += " <a href='javascript:none();' id='ano'><b>" + ano + "</b></a> ";
    strReturn += "<a href='javascript:none();' id='anonext'>»</a>";
    
    strReturn += "<br><br>";
    
    for (var i = 1; i <= 12; i++)
    {
        if (i != 1) strReturn += " - ";    
        
        var strMes = Report.GetMonth(i);
        
        if (i == mes)
        {
            strMes = "<u>" + strMes + "</u>";
        }
        
        strReturn += "<a id='mes" + i + "'>" + strMes + "</a>";
    }
    
    strReturn += "<br><br>Total de registros: " + totalCadastros;
    
    strReturn += "</center><br><br>";
    
    strReturn += Report.GetBaseRawTable(jsonStr);
    
    
    var mainDiv = document.getElementById("tablecontent");
    mainDiv.innerHTML = strReturn;    
    
    for (var i = 1; i <= 12; i++)
    {
        var a = document.getElementById("mes" + i);
        a.index = i;
        a.onclick = function(e)
        {
            var m = i;
            Report.ShowClickByDate(data, ano, e.target.index);
        }
    }
    
    document.getElementById("ano").onclick = function()
    {
        Report.ShowClickByDate(data, ano);
    }
    
    document.getElementById("anoprev").onclick = function()
    {
        Report.ShowClickByDate(data, ano - 1);
    }
    
    document.getElementById("anonext").onclick = function()
    {
        Report.ShowClickByDate(data, ano + 1);
    }
    
    return strReturn;
}

Report.ShowTableByDate = function(data, ano, mes)
{
    Report.data = data;
    Report.mes = mes;
    Report.ano = ano;
    
    var json = JSON.parse(data)["data"];
    var list = [];
    var totalCadastros = 0;
    
    for (var i = 0; i < json.length; i++)
    {
        var obj = json[i];
        if (obj.ano == ano && (mes == null || obj.mes == mes))
        {
            list.push(obj);
            totalCadastros++;
        }
    }
    
    var jsonStr = "";
    
    if (mes == null)
    {
        var jsonList = [];
        var meses = [];
        for (var i = 1; i <= 12; i++) meses.push(0);
        
        for (var i = 0; i < list.length; i++)
        {
            var obj = list[i];
            meses[obj.mes] = meses[obj.mes] + 1 || 1;
        }
        
        for (var i = 1; i <= 12; i++)
        {
            var p = Math.floor( meses[i] / totalCadastros * 100 ) + "%";
            jsonList.push({mes:Report.GetMonth(i), cadastros:meses[i], porcentagem:p});
        }
        
        var jsonObj = {data:jsonList};
        jsonStr = JSON.stringify( jsonObj );
    }
    else
    {
        var jsonList = [];
        var dias = [];
        var diasNoMes = Report.GetDaysInMonth(ano, mes);
        for (var i = 1; i <= diasNoMes; i++) dias.push(0);
        
        for (var i = 0; i < list.length; i++)
        {
            var obj = list[i];
            dias[obj.dia] = dias[obj.dia] + 1 || 1;
        }
        
        for (var i = 1; i <= diasNoMes; i++)
        {
            var d = dias[i] || 0;
            var p = Math.floor( d / totalCadastros * 100 ) + "%";
            jsonList.push({dia:i, registros:d, porcentagem:p});
        }
        
        var jsonObj = {data:jsonList};
        jsonStr = JSON.stringify( jsonObj );
    }
    
    var strReturn = "<center>";
    
    strReturn += "<a href='javascript:none();' id='anoprev'>«</a>";
    strReturn += " <a href='javascript:none();' id='ano'><b>" + ano + "</b></a> ";
    strReturn += "<a href='javascript:none();' id='anonext'>»</a>";
    
    strReturn += "<br><br>";
    
    for (var i = 1; i <= 12; i++)
    {
        if (i != 1) strReturn += " - ";    
        
        var strMes = Report.GetMonth(i);
        
        if (i == mes)
        {
            strMes = "<u>" + strMes + "</u>";
        }
        
        strReturn += "<a id='mes" + i + "'>" + strMes + "</a>";
    }
    
    strReturn += "<br><br>Total de registros: " + totalCadastros;
    
    strReturn += "</center><br><br>";
    
    strReturn += Report.GetBaseRawTable(jsonStr);
    
    
    var mainDiv = document.getElementById("tablecontent");
    mainDiv.innerHTML = strReturn;    
    
    for (var i = 1; i <= 12; i++)
    {
        var a = document.getElementById("mes" + i);
        a.index = i;
        a.onclick = function(e)
        {
            var m = i;
            Report.ShowTableByDate(data, ano, e.target.index);
        }
    }
    
    document.getElementById("ano").onclick = function()
    {
        Report.ShowTableByDate(data, ano);
    }
    
    document.getElementById("anoprev").onclick = function()
    {
        Report.ShowTableByDate(data, ano - 1);
    }
    
    document.getElementById("anonext").onclick = function()
    {
        Report.ShowTableByDate(data, ano + 1);
    }
    
    return strReturn;
}

Report.AddTableTitle = function(title)
{
    var main = document.getElementById("maincontent");
    main.innerHTML = "";
    var div = document.createElement("div");
    document.getElementById("maincontent").appendChild(div);
    div.innerHTML = "<div id='tableheader'></div><div id='tableerror'></div><div id='tablecontent'></div>"
    
    var str = "";
    str += "<div class='title'>";
    str += "<div style='text-align:center'>" + title + "<br>";    
    str += "</div></div><br>";
    
    document.getElementById("tableheader").innerHTML = str;
    
    return str;
}

Report.GetBaseRawTable = function(data)
{
    var data = JSON.parse(data);    
    var strReturn = "";
    
    if (data.data.length > 0)
    {
        var header = "";
        var body = "";
        
        for (var i = 0; i < data.data.length; i++)
        {
            var obj = data.data[i];
            body += "<tr>\n";
            for (var property in obj) {
                if (obj.hasOwnProperty(property)) {
                    
                    if (i == 0) header += "<th>" + property + "</th>\n";
                    body += "<td>" + obj[property] + "</td>\n";   
                }
            }
            body += "</tr>\n";
        }
        
        var table = "<table id=\"\" class=\"tablesorter\">\n<thead>\n<tr>";
        table += header;
        table += "</tr>\n</thead>";
        table += "<tbody>\n";
        table += body;        
        table += "</tbody>\n</table>";  
        
        strReturn = table;
    }
    else
    {
        strReturn = "<div style='text-align:center'>Nenhuma informação cadastrada</div>";
    }
    
    return strReturn;
    
    /*
    var strReturn = "";
    var data = data.replaceAll("<BREAKLINE>", "\n");
    data = data.replaceAll("<TAB>", "\t");

    var lines = data.split("\n");

    if (lines.length > 1)
    {
        var header = lines[0].split("\t");
        var table = "<table id=\"\" class=\"tablesorter\">\n<thead>\n<tr>";

        for (var i = 0; i < header.length; i++)
        {        
            table += "<th>" + header[i] + "</th>\n";   
        }

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
                var d = line[j];
                table += "<td>" + d + "</td>\n";
            }

            table += "</tr>\n";
        }

        table += "</tbody>\n</table>";  
        strReturn = table;
    }
    else
    {
        strReturn = "<div style='text-align:center'>Nenhuma informação cadastrada</div>";
    }
    
    return strReturn;
    */
}

Report.GetRawTableFromMySQL = function(query, onComplete)
{
    DataManager.run("php/getmysqldata.php", { sql:query, type:"tsv" }, 
    function(data) 
    {
        var strTable = Report.GetBaseRawTable(data);
        if (onComplete != null) onComplete( strTable );
    });
}

Report.GetRawTableFromPHPFile = function(path, onComplete)
{
    DataManager.run(path, { }, 
    function(data) 
    {
        var strTable = Report.GetBaseRawTable(data);
        if (onComplete != null) onComplete( strTable );
    });
}