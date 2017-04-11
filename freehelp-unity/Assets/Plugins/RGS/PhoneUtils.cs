using UnityEngine;
using System.Collections;

using System.Runtime.InteropServices;

public class PhoneUtils
{
    #if UNITY_IOS

    [DllImport("__Internal")] private static extern void iOS_MakePhoneCall(string number);
    public static void MakeCall(string number)
    {
		string phoneNumber = "+55" + number;
        //iOS_MakePhoneCall(number);
		Application.OpenURL("tel://+55"  + number);
    }

    [DllImport("__Internal")] private static extern void iOS_SendSMS(string message, string toNumber);
    public static void SMS(string number, string message)
    {
		string phoneNumber = "+55" + number;
        iOS_SendSMS(message, number);
    }

    [DllImport("__Internal")] private static extern void iOS_SendWhatsappMessage(string message, string toNumber, string receiverName);
    public static void Whatsapp(string number, string contactName, string message)
    {
        iOS_SendWhatsappMessage(message, number, contactName);
    }

    [DllImport("__Internal")] private static extern void iOS_ShareText(string text);
    public static void ShareText(string subject, string message)
    {
        iOS_ShareText(message);
    }

	[DllImport("__Internal")] private static extern void iOS_ShareImage(string text, byte[] imgData, int _length);
	public static void ShareImage(string subject, string message, Texture2D image)
	{
		if (image != null) {
			byte[] imgData = image.EncodeToPNG ();
			iOS_ShareImage (message, imgData, imgData.Length);
		}
	}

    public static void ExitApp()
    {
    }

    //[DllImport("__Internal")] private static extern void iOS_Alert(string title, string message);


    #elif UNITY_ANDROID
    public static void MakeCall(string number)
    {
        Debug.Log("Call:+55" + number);
        AndroidJavaClass aClass = new AndroidJavaClass("com.leandrocarlos.Whatsapp");
        AndroidJavaClass jc = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject activity = jc.GetStatic<AndroidJavaObject>("currentActivity");
        aClass.CallStatic("MakeCall" , activity, "+55" + number );
    }

    public static void SMS(string number, string message)
    {
        Debug.Log("SMS:" + number);
        AndroidJavaClass aClass = new AndroidJavaClass("com.leandrocarlos.Whatsapp");
        AndroidJavaClass jc = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject activity = jc.GetStatic<AndroidJavaObject>("currentActivity");
        aClass.CallStatic("SendSMS" , activity, number , message);
    }

    public static void Whatsapp(string number, string contactName, string message)
    {
        Debug.Log("Whatsapp:" + number);
        AndroidJavaClass aClass = new AndroidJavaClass("com.leandrocarlos.Whatsapp");
        AndroidJavaClass jc = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject activity = jc.GetStatic<AndroidJavaObject>("currentActivity");
        aClass.CallStatic("SendWhatsapp" , activity, number , contactName, message);
    }

    public static void ShareText(string subject, string message)
    {
        AndroidJavaClass aClass = new AndroidJavaClass("com.leandrocarlos.Whatsapp");
        AndroidJavaClass jc = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject activity = jc.GetStatic<AndroidJavaObject>("currentActivity");
        aClass.CallStatic("ShareText" , activity, subject , message);
    }

	public static void ShareImage(string subject, string message, Texture2D image)
	{
	}

    public static void ExitApp()
    {
        AndroidJavaClass aClass = new AndroidJavaClass("com.leandrocarlos.Whatsapp");
        AndroidJavaClass jc = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
        AndroidJavaObject activity = jc.GetStatic<AndroidJavaObject>("currentActivity");
        aClass.CallStatic("ExitApp" , activity);
    }


    #else

    public static void MakeCall(string number)
    {
    }

    public static void SMS(string number, string message)
    {
    }

    public static void Whatsapp(string number, string contactName, string message)
    {
    }

    public static void ShareText(string subject, string message)
    {
    }

	public static void ShareImage(string subject, string message, Texture2D image)
	{
	}

    public static void ExitApp()
    {
    }



    #endif
}
