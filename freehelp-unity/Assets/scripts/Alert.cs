using UnityEngine;
using System.Collections;

public class Alert : MonoBehaviour
{
    private static Alert s_instance = null;
    public static Alert Instance
    {
        get
        {
            return s_instance;
        }
    }

    private void Awake()
    {
        s_instance = this;
    }
        
    public delegate void AlertCallback();

    public RectTransform m_view;

    public UnityEngine.UI.Text text;
    private AlertCallback callback = null;

    public static void Show(string message, AlertCallback callback = null)
    {
        s_instance.text.text = message;
        s_instance.callback = callback;
        s_instance.m_view.gameObject.SetActive(true);
    }

    public void OnClickOk()
    {
        if (callback != null)
        {
            callback();
        }

        s_instance.m_view.gameObject.SetActive(false);
    }
}
