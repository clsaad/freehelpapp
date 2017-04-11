using UnityEngine;
using UnityEngine.UI;

public class Loading : MonoBehaviour
{
	private static Loading s_instance = null;
	public static Loading Instance
	{
		get
		{
			return s_instance;
		}
	}

	public Image bg;
	public Image img;
	public Text txt;

    private float m_timeToHide = 0.0f;

	private void Awake()
	{
		s_instance = this;
		GetComponent<RectTransform>().anchoredPosition = Vector2.zero;
		Hide();
	}

	public void Show()
	{
        m_timeToHide = 0;
		gameObject.SetActive(true);
	}

	public void Hide()
	{
        m_timeToHide = 2.0f;
	}


    private void Update()
    {
        if (m_timeToHide > 0)
        {
            m_timeToHide -= Time.deltaTime;
            if (m_timeToHide <= 0)
            {
                if (WebRequest.Count > 0)
                {
                    m_timeToHide = 0.1f;
                }
                else
                {
                    _Hide();
                }
            }
        }
    }


    private void _Hide()
    {
        gameObject.SetActive(false);
    }
}

