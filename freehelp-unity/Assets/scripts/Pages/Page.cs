using UnityEngine;
using UnityEngine.UI;
using UnityEngine.EventSystems;
using System.Collections.Generic;


public class Page : MonoBehaviour
{
	private static List<Page> s_allPages = new List<Page>();

    public RectTransform pageContent;
    public RectTransform pageBottom;

	public static string jsonData = "";

    protected RectTransform m_rectTransform;

	public void Init()
	{
		m_rectTransform = GetComponent<RectTransform>();
		s_allPages.Add(this);
		Hide();
	}

    private float m_minY = 0.0f;
    public float m_maxY = 0.0f;

    private float m_lastInputY = 0.0f;
    private float m_currentInputY = 0.0f;

    private float m_initialPosY = 0.0f;

    private bool m_dragging = false;
    public float m_wantedY = 0.0f;

    private int m_dragCount = 0;

    public static string currentPage = "";


    public float MouseWorldPositionY()
    {
        return Camera.main.ScreenToWorldPoint(Input.mousePosition).y;
    }


    protected void ClearAllInputText()
    {
        InputField[] fields = transform.GetComponentsInChildren<InputField>();
        foreach (InputField input in fields)
        {
            input.text = "";
        }
    }

    protected virtual void Update ()
    {
		if (MenuLateral.Instance.IsOppened ())
			return;


        if (TutorialManager.Instance.visible)
            return;

        if (pageContent != null)
        {
            if (pageBottom != null)
            {
                m_maxY = (pageBottom.anchoredPosition.y * -1) - 1280 - m_rectTransform.anchoredPosition.y;// + 120;
                if (m_maxY < 0) m_maxY = 0;
            }

            if (Input.GetMouseButtonDown(0))
            {
                m_dragCount = 0;
                m_initialPosY = m_lastInputY = MouseWorldPositionY();
                
                m_dragging = true;

                if (EventSystem.current.IsPointerOverGameObject())
                {
                    if (EventSystem.current.currentSelectedGameObject != null)
                    {
                        Button b = EventSystem.current.currentSelectedGameObject.GetComponent<Button>();
                        if (b != null)
                        {
                            b.OnDeselect(null);
                        }
                    }
                }
            }

            if (Input.GetMouseButtonUp(0))
            {
                m_dragCount = 0;
                DragBlocker.Instance.OnDrop();
            }

            if (m_dragging)
            {
                m_dragCount++;
                if (m_dragCount > 6)
                {
                    float distanceFRomInitial = Mathf.Abs( (m_currentInputY - m_initialPosY) * 55.0f );
                    if (distanceFRomInitial > 5)
                    {
                        DragBlocker.Instance.OnDrag();
                    }
                }

                m_currentInputY = MouseWorldPositionY();
                if (Input.GetMouseButton(0))
                {

                    m_wantedY = Mathf.Clamp((pageContent.anchoredPosition.y + Distance() * 2.2f), m_minY, m_maxY);
                    pageContent.anchoredPosition = new Vector2(pageContent.anchoredPosition.x, m_wantedY);

                    m_lastInputY = m_currentInputY;
                }
                else
                {
                    m_dragging = false;

                    m_wantedY += Distance() * 8.0f;
                }
            }
            else
            {
                float y = Mathf.Lerp(pageContent.anchoredPosition.y, m_wantedY, Time.unscaledDeltaTime * 8.0f);
                pageContent.anchoredPosition = new Vector2(pageContent.anchoredPosition.x, Mathf.Clamp(y, m_minY, m_maxY));
            }
        }
    }


    private float Distance()
    {
        return (m_currentInputY - m_lastInputY) * 55.0f;
    }


    public virtual void OnJustSetVisible()
    {

    }

	public virtual void Show(params object[] args)
	{
		gameObject.SetActive(true);
		MoveToUp();
		string n = gameObject.name;
		if (n == "CategorySelect")
		{
			UpperBar.Instance.cadencia = new List<string>();
		}
		UpperBar.Instance.cadencia.Add(gameObject.name);

        FreeHelpAnalytics.Page("app::page " + gameObject.name);

        DragBlocker.Instance.OnDrop();
	}

	public virtual void Hide()
	{
		m_dragging = false;
		gameObject.SetActive(false);
	}
        
	public static void JustSetVisible(string name)
	{
		foreach(Page p in s_allPages)
		{
			if (p.name == name)
			{
				p.MoveToUp();
				p.gameObject.SetActive(true);
                p.OnJustSetVisible();
			}
			else
			{
				p.Hide();
			}
		}

        currentPage = name;

		UpperBar.Instance.OnChangeMenu(name);
	}

	public void MoveToUp()
	{
		m_wantedY = m_minY;
		if (pageContent != null)
		{
			pageContent.anchoredPosition = new Vector2(pageContent.anchoredPosition.x, m_minY);
		}
	}

	public static void Show(string name, params object[] args)
	{
        MyDebug.Log("Show " + name);
        foreach (object a in args)
        {
            //MyDebug.Log(a);
        }

		foreach(Page p in s_allPages)
		{
			if (p.name == name)
			{
				p.Show(args);
			}
			else
			{
				p.Hide();
			}
		}

        currentPage = name;

		UpperBar.Instance.OnChangeMenu(name);
        TutorialManager.Instance.ShowTutorial(name);
	}
}
