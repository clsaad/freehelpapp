using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class CadastroEmail : Page
{
    public Text txtError;

    public InputField inputName;
    public InputField inputMail;
    public InputField inputPassword;
    public InputField inputPassword2;

    public override void Show(params object[] args)
    {
        base.Show(args);

        ClearAllInputText();
        txtError.text = "";
    }

    public void OnClickNext()
    {
        if (inputName.text.Trim() == "")
        {
            txtError.text = "Nome inválido.";
            return;
        }

        if (Util.CheckMail( inputMail.text ) == false)
        {
            txtError.text = "E-mail inválido.";
            return;
        }

        if (inputPassword.text.Length < 8)
        {
            txtError.text = "Sua senha deve conter ao menos 8 dígitos.";
            return;
        }

        if (inputPassword.text != inputPassword2.text)
        {
            txtError.text = "Confirmação de senha incorreta.";
            return;
        }

        System.Collections.Hashtable args = new Hashtable();
        args["name"] = inputName.text.Trim();
        args["login"] = inputMail.text.Trim();
        args["pass"] = inputPassword.text.Trim();
        WebRequest.Post(WebRequest.REQUESTTYPE.CREATE_ACCOUNT, args, OnCreateAccountCallback);
    }

    private void OnCreateAccountCallback(WWW www)
    {
        string data = www.text.Trim();

        if (data.Length > 0 && data[0] == '{' && data != "{\"data\":[]}")
        {
            User.Instance.OnGetAppUserDetails(www);
        }
        else
        {
            txtError.text = "E-mail já cadastrado.";
        }
    }
}
