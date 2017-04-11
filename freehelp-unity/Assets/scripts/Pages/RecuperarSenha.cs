using UnityEngine;
using UnityEngine.UI;
using System.Collections;

// recoverypassword.php

public class RecuperarSenha : Page
{
    public Text txtError;
    public InputField inputMail;

    public override void Show(params object[] args)
    {
        base.Show(args);

        txtError.text = "";
        ClearAllInputText();
    }

    public void OnClickNext()
    {
        FreeHelpAnalytics.Event("app recuperar senha");

        string mail = inputMail.text;
        if (Util.CheckMail(mail))
        {
            Hashtable args = new Hashtable(); 
            args["mail"] = mail;
            WebRequest.Post(WebRequest.REQUESTTYPE.RENEWPASSWORD, args, null);
            Page.Show("Login");
            Alert.Show("Uma e-mail com informações de recuperação de senha foi enviado para " + mail + ".");
        }
        else
        {
            txtError.text = "E-mail inválido.";
        }
    }
}
