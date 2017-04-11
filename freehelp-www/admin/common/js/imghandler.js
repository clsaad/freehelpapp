var ImgHandler = 
{
    canvas:null,
    context2D:null,
    tempImage:null
};

ImgHandler.imgID = "imgcadastroservico";
ImgHandler.size = 512;
ImgHandler.file = null;


ImgHandler.resize = function(img, size)
{
    var min = (img.width > img.height) ? img.height : img.width;
    
    var scale = size / min;
    
    var x = Math.floor( (img.width - min) / 2 * scale );
    var y = Math.floor( (img.height - min) / 2 * scale );
    
    var w = Math.floor( img.width * scale );
    var h = Math.floor( img.height * scale );
    
    ImgHandler.canvas.width = size;   
    ImgHandler.canvas.height = size;   
    
    ImgHandler.context2D.drawImage(img, -x, -y, w, h);
}

ImgHandler.setInputFile = function(dataURL)
{
    var blobBin = atob(dataURL.split(',')[1]);
    var array = [];
    for(var i = 0; i < blobBin.length; i++) {
        array.push(blobBin.charCodeAt(i));
    }
    
    ImgHandler.file = new Blob([new Uint8Array(array)], {type: 'image/png'});
}

ImgHandler.handleFiles = function(files) 
{
    ImgHandler.file = null;
    
    if (ImgHandler.canvas == null)
    {
        ImgHandler.canvas = document.createElement("canvas");
        ImgHandler.canvas.style.display = 'none';
        document.getElementsByTagName('body')[0].appendChild(ImgHandler.canvas);
        ImgHandler.context2D = ImgHandler.canvas.getContext('2d');
    }
    
    if (ImgHandler.tempImage == null)
    {
        ImgHandler.tempImage = document.createElement("img");
        ImgHandler.tempImage.style.display = 'none';
        document.getElementsByTagName('body')[0].appendChild(ImgHandler.tempImage);
    }

    for (var i = 0; i < files.length; i++) 
    {
        var file = files[i];
        var imageType = /^image\//;

        if (!imageType.test(file.type)) {
            continue;
        }

        var img = ImgHandler.tempImage;
        img.classList.add("obj");
        img.file = file;

        var reader = new FileReader();
        reader.onload = (function(aImg) 
        { 
            return function(e) 
            {
                aImg.src = e.target.result; 
                ImgHandler.resize(aImg, ImgHandler.size);
                var image = ImgHandler.canvas.toDataURL("image/png");
                ImgHandler.setInputFile(image);
                var userImg = document.getElementById(ImgHandler.imgID);
                if (userImg != null)
                {
                    userImg.src = image;
                    userImg.style.display = 'block';
                }
            }; 
        })(img);
        
        reader.readAsDataURL(file);
    }
}