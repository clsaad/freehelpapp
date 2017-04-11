using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class Vitrine
{
    private static Vitrine s_instance = null;
    public static Vitrine Instance
    {
        get
        {
            return s_instance;
        }
    }


    public class Banner
    {
        public Sprite sprite;
        public int id;
        public int category;
        public string action;

        public Banner(int id, int cat, string act)
        {
            this.action = act;
            this.category = cat;
            this.id = id;
            WebRequest.Post(WebRequest.REQUESTTYPE.VITRINE, iTween.Hash("id", id), OnGetImageData);
        }

        private void OnGetImageData(WWW www)
        {
            string data = www.text.Trim();
            string inicio = "{\"data\":[{\"image\":\"";
            if (data.IndexOf(inicio) == 0)
            {
                data = data.Substring(inicio.Length);
                data = data.Substring(0, data.Length - 4);
                this.sprite = WebRequest.GetSpriteFromBase64(data);
            }
        }
    }



    public static void Init(WWW www)
    {
        s_instance = new Vitrine(www);
    }

    public List<Banner> banners = null;

    private Vitrine(WWW www)
    {
        banners = new List<Banner>();

        string data = www.text.Trim();


        SimpleJSON.JSONNode json = SimpleJSON.JSON.ParseFromWeb(data);
        json = json["data"];

        for (int i = 0; i < json.Count; i++)
        {
            Banner b = new Banner(json[i]["id"].AsInt, json[i]["category"].AsInt, json[i]["action"].Value);
            banners.Add(b);
        }
    }
}
