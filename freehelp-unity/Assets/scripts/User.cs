using Facebook.Unity;
using UnityEngine.UI;
using UnityEngine;

using System.Collections.Generic;

public class User
{
	public enum TYPE
	{
		NONE = 0,
		MAIL = 1,
		FACEBOOK = 2,
		GOOGLE = 3
	}

    private static User s_instance = null;
    public static User Instance
    {
        get
        {
            if (s_instance == null)
                s_instance = new User();
            return s_instance;
        }
    }

	public TYPE type; 
    public int id = 0;
    public string name = "";
    public string status = "";
	public string image = "";
    public string login = "";
    public string password = "";
    private string access_token = "";


    public bool IsLogged
    {
        get
        {
            return (login != "");
        }
    }

    // =======================================================================

    public void FacebookInit()
    {
        FB.Init(this.OnInitComplete, this.OnHideUnity);
    }

    public void FacebookLogin()
    {
        FB.LogInWithReadPermissions(new List<string>() { "public_profile", "email", "user_friends" }, this.HandleFacebookResult);
    }

    public void FacebookLogout()
    {
        FB.LogOut();
    }

    private void OnInitComplete()
    {
        /*
        this.Status = "Success - Check logk for details";
        this.LastResponse = "Success Response: OnInitComplete Called\n";
        string logMessage = string.Format(
            "OnInitCompleteCalled IsLoggedIn='{0}' IsInitialized='{1}'",
            FB.IsLoggedIn,
            FB.IsInitialized);
        LogView.AddLog(logMessage);
        */
    }

    private void OnHideUnity(bool isGameShown)
    {
        /*
        this.Status = "Success - Check logk for details";
        this.LastResponse = string.Format("Success Response: OnHideUnity Called {0}\n", isGameShown);
        LogView.AddLog("Is game shown: " + isGameShown);
        */
    }

    private void HandleFacebookResult(IResult result)
    {
        if (result == null)
        {
            Debug.Log("Error logging on facebook");
            return;
        }

        bool success = false;

        // Some platforms return the empty string instead of null.
        if (!string.IsNullOrEmpty(result.Error))
        {
            success = false;
        }
        else if (result.Cancelled)
        {
            success = false;
        }
        else if (!string.IsNullOrEmpty(result.RawResult))
        {
            success = true;
        }
        else
        {
            success = false;
        }

        OnFacebookLogin(success, result.RawResult);
    }

    private void OnFacebookLogin(bool sucess, string resultData)
    {
        if (sucess)
        {
            MyDebug.Log(resultData);

            SimpleJSON.JSONNode node = SimpleJSON.JSON.ParseFromWeb(resultData);

			type = TYPE.FACEBOOK;
            access_token = node["access_token"].Value;
			login = node["user_id"].Value;
            password = "";


			string url = "https://graph.facebook.com/#ID#?fields=name&access_token=#TOKEN#";
			url = url.Replace("#ID#", login).Replace("#TOKEN#", access_token);
			WebRequest.Get(url, OnGetFacebookUserDetails);
        }
    }

    public void OnGetAppUserDetails(WWW www)
    {
        MyDebug.Log(www.text);

        SimpleJSON.JSONNode node = SimpleJSON.JSON.ParseFromWeb(www.text.Trim())["data"][0];

        type = TYPE.MAIL;
        id = node["id"].AsInt;
        login = node["login"].Value;
        password = node["password"].Value;
        image = node["image"].Value;
        name = node["name"].Value;
        status = node["status"].Value;
        type = (TYPE)(node["type"].AsInt + 1);

        PlayerPrefs.SetInt("login_type", (int)type);
        PlayerPrefs.SetInt("login_id", 0);
        PlayerPrefs.SetString("login_image", image);
        PlayerPrefs.SetString("login_login", login);
        PlayerPrefs.SetString("login_password", password);

        FreeHelp.Instance.OnLogin();
    }

	private void OnGetFacebookUserDetails(WWW www)
	{
        MyDebug.Log("DADOS VINDOS DO FACEBOOK!");
        MyDebug.Log(www.text);

        SimpleJSON.JSONNode node = SimpleJSON.JSON.ParseFromWeb(www.text);
		name = node["name"].Value;

        System.Collections.Hashtable args = new System.Collections.Hashtable();
        args["name"] = name;
        args["picture"] = "http://graph.facebook.com/" + login + "/picture";;
        args["type"] = 1;
        args["login"] = login;

        WebRequest.Post(WebRequest.REQUESTTYPE.LOGIN_BY_NETWORK, args, OnGetAppUserDetails);

		FreeHelp.Instance.OnLogin();
	}

	// ================================

	public void Logoff()
	{
		type = TYPE.NONE;
		login = "";
		password = "";
        image = "";

        PlayerPrefs.SetInt("login_type", 0);
        PlayerPrefs.SetInt("login_id", 0);
        PlayerPrefs.SetString("login_image", "");
        PlayerPrefs.SetString("login_login", "");
        PlayerPrefs.SetString("login_password", "");
	}
}
