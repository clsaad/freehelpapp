using UnityEngine;
using System.Collections;

public class HTMLUtils
{
    private static SimpleJSON.JSONNode htmlEncode = null;

    public static void Init()
    {
        TextAsset t = Resources.Load<TextAsset>("rgshtmlencoding");
        htmlEncode = SimpleJSON.JSONNode.Parse(t.text)["data"];
    }

    public static string Decode(string text)
    {
        string newText = text;
        string a, b = "";
        for (int i = 0; i < htmlEncode.Count; i++)
        {
            a = htmlEncode[i]["html"].Value;
            b = htmlEncode[i]["utf8"].Value;
            newText = newText.Replace(a, b);         
        }
        return newText;
    }
}
