using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class MenuLateral : MonoBehaviour
{
    private static MenuLateral s_instance = null;
    public static MenuLateral Instance{
        get
        {
            return s_instance;
        }
    }

    public GameObject btnConfidDeConta;
	public GameObject goPerfil;
    public GameObject goHistorico;
	public GameObject goHistoricoFaixa;
	public GameObject goSair;
	public GameObject goEntrar;

	public Image imgUser1;
	public Image imgUser2;
	public Text txtName;

    public Sprite userImageDefault;

    private bool m_opened = false;
    private Image background;
    private RectTransform menu;

    private float m_wantedX = -500;

    public bool IsOppened()
    {
        return m_opened;
    }

    private void Awake()
    {
        s_instance = this;

    }

	public void OnLogin()
	{
		bool logged = User.Instance.IsLogged;

		goPerfil.SetActive(logged);
		goHistorico.SetActive(logged);
        goHistoricoFaixa.SetActive(logged);
		goSair.SetActive(logged);
		goEntrar.SetActive(!logged);

        btnConfidDeConta.SetActive(User.Instance.type == User.TYPE.MAIL);

        if (logged)
        {
            txtName.text = User.Instance.name;

            Util.LoadImage(imgUser1, User.Instance.image, userImageDefault);
            Util.LoadImage(imgUser2, User.Instance.image, userImageDefault);
        }
	}

    private void Start()
    {
        background = GetComponent<Image>();
        menu = transform.Find("Menu").GetComponent<RectTransform>();

        m_opened = false;
        background.enabled = false;
        menu.anchoredPosition = new Vector2(m_wantedX, 0);
    }

    private void Update ()
    {
        float x = menu.anchoredPosition.x;
        x = Mathf.Lerp(x, m_wantedX, Time.deltaTime * 15.0f);
        menu.anchoredPosition = new Vector2(x, 0);
	}

    public void Toggle()
    {
        m_opened = !m_opened;
        background.enabled = m_opened;
        m_wantedX = m_opened ? 0 : -500;

        UpperBar.Instance.OnChangeMenu("toggle");
    }

    public void Hide()
    {
        m_opened = true;
        Toggle();
    }

    public void Show()
    {
        m_opened = false;
        Toggle();
    }

    public void OnClickConfigAcc()
    {
        FreeHelp.Instance.PlayButtonSound();
        Page.Show("ConfiguracoesDeConta");
        Hide();
    }

    public void OnClickButton(int id)
    {
		FreeHelp.Instance.PlayButtonSound();

		if (id == 0)// configuracoes
		{
			Page.Show("Configuracoes");
		}
        if (id == 1) // AVALIE
        {
            FreeHelpAnalytics.Event("avaliar");
            Application.OpenURL(URL.RATE);
        }
        if (id == 2) // SHARE
        {
            FreeHelpAnalytics.Event("compartilhar app");
            PhoneUtils.ShareText("FreeHelp", "Descobri esse aplicativo que busca, localiza e informa sobre os mais variados serviços! É uma grande ideia para fornecedores e consumidores, então lembrei de você!" + System.Environment.NewLine + System.Environment.NewLine + "Instale agora para conferir!" + System.Environment.NewLine + URL.SHARE);
        }
        if (id == 3) // PRIMEIROS PASSOS
        {
            //Alert.Show("Primeiros passos!");
            FreeHelpAnalytics.Event("primeiros passos");
            TutorialManager.Instance.Clear();

        }
		if (id == 4) // Curta nosso facebook
		{
            FreeHelpAnalytics.Event("curtir facebook");
            Application.OpenURL(URL.FACEBOOK);
		}
		else if (id == 5)
		{
			Page.Show("SobreOFreeHelp");
		}
		else if (id == 6)
		{
			Page.Show("FaleConosco");
		}
		else if (id == 7)
		{
			User.Instance.Logoff();
			Page.Show("Login");
		}
		else if (id == 8) // SAIR
		{
			User.Instance.Logoff();
			Page.Show("Login");
		}
		else if (id == 9) // HISTORICO
		{
            FreeHelpAnalytics.Event("histórico");
            OnClickHistorico();
		}

        Hide();
    }



    public void OnClickHistorico()
    {
        Busca.category = 0;
        Busca.subcategory = 0;

        WebRequest.Post(WebRequest.REQUESTTYPE.HISTORY, null, OnGetHistoryList);
    }

    private void OnGetHistoryList(WWW www)
    {
        string data = www.text.Trim();

        if (data[0] == '{')
        {
            Page.Show("ServiceList", data);
        }
        else
        {
            // Error
        }
    }
}
