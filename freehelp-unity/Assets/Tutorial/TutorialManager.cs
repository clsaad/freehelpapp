using UnityEngine;
using System.Collections;
using System.Collections.Generic;

public class TutorialManager : MonoBehaviour 
{
    private static TutorialManager s_instance = null;
    public static TutorialManager Instance
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

    public List<GameObject> listWindow;
    private bool m_visible = false;


    public void OnClickClose()
    {
        foreach (GameObject go in listWindow)
        {
            go.SetActive(false);
        }
        m_visible = false;
    }

    public void Clear()
    {
        for (int i = 0; i < 3; i++)
        {
            PlayerPrefs.SetInt("tutorial" + i, 0);
        }

        ShowTutorial("CategorySelect");
    }


    public bool visible
    {
        get
        {
            return m_visible;
        }
    }

    public void ShowTutorial(string pageName)
    {
        string[] names = new string[]{"CategorySelect", "SubCategorySelect", "Service" };
        int index = -1;
        for (int i = 0; i < names.Length; i++)
        {
            if (names[i] == pageName)
            {
                index = i;
            }
        }

        if (index >= 0)
        {
            if (PlayerPrefs.GetInt("tutorial" + index, 0) == 0)
            {
                PlayerPrefs.SetInt("tutorial" + index, 1);
                listWindow[index].SetActive(true);
                m_visible = true;
            }
        }
    }
}
