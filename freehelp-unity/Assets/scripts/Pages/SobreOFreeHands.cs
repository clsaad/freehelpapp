using UnityEngine;
using UnityEngine.UI;

public class SobreOFreeHands : Page
{
    public UnityEngine.UI.Text text;
    public GameObject loading;

    private string GetDefaultValue()
    {
        return "FreeHelp é um aplicativo prático e ágil que localiza prestadores de serviço próximos do usuário, utilizando recursos de geolocalização ou rastreando um endereço informado. <br><br>O FreeHelp possui um banco de dados em constante atualização, onde é possível encontrar profissionais e serviços das mais variadas áreas, conhecer informações úteis, descritivo e foto dos prestadores, dados de contato, qualificações e até mapas precisos. Tudo para garantir ao máximo a segurança e a comodidade, beneficiando e estabelecendo contato entre quem presta o serviço e quem busca por ele.";
    }

    private void Awake()
    {
        WebRequest.Get(WebRequest.REQUESTTYPE.ABOUT, OnGetData);
    }

    private void OnGetData(WWW www)
    {
        MyDebug.Log(www.text);

        Destroy(loading);

        string val = "";
        if (www.error != null || www.text.Trim() == "")
        {
            val = PlayerPrefs.GetString("privacity", GetDefaultValue());
        }
        else
        {
            val = www.text;
        }

        text.text = val.Trim();
        text.text = text.text.Replace("<br>", "\n").Replace("</br>", "\n").Replace("<div>", "").Replace("</div>", "");
        text.text = text.text.Replace("<h1>", "<b>").Replace("</h1>", "</b>").Replace("<h2>", "<b><size=30>").Replace("</h2>", "</size></b>");

        //pageBottom.anchoredPosition = new UnityEngine.Vector2(0.5f, (text.preferredHeight + 300) * -1.0f);
    }

    public void OnClickEpox()
    {
        Page.Show("SobreEpox");
    }


    public void OnClickPrivacidade()
    {
        Page.Show("PoliticaDePrivacidade");
    }
}
