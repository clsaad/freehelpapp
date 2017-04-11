using UnityEngine;
using UnityEngine.UI;
using System;
using System.Collections;
using System.Collections.Generic;

public class WebRequest : MonoBehaviour
{
	public enum REQUESTTYPE
	{
        OPENAPP,

        GETPRIVACITY,

		CHECKCONNECTION,
        GETCATEGORY,
        GETURL,
		GETCONFIG,
		GETSERVICELIST,
		GETSERVICEDATA,
		SEARCH,
        LOGIN_BY_MAIL,
        LOGIN_BY_NETWORK,
        ADDRESS,
        COMMENT,
        HISTORY,
        VITRINE,
        CREATE_ACCOUNT,
        RENEWPASSWORD,
        UPDATEACCOUNT,
        PRIVACITY,
        ABOUT,

        CLICK_SERVICE,
        CLICK_CATEGORY,
        CLICK_SUBCATEGORY
	}



    public delegate void WWWCallback(WWW www);

    public string url;

    private Hashtable m_formData;
    private WWWCallback m_callback;
	private Image m_image;
    private WWW m_www;

    private static List<WebRequest> s_all = new List<WebRequest>();

    public static int Count
    {
        get
        {
            return s_all.Count;
        }
    }

    public static void Post(string url, Hashtable formData, WWWCallback callback)
    {
		if (formData == null) formData = new Hashtable();
        formData["userid"] = User.Instance.id.ToString();
		formData["distance"] = GeoLocation.distance.ToString();
		formData["latitude"] = GeoLocation.userLatitude.ToString();
		formData["longitude"] = GeoLocation.userLongitude.ToString();
        formData["os"] = Application.platform.ToString();

		foreach (DictionaryEntry entry in formData)
		{
            //MyDebug.LogFormat("{0} {1}", entry.Key, entry.Value);
		}

        Init(url, formData, callback);
    }

	public static void Post(REQUESTTYPE type, Hashtable formData, WWWCallback callback = null)
	{
		Post(GetURLByType(type), formData, callback);
	}

    public static void Get(string url, WWWCallback callback)
    {
        Init(url, null, callback);
    }

	public static void Get(REQUESTTYPE type, WWWCallback callback)
	{
		Get(GetURLByType(type), callback);
	}


    private static Texture2D s_circleTexture50 = null;
    private static Texture2D s_circleTexture100 = null;
    private static Texture2D s_circleTexture128 = null;


    private static Texture2D MaskTexture2D(Texture2D tex)
    {
        if (tex.width == 100 || tex.width == 128 || tex.width == 50)
        {
            if (s_circleTexture50 == null) 
            {
                TextAsset t = Resources.Load<TextAsset>("blackcircle50");
                Texture2D mask = new Texture2D(2, 2);
                mask.LoadImage(t.bytes);
                mask.Apply();
                MyDebug.Log("MASK WIDTH = " + mask.width);

                s_circleTexture50 = mask;
            }

            if (s_circleTexture100 == null) 
            {
                TextAsset t = Resources.Load<TextAsset>("blackcircle100");
                Texture2D mask = new Texture2D(2, 2);
                mask.LoadImage(t.bytes);
                mask.Apply();
                MyDebug.Log("MASK WIDTH = " + mask.width);

                s_circleTexture100 = mask;
            }

            if (s_circleTexture128 == null) 
            {
                TextAsset t = Resources.Load<TextAsset>("blackcircle128");
                Texture2D mask = new Texture2D(2, 2);
                mask.LoadImage(t.bytes);
                mask.Apply();
                MyDebug.Log("MASK WIDTH = " + mask.width);

                s_circleTexture128 = mask;
            }

            Texture2D newText = new Texture2D(tex.width, tex.height, TextureFormat.RGBA32, false);
            for (int y = 0; y < tex.width; y++)
            {
                for (int x = 0; x < tex.height; x++) 
                {
                    newText.SetPixel(x, y, Color.clear);
                }
            }

            newText.Apply();

            Color c1, c2;
            //float rgb;
            Texture2D usedMask = s_circleTexture100;
            if (tex.width == 128) usedMask = s_circleTexture128;
            if (tex.width == 50) usedMask = s_circleTexture50;

            for (int y = 0; y < tex.width; y++)
            {
                for (int x = 0; x < tex.height; x++) 
                {
                    c1 =  usedMask.GetPixel(x, y);
                    c2 = tex.GetPixel(x, y);
                    c2.a = c1.r;
                    newText.SetPixel(x, y, c2);
                }
            }

            newText.Apply();

            tex = newText;
        }
        return tex;
    }


    public static Sprite GetSpriteFromBase64(string base64)
    {
        try
        {
            byte[] bArray = System.Convert.FromBase64String(base64);

            Texture2D tex = new Texture2D(1, 1, TextureFormat.RGBA32, false);
            tex.LoadImage(bArray);
            tex.Apply();

            tex = MaskTexture2D(tex);

            //MyDebug.Log(tex.width);

            return Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height), Vector2.one * 0.5f);
        }
        catch{
        }
        return null;
    }

	public static void LoadImageFromBase64(Image target, string base64)
	{
        target.sprite = GetSpriteFromBase64(base64);
	}


	public static void LoadImage(Image target, string url)
	{
		InitImage(url, target);
	}


	public static string GetURLByType(REQUESTTYPE type)
	{
        //string prefix = "http://www.freehelpapp.com.br/app/php/";
		string prefix = "http://api.freehelpapp.com.br/";

        if (type == REQUESTTYPE.OPENAPP)
        {
            return prefix + "openapp.php";
        }
        else if (type == REQUESTTYPE.CHECKCONNECTION)
        {
            return prefix + "checkconnection.php";
        }
        else if (type == REQUESTTYPE.GETCATEGORY)
        {
            return prefix + "getcategory.php";
        }
        else if (type == REQUESTTYPE.GETCONFIG)
        {
            return prefix + "getconfig.php";
        }
        else if (type == REQUESTTYPE.GETURL)
        {
            return prefix + "geturl.php";
        }
        else if (type == REQUESTTYPE.CLICK_SERVICE) return prefix + "clickservice.php";
        else if (type == REQUESTTYPE.CLICK_CATEGORY) return prefix + "clickcategory.php";
        else if (type == REQUESTTYPE.CLICK_SUBCATEGORY) return prefix + "clicksubcategory.php";
        else if (type == REQUESTTYPE.GETSERVICELIST)
        {
            return prefix + "getservicelist.php";
        }
        else if (type == REQUESTTYPE.GETSERVICEDATA)
        {
            return prefix + "getservice.php";
        }
        else if (type == REQUESTTYPE.SEARCH)
        {
            return prefix + "search.php";
        }
        else if (type == REQUESTTYPE.ABOUT)
        {
            return prefix + "getabout.php";
        }
        else if (type == REQUESTTYPE.LOGIN_BY_MAIL)
        {
            return prefix + "loginbymail.php";
        }
        else if (type == REQUESTTYPE.PRIVACITY)
        {
            return prefix + "getprivacity.php";
        }
        else if (type == REQUESTTYPE.ADDRESS)
        {
            return prefix + "geocode.php";
        }
        else if (type == REQUESTTYPE.COMMENT)
        {
            return prefix + "comment.php";
        }
        else if (type == REQUESTTYPE.HISTORY)
        {
            return prefix + "gethistory.php";
        }
        else if (type == REQUESTTYPE.LOGIN_BY_NETWORK)
        {
            return prefix + "loginbynetwork.php";
        }
        else if (type == REQUESTTYPE.VITRINE)
        {
            return prefix + "vitrine.php";
        }
        else if (type == REQUESTTYPE.CREATE_ACCOUNT)
        {
            return prefix + "createaccount.php";
        }
        else if (type == REQUESTTYPE.RENEWPASSWORD)
        {
            return prefix + "recoverypassword.php";
        }
        else if (type == REQUESTTYPE.UPDATEACCOUNT)
        {
            return prefix + "updateacc.php";
        }


		return "";
	}

    private static void Init(string url, Hashtable formData, WWWCallback callback)
    {
        WebRequest request = (new GameObject("[ WEB REQUEST ]")).AddComponent<WebRequest>();
        s_all.Add(request);
        request.m_callback = callback;
        request.url = url;
        request.m_formData = formData;
    }


	private static void InitImage(string url, Image target)
	{
		WebRequest request = (new GameObject("[ WEB REQUEST ]")).AddComponent<WebRequest>();
		request.m_image = target;
		request.url = url;
	}

    private IEnumerator Start()
    {
        DontDestroyOnLoad(gameObject);
        WWWForm form = new WWWForm();

        string from = "editor";

        #if UNITY_ANDROID
        from = "android";
        #elif UNITY_IOS
        from = "ios";
        #endif

        form.AddField("requestfrom", from);


        if (m_formData != null)
        {
            foreach (string key in m_formData.Keys)
            {
                form.AddField(key, m_formData[key].ToString());
            }
        }



       

        if ((url.IndexOf("facebook") > 0) == false)
        {
            Dictionary<string, string> headers = form.headers;

            string user = "api";
            string pass = "Mudar4312!@";
            headers["Authorization"] = "Basic " + System.Convert.ToBase64String(System.Text.Encoding.ASCII.GetBytes(user + ":" + pass));

            byte[] rawData = form.data;

            //m_www = isPost ? new WWW(url, rawData, headers) : new WWW(url);
            m_www = new WWW(url, rawData, headers);
        }
        else
        {
            m_www = new WWW(url);
        }


        yield return m_www;

        if (m_callback != null) m_callback(m_www);
		if (m_image != null)
		{
            Texture2D tex = MaskTexture2D(m_www.texture);
            MyDebug.Log("Load image with " + tex.width);
            m_image.sprite = Sprite.Create(tex, new Rect(0, 0, tex.width, tex.height), Vector2.one * 0.5f);
		}



        s_all.Remove(this);
        Destroy(gameObject);
    }
}

