using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class TesteCSharp : MonoBehaviour
{

    private void Start()
    {
        WebRequest.Get(WebRequest.REQUESTTYPE.CHECKCONNECTION, OnGetData);
    }

    private void OnGetData(WWW www)
    {
        Debug.Log(www.text);
    }

    public void PhoneCall(InputField text)
    {
        PhoneUtils.MakeCall(text.text);
    }

    public void SMS(InputField text)
    {
		PhoneUtils.SMS(text.text, "Eu podia estar roubando ou matando, mas estou enviando mensagens dinamicamente! ;)");
    }

    public void Whatsapp(InputField text)
    {
		PhoneUtils.Whatsapp(text.text, "Nome", "Eu podia estar roubando ou matando, mas estou enviando mensagens dinamicamente! ;)");
    }

    public void Share(InputField text)
    {
		PhoneUtils.ShareText("Titulo", "Eu podia estar roubando ou matando, mas estou enviando mensagens dinamicamente! ;)");
    }

    public void TrocaCena()
    {
        UnityEngine.SceneManagement.SceneManager.LoadScene("Main");
    }

}
