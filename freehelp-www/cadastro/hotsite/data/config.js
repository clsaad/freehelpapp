var APP_URL = {"googleplay": "", "appstore": "" };

var NAVEGADORES = [
    {"img":"nav_chrome.png", "url":"https://www.google.com.br/chrome/browser/desktop/"},
    {"img":"nav_firefox.png", "url":"https://www.mozilla.org/pt-BR/firefox/new/"},
    {"img":"nav_safari.png", "url":"https://support.apple.com/pt_BR/downloads/safari"},
    {"img":"nav_ie.png", "url":"http://windows.microsoft.com/pt-br/internet-explorer/download-ie"}
];

var DOMAIN = "http://cadastro.freehelpapp.com.br/hotsite";
if (document.location.hostname == "localhost")
{
    DOMAIN = "http://localhost/freehelp/cadastro/hotsite";
}


var Config = {};
Config.ENABLE_ALERT = false;
Config.ENABLE_TRACE = false;