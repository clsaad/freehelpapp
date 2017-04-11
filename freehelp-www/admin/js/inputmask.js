

function mascara(o,f){
    window.v_obj=o;
    window.v_fun=f;
    setTimeout("execmascara()",1);
}

function execmascara(){
    window.v_obj.value=window.v_fun(window.v_obj.value);
}

function Mask_soNumeros(v){
    return v.replace(/\D/g,"");
}

function Mask_telefone(v){
    v=v.replace(/\D/g,"");                 //Remove tudo o que não é dígito
    
    if(v.length > 11) v = v.substring(0,11); // Limita os caracteres
    var l = v.length;
    
    v=v.replace(/^(\d\d)(\d)/g,"($1) $2"); //Coloca parênteses em volta dos dois primeiros dígitos
    
    if (l < 11)
        v=v.replace(/(\d{4})(\d)/,"$1-$2");    //Coloca hífen entre o quarto e o quinto dígitos
    else
        v=v.replace(/(\d{5})(\d)/,"$1-$2");    //Coloca hífen entre o quinto e o sexto dígitos
    
    return v;
}

function Mask_cpf(v){
    v=v.replace(/\D/g,"");                    //Remove tudo o que não é dígito
    if(v.length > 11) v = v.substring(0,11); // Limita os caracteres
    v=v.replace(/(\d{3})(\d)/,"$1.$2");       //Coloca um ponto entre o terceiro e o quarto dígitos
    v=v.replace(/(\d{3})(\d)/,"$1.$2");       //Coloca um ponto entre o terceiro e o quarto dígitos
                                             //de novo (para o segundo bloco de números)
    v=v.replace(/(\d{3})(\d{1,2})$/,"$1-$2"); //Coloca um hífen entre o terceiro e o quarto dígitos
    
    
    
    return v;
}

function Mask_cep(v){
    v=v.replace(/\D/g,"");               //Remove tudo o que não é dígito
    v=v.replace(/^(\d{5})(\d)/,"$1-$2"); //Esse é tão fácil que não merece explicações
    if(v.length > 9) v = v.substring(0,9); // Limita os caracteres
    return v;
}

function Mask_data(v){
    v=v.replace(/\D/g,"");//Remove tudo o que não é dígito
    if (v.length > 8) v = v.substr(0, 8);
    var str = "";
    for (var i = 0; i < v.length; i++)
    {
        if (i == 2 || i == 4) str += "/";
        str += v[i];
    }
    
    return str;
}

function Mask_cnpj(v){
    v=v.replace(/\D/g,"")   ;                        //Remove tudo o que não é dígito
    v=v.replace(/^(\d{2})(\d)/,"$1.$2");             //Coloca ponto entre o segundo e o terceiro dígitos
    v=v.replace(/^(\d{2})\.(\d{3})(\d)/,"$1.$2.$3"); //Coloca ponto entre o quinto e o sexto dígitos
    v=v.replace(/\.(\d{3})(\d)/,".$1/$2");           //Coloca uma barra entre o oitavo e o nono dígitos
    v=v.replace(/(\d{4})(\d)/,"$1-$2") ;             //Coloca um hífen depois do bloco de quatro dígitos
    return v;
}

function Mask_romanos(v){
    v=v.toUpperCase();             //Maiúsculas
    v=v.replace(/[^IVXLCDM]/g,""); //Remove tudo o que não for I, V, X, L, C, D ou M
    //Essa é complicada! Copiei daqui: http://www.diveintopython.org/refactoring/refactoring.html
    while(v.replace(/^M{0,4}(CM|CD|D?C{0,3})(XC|XL|L?X{0,3})(IX|IV|V?I{0,3})$/,"")!="");
        v=v.replace(/.$/,"");
    return v;
}

function Mask_site(v){
    //Esse sem comentarios para que você entenda sozinho ;-)
    v=v.replace(/^http:\/\/?/,"");
    dominio=v;
    caminho="";
    if(v.indexOf("/")>-1);
        dominio=v.split("/")[0];
        caminho=v.replace(/[^\/]*/,"");
    dominio=dominio.replace(/[^\w\.\+-:@]/g,"");
    caminho=caminho.replace(/[^\w\d\+-@:\?&=%\(\)\.]/g,"");
    caminho=caminho.replace(/([\?&])=/,"$1");
    if(caminho!="")dominio=dominio.replace(/\.+$/,"");
    v="http://"+dominio+caminho;
    return v;
}