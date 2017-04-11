function isset(v)
{
    return (v != null && v != "");   
}

function validaDataDeNascimento(data)
{
    return (data.length == "00/00/0000".length); 
}

function validaEmail(email) 
{
    var re = /\S+@\S+\.\S+/;
    return re.test(email);
}

function removeAcento(strToReplace) 
{
    str_acento= "áàãâäéèêëíìîïóòõôöúùûüçÁÀÃÂÄÉÈÊËÍÌÎÏÓÒÕÖÔÚÙÛÜÇ";
    str_sem_acento = "aaaaaeeeeiiiiooooouuuucAAAAAEEEEIIIIOOOOOUUUUC";
    var nova="";
    for (var i = 0; i < strToReplace.length; i++) {
    if (str_acento.indexOf(strToReplace.charAt(i)) != -1) {
    nova+=str_sem_acento.substr(str_acento.search(strToReplace.substr(i,1)),1);
    } else {
    nova+=strToReplace.substr(i,1);
    }
    }
    return nova;
}

function removeAcentoSimples(a) 
{
    var b = "";
    
    str_sem_acento = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
    
    for (var i = 0; i < a.length; i++) 
    {
        if (str_sem_acento.indexOf(a.charAt(i)) != -1) 
        {
            b += a.charAt(i);
        }
    }
    return b;
}

function validaCep(text)
{
    return (getNumbersOfString(text).length == 8);
}

function getNumbersOfString(text)
{
    var realText = "";
    for (var i = 0; i < text.length; i++)
    {
        var c = text.charCodeAt(i); 
        if (c >= 48 + 0 && c <= 48 + 9)
        {
            realText += text[i];
        }
    }
    
    return realText;
}


function validaTelefone(text)
{
    return (getNumbersOfString(text).length >= 10);
}

function validaCelular(text)
{
    return (getNumbersOfString(text).length >= 10);
}


function validaCPF(strCPF) 
{ 
    strCPF = getNumbersOfString(strCPF);
    var Soma; var Resto; Soma = 0; if (strCPF == "00000000000") return false; for (i=1; i<=9; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (11 - i); Resto = (Soma * 10) % 11; if ((Resto == 10) || (Resto == 11)) Resto = 0; if (Resto != parseInt(strCPF.substring(9, 10)) ) return false; Soma = 0; for (i = 1; i <= 10; i++) Soma = Soma + parseInt(strCPF.substring(i-1, i)) * (12 - i); Resto = (Soma * 10) % 11; if ((Resto == 10) || (Resto == 11)) Resto = 0; if (Resto != parseInt(strCPF.substring(10, 11) ) ) return false; return true; 
}


