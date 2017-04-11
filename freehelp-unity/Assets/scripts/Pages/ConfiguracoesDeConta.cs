using UnityEngine;
using System.Collections;
using UnityEngine.UI;

public class ConfiguracoesDeConta : Page
{
    public InputField inputName;
    public InputField inputPassword;
    public InputField inputPassword2;

    public Text txtError;

    public override void Show(params object[] args)
    {
        base.Show(args);

        txtError.text = "";
        ClearAllInputText();

        inputName.text = User.Instance.name;
    }

    public void OnClickSave()
    {
        string pass = inputPassword.text.Trim();
        string pass2 = inputPassword2.text.Trim();

        string name = inputName.text.Trim();


        if (name.Length < 1)
        {
            txtError.text = "Insira um nome válido.";
            return;
        }

        if (pass.Length > 0)
        {
            if (pass.Length < 8)
            {
                txtError.text = "Sua nova senha deve conter 8 ou mais caracteres.";
                return;
            }
            else if (pass != pass2)
            {
                txtError.text = "Verifique a confirmação de sua senha.";
                return;
            }
        }


        Hashtable args = new Hashtable();
        args["name"] = name;
        args["mail"] = User.Instance.login;
        if (pass != "")
        {
            args["pass"] = pass;
        }
            
        WebRequest.Post(WebRequest.REQUESTTYPE.UPDATEACCOUNT, args, OnCompleteSendData);
    }

    private void OnCompleteSendData(WWW www)
    {
        UpperBar.Instance.OnClickHome();
        MenuLateral.Instance.txtName.text = inputName.text.Trim();
        Alert.Show("Seus dados de acesso foram atualizados com sucesso!");
    }
}
