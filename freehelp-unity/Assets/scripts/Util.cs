using UnityEngine;
using UnityEngine.UI;
using System.Collections;


public class Util
{

    public static bool CheckMail(string mail)
    {
        int a = mail.IndexOf("@");
        int d = mail.LastIndexOf(".");
        int e = mail.Length;
        return (a > 0 && d > a && e > d);
    }

    public static void LoadImage(Image target, string image, Sprite defaultSprite = null)
    {
        if (target == null)
            return;

        if (image.Trim() == "")
        {
            MyDebug.Log("IMAGEM NULL");
            target.sprite = defaultSprite;
            return;
        }

        try
        {
            if (image.IndexOf("http") == 0 || image.IndexOf("www") == 0)
            {
                WebRequest.LoadImage(target, image);
            }
            else
            {
                WebRequest.LoadImageFromBase64(target, image);
            }

            MyDebug.Log("img >> " + target.sprite.textureRect.width);

            if (target.sprite.textureRect.width < 16)
            {
                target.sprite = defaultSprite;
            }
        }
        catch {
            target.sprite = defaultSprite;
        }
    }

}
