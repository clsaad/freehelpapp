using UnityEngine;
using System.Collections;
using System.Collections.Generic;

using SimpleJSON;

public class Main : MonoBehaviour 
{
    //public UniShare shareObject;
	private List<Page> pages;

    private static Canvas s_canvas;

    public Canvas canvas;

    public static float GetScreenScale()
    {
        return (GetScreenWidth() * 1.0f / 720.0f);
    }


    public static float GetScreenWidth()
    {
        return s_canvas.GetComponent<RectTransform>().rect.width;
    }


    public static float GetScreenHeight()
    {
        return s_canvas.GetComponent<RectTransform>().rect.height;
    }


    private void Awake()
    {
        s_canvas = canvas;
    }

	private void Start()
	{
        HTMLUtils.Init();
		pages = new List<Page>( transform.GetComponentsInChildren<Page>(true) );

		foreach (Page p in pages)
		{
			if (p != null) p.Init();
		}

        // Init Facebook

        User.Instance.FacebookInit();
		Loading.Instance.Show();
        WebRequest.Post(WebRequest.REQUESTTYPE.OPENAPP, iTween.Hash("os", Application.platform.ToString()));
		WebRequest.Get(WebRequest.REQUESTTYPE.CHECKCONNECTION, OnConnectionChecked);
	}

	private void OnConnectionChecked(WWW www)
	{
        MyDebug.Log(www.text);
		string data = (www == null) ? "0" : www.text.Trim();

		if (data == "1")
		{
			// SUCESSO!
            MyDebug.Log("Conectado a internet!");
            WebRequest.Get(WebRequest.REQUESTTYPE.GETURL, OnGetURL);
			
		}
		else
		{
			// ERROR
            Loading.Instance.Hide();
            MyDebug.LogError("Não Conectado a internet!");
            Alert.Show("Não foi possivel conectar-se a internet. Por favor tente novamente quando houver conexões disponiveis.", OnConfirmNotConnected);
		}
	}

    private void OnGetURL(WWW www)
    {
        Debug.Log(www.text);

        try
        {
            JSONNode json = JSON.Parse(www.text);
            for (int i = 0; i < json["data"].Count; i++)
            {
                if (json["data"][i]["name"].Value == "url_share")
                {
                    URL.SHARE = json["data"][i]["value"].Value;
                }
                else if (json["data"][i]["name"].Value == "url_rate")
                {
                    URL.RATE = json["data"][i]["value"].Value;
                }
                else if (json["data"][i]["name"].Value == "url_facebook")
                {
                    URL.FACEBOOK = json["data"][i]["value"].Value;
                }
            }
        }
        catch {
        }


        WebRequest.Get(WebRequest.REQUESTTYPE.GETCATEGORY, OnGetCategoryList);
    }

    private void OnConfirmNotConnected()
    {
        FreeHelp.Quit();
        Loading.Instance.Show();
        WebRequest.Get(WebRequest.REQUESTTYPE.CHECKCONNECTION, OnConnectionChecked);
    }

    private void GetBannerData()
    {
        WebRequest.Get(WebRequest.REQUESTTYPE.VITRINE, OnGetBannerData);
    }

    private void OnGetBannerData(WWW www)
    {
        Vitrine.Init(www);
    }


	private void OnGetCategoryList(WWW www)
	{
		string data = www.text.Trim();

        //data = System.Text.Encoding.UTF8.GetString(System.Text.Encoding.GetEncoding("iso-8859-1").GetBytes(data));
        //UnityEngine.Debug.Log("converteu");

		if (data[0] == '{')
		{
            FreeHelp.Instance.Init(data);
            GetBannerData();

            // VERIFICA SE PRECISA FAZER O LOGIN
            int loginType = PlayerPrefs.GetInt("login_type", 0);
            if (loginType == 0)
            {
                // PRECISA FAZER O LOGIN
                Page.Show("Login");
                Loading.Instance.Hide();
            }
            else if (loginType == (int)User.TYPE.MAIL)
            {
                Hashtable args = new Hashtable();
                args["mail"] = PlayerPrefs.GetString("login_login", "");
                args["pass"] = PlayerPrefs.GetString("login_password", "");

                WebRequest.Post(WebRequest.REQUESTTYPE.LOGIN_BY_MAIL, args, OnAutoLoginCallback);
            }
            else if (loginType == (int)User.TYPE.FACEBOOK)
            {
                Hashtable args = new Hashtable();
                args["type"] = 1;
                args["login"] = PlayerPrefs.GetString("login_login", "");;

                WebRequest.Post(WebRequest.REQUESTTYPE.LOGIN_BY_NETWORK, args, OnAutoLoginCallback);
            }
            else
            {
                Page.Show("Login");
                Loading.Instance.Hide();
            }
		}
		else
		{
			OnConnectionChecked(null);
		}
	}


    private void OnAutoLoginCallback(WWW www)
    {
        string data = www.text.Trim();

        Loading.Instance.Hide();
        if (data.Length > 0 && data[0] == '{' && data != "{\"data\":[]}")
        {
            User.Instance.OnGetAppUserDetails(www);
        }
        else
        {
            Page.Show("Login");
        }
    }


    /*
    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.S))
        {
            Share();
        }
    }

    public void Share()
    {
        UniShare.Instance.TakeScreenshot();
    }
    //*/
}
