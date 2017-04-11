var DataManager = {};

DataManager.loadedData = [];
DataManager.loadCount = 0;

DataManager.loadDataIndex = 0;


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
        if (onDataLoaded != null) onDataLoaded(DataManager.loadDataIndex);   
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
                var realData = data;
                
                var lastIndex = data.lastIndexOf("</trace>");
                if (lastIndex >= 0)
                {
                    realData = data.substr(lastIndex + ("</trace>".length));
                    
                    data = data.replaceAll("<trace>", "");
                    
                    var parts = data.split("</trace>");
                    if (parts.length > 1)
                    {
                        for (var i = 0; i < parts.length - 1; i++)
                        {
                            console.log("[PHP] " + parts[i].trim());   
                        }
                    }
                                        
                }

                realData = realData.trim();
                callback(realData);   
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
    if (urlToCall.indexOf("http") != 0)
    {
        urlToCall = DOMAIN + "/php/" +  url;  
    }
    
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




        
