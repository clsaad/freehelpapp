using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class LoginByMail : Page
{
    public Text txtError;
    public InputField txtMail;
    public InputField txtpassword;

    public override void Show(params object[] args)
    {
        base.Show(args);

        txtError.text = "";
        ClearAllInputText();
    }

    public void OnClickLogin()
    {
        Hashtable args = new Hashtable();
        args["mail"] = txtMail.text;
        args["pass"] = txtpassword.text;

        WebRequest.Post(WebRequest.REQUESTTYPE.LOGIN_BY_MAIL, args, OnLoginCallback);
    }


    public void OnClickEsqueciMinhaSenha()
    {
        Page.Show("RecuperarSenha");
    }

    private void OnLoginCallback(WWW www)
    {
        if (www.text.Length > 0 && www.text[0] == '{' && www.text != "{\"data\":[]}")
        {
            User.Instance.OnGetAppUserDetails(www);
        }
        else
        {
            txtError.text = "Usuário ou senha inválidos.";
        }

    }
}
