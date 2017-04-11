using UnityEngine;
using System.Collections;

public class FreeHelpAnalytics
{
    public const string KEY = "UA-74484802-2";

    private static FreeHelpAnalytics s_instance = null;
    public static FreeHelpAnalytics Instance
	{
		get { return s_instance; }
	}

    public static void Page(string _page)
    {
        Debug.Log("open page: " + _page);
        string[] ids = new string[] { KEY };
        for (int i = 0; i < ids.Length; i++)
        {
            SmartAnalytics.SetTrackingID(ids[i]);
            SmartAnalytics.SendView(_page);
        }
    }

    public static void Event(string eventAction)
    {
        string[] ids = new string[] { KEY };
        for (int i = 0; i < ids.Length; i++)
        {
            SmartAnalytics.SetTrackingID(ids[i]);
            SmartAnalytics.SendEvent( eventAction );
        }
    }

    public static void Event(string eventAction, float eventValue)
    {
        string[] ids = new string[] { KEY };
        for (int i = 0; i < ids.Length; i++)
        {
            SmartAnalytics.SetTrackingID(ids[i]);
            SmartAnalytics.SendEvent( eventAction, eventValue );
        }
    }
	
    public static void Event(string eventLabel, string value, string eventAction, string eventCategory)
	{
        string[] ids = new string[] { KEY };
        for (int i = 0; i < ids.Length; i++)
        {
            SmartAnalytics.SetTrackingID(ids[i]);
            SmartAnalytics.SendEvent(eventLabel, value, eventAction, eventCategory);
        }
	}
}
