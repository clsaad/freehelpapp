var Statistic = {};

Statistic.colors = ["#ff93db",
                    "#0033ff",
                    "#00008e",
                    "#cccccc",
                    "#ffffff",
                    "#ff0000",
                    "#ff6600",
                    "#000000",
                    "#ffffff",
                    "#ada8a2",
                    "#b0a8a6",
                    "#00ff00",
                    "#ffff00",
                    "#ff33cc",
                    "#663399",
                    "#cc0000",
                    "#b5b5b5",
                    "#66cc00",
                    "#006600",
                    "#000000",
                    "#a10978",
                    "#2ca109",
                    "#7e09a1",
                    "#aaeaca",
                    "#e7f9f0",
                    "#65dda1",
                    "#000033",
                    "#ff007f",
                    "#cbe2e7",
                    "#08ddf1",
                    "#6c8271",
                    "#828538",
                    "#0f2e8d",
                    "#a4c73c",
                    "#b0a3fc",
                    "#4b9859",
                    "#2f5997",
                    "#d4f5ba",
                    "#1e434d",
                    "#fc8710",
                    "#191919",
                    "#6a6a6a"];


Statistic.DisplayChart = function(type, data, title, width)
{
    var _labels = [];
    var _values = [];
    var _border = [];

    var lines = data.split("\n");
    for (var i = 0; i < lines.length; i++)
    {
        var cols = lines[i].split("\t");
        _labels.push(cols[1]);
        _values.push(cols[2]);
        _border.push(0);
    }

    if (width == null) width = '100%';

    var mainDiv = document.createElement("div");
    mainDiv.style.width = '100%';
    document.getElementById("subStatisticDiv").appendChild(mainDiv);
    mainDiv.innerHTML = "<br><center>" + title + "</center><br>";
    

    var div;

    div = document.createElement("div");
    div.style.position = "relative";
    div.style.top = 0;
    div.style.left = 0;
    div.style.left = 0;
    div.style.margin = 'auto';
    div.style.width = width;
    div.style.textAlign = 'center';
    mainDiv.appendChild(div);
    
    var separator = document.createElement("div");
    separator.innerHTML = "<hr>";
    
    mainDiv.appendChild(separator);
    
    var canvas = document.createElement('canvas');
    canvas.style.zIndex   = 8;
    canvas.style.position = "relative";
    //canvas.style.border   = "1px solid";

    div.appendChild(canvas);

    var ctx = canvas.getContext('2d');

    var data = {
        labels: _labels,
        datasets: [
            {
                label: title,
                data: _values,
                backgroundColor: Statistic.colors,
                hoverBackgroundColor: Statistic.colors,
                borderWidth: _border
            }]
    };

    // For a pie chart
    var myPieChart = new Chart(ctx,{
        type: type,
        data: data,
        options: {animation:{animateRotate:false}, stacked:true}
    });
}


Statistic.GetTodayString = function()
{
    var today = new Date();
    var dd = today.getDate();
    var mm = today.getMonth()+1; //January is 0!
    var yyyy = today.getFullYear();

    if(dd<10) {
        dd='0'+dd
    } 

    if(mm<10) {
        mm='0'+mm
    } 

    today = dd+'/' + mm + '/'+ yyyy;
    return today;
}

Statistic._ShowCategoryData = function()
{
    document.getElementById("subStatisticDiv").innerHTML = "";
    DataManager.run("php/getstatistic.php", {type:"category"}, function(data)
    {
        Statistic.DisplayChart('bar', data, "Todas as Categorias");
        
        for (var i = 1; i <= 8; i++)
        {
            DataManager.run("php/getstatistic.php", {type:"subcategory", category:i, startDate:document.getElementById('startDate').value, endDate:document.getElementById('endDate').value}, function(data, params)
            {
                Statistic.DisplayChart('pie', data, Admin.GetCategoryByID(params.category).name, "500px");
            });
        }
    });
}

Statistic.ShowCategoryData = function()
{
    var mainDiv = document.getElementById("maincontent");
    mainDiv.innerHTML = "";
    
    var dateFilter = document.createElement("div");
    dateFilter.style.zIndex = 10;
    dateFilter.innerHTML += 'Start date: <input type="text" value="00/00/0000" id="startDate" onkeydown="mascara(this,Mask_data)">';
    dateFilter.innerHTML += '\tEnd date: <input type="text" value="' + Statistic.GetTodayString()+ '" id="endDate" onkeydown="mascara(this,Mask_data)">';
    dateFilter.innerHTML += '\t<button onclick="Statistic._ShowCategoryData()">Filter</button>';
    
    mainDiv.appendChild(dateFilter);
    
    var subStatisticDiv = document.createElement("div");
    subStatisticDiv.id = "subStatisticDiv";
    mainDiv.appendChild(subStatisticDiv);
    
    Statistic._ShowCategoryData();
}