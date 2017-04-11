using UnityEngine;
using UnityEngine.UI;

using System.Collections.Generic;

public class UpperBar : MonoBehaviour
{
    private static UpperBar s_instance = null;

    public static UpperBar Instance
    {
        get
        {
            return s_instance;
        }
    }

    public GameObject btnHome;
    public GameObject btnShare;
    public GameObject btnViewMap;
    public GameObject btnViewList;
    public GameObject btnLupa;

    public Busca busca;

    public GameObject shareObject;

	public Sprite back;
	public Sprite menu;
	public Image backImage;

    public RectTransform btnToggleMenu;

	public List<string> cadencia = new List<string>();

    private RectTransform m_rectTransform;

    private void Awake()
    {
        s_instance = this;
        m_rectTransform = GetComponent<RectTransform>();
        SetVisible(false);
    }

    private void Update()
    {
		if (Input.GetKeyDown(KeyCode.Escape))
        {
            if (shareObject == null || shareObject.activeSelf == false)
            {
                if (MenuLateral.Instance.IsOppened() == true)
                {
                    PhoneUtils.ExitApp();
                }
                else
                {
                    OnPressBack();
                }
            }
        }
    }

    public void OnPressBack()
    {
		FreeHelp.Instance.PlayButtonSound();
		
		if (cadencia.Count == 1)
        {
            OnPressToggleMenu();
        }
		else if (cadencia.Count > 1)
		{
			int index = cadencia.Count - 1;
			cadencia.RemoveAt(index);
			string page = cadencia[index - 1];
			Page.JustSetVisible(page);
		}
    }

    public void OnPressToggleMenu()
    {
        MenuLateral.Instance.Toggle();
    }

	public void OnChangeMenu(string oppenedPage)
    {
        float btnX = MenuLateral.Instance.IsOppened() ? 0 : 30;
        btnToggleMenu.anchoredPosition = new Vector2(btnX, 0);

		if (cadencia.Count > 1) backImage.sprite = back; else backImage.sprite = menu;

        if (oppenedPage == "toggle")
            return;

        if (oppenedPage == "Login")
        {
            cadencia.Clear();
            SetVisible(false);
        }
        else
        {
            SetVisible(true);

            GameObject[] buttons = new GameObject[]
            {
                btnHome,
                btnShare,
                btnViewMap,
                btnViewList,
                    btnLupa,
                    busca.gameObject
            };

            foreach (GameObject btn in buttons)
            {
                if (btn != null)
                    btn.SetActive(false);
            }

            if (oppenedPage == "CategorySelect")
            {
                Busca.category = 0;
                Busca.subcategory = -1;
                btnLupa.SetActive(true);
            }
            else if (oppenedPage == "Service")
            {
                btnHome.SetActive(true);
                btnShare.SetActive(true);
            }
            else if (oppenedPage == "ServiceList")
            {
                    UpperBar.Instance.btnViewMap.SetActive(true);
                    UpperBar.Instance.btnViewList.SetActive(false);
            }
            else if (oppenedPage == "")
            {

            }
        }
    }


    public void OnClickBusca()
    {
        if (busca.gameObject.activeSelf == true)
        {
            busca.DoSearch();
        }
        else
        {
            busca.Show();
        }
    }

    private void SetVisible(bool visible)
    {
        m_rectTransform.anchoredPosition = new Vector2(0, visible ? 0 : 10000);
    }

    public void OnClickShare()
    {
        UniShare.Instance.TakeScreenshot();
    }

    public void OnClickHome()
    {
        cadencia.Clear();
        Page.Show("CategorySelect");
    }

    public void ToggleMap()
    {
        if (Page.currentPage == "Map")
        {
            Page.JustSetVisible("ServiceList");
            UpperBar.Instance.btnViewMap.SetActive(true);
            UpperBar.Instance.btnViewList.SetActive(false);
        }
        else
        {
            Page.Show("Map");
            UpperBar.Instance.btnViewMap.SetActive(false);
            UpperBar.Instance.btnViewList.SetActive(true);
        }
    }
}
