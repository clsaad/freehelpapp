using UnityEngine;

public class Login : Page
{
    public override void Show(params object[] args)
    {
        User.Instance.Logoff();
        base.Show(args);
    }

	public void OnClickFacebook()
	{
        User.Instance.FacebookLogin();
	}

	public void OnClickGoogle()
	{

	}

	public void OnClickCreateAccount()
	{
		UpperBar.Instance.cadencia.Add("Login");
        Page.Show("CadastroEmail");
	}

	public void OnClickLoginByMail()
	{
		UpperBar.Instance.cadencia.Add("Login");
        Page.Show("LoginEmail");
	}

	public void OnClickCadastrarServico()
	{
        // Abre o site do FreeHelp
        Application.OpenURL("http://www.freehelpapp.com.br/cadastro");
	}

	public void OnClickSkip()
	{
		FreeHelp.Instance.OnLogin();
	}

    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.Escape))
        {
            PhoneUtils.ExitApp();
        }
    }
}
