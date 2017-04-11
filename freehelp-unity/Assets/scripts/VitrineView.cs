using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class VitrineView : MonoBehaviour
{
    public Image img;
    public List<Vitrine.Banner> banners;

    private List<Image> circles;

    public int category = 0;
    public int index = 0;

    private float m_elapsedTime = 0;

    public void OnClickVitrine()
    {
        if (banners.Count > 0)
        {
            string url = banners[index].action;
            if (url.IndexOf("http") != 0)
                url = "http://" + url;
            Application.OpenURL(url);
        }
    }

    public void Init(int category)
    {
        this.m_elapsedTime = 0.0f;
        this.category = category;
        index = 0;
        banners = new List<Vitrine.Banner>();
    
        try
        {
        for (int i = 0; i < Vitrine.Instance.banners.Count; i++)
        {
            if (Vitrine.Instance.banners[i].category == category)
            {
                Sprite s = Vitrine.Instance.banners[i].sprite;
                if (s != null && s.texture != null && s.texture.width > 8)
                {
                    banners.Add(Vitrine.Instance.banners[i]);
                }
            }
        }
        }
        catch {
        }

        circles = new List<Image>();
        for (int i = 0; i <= 9; i++)
        {
            Image img = transform.Find("page").Find("circle" + i).GetComponent<Image>();
            img.gameObject.SetActive(i < banners.Count);
            circles.Add(img);
        }

        index = 0;

        for (int i = 0; i < circles.Count; i++)
        {
            circles[i].color = new Color(1, 1, 1, (i != index) ? 0.5f : 1);
        }

        if (banners.Count > 0)
        {
            img.sprite = banners[0].sprite;
        }
    }

    private void Update()
    {
        if (banners.Count > 0)
        {
            m_elapsedTime += Time.deltaTime;

            if (m_elapsedTime >= 5.0f)
            {
                m_elapsedTime = 0;
                index++;
                if (index > banners.Count - 1)
                {
                    index = 0;
                }
                OnChangePage();
            }


        }

        if (pressed)
        {
            float distance = pressPos - Camera.main.ScreenToWorldPoint(Input.mousePosition).x;

            if (Mathf.Abs(distance) > 1.0f)
            {
                DragBlocker.Instance.OnDrag();
            }
        }
    }


    private void OnChangePage()
    {
        m_elapsedTime = 0;
        img.sprite = banners[index].sprite;

        for (int i = 0; i < circles.Count; i++)
        {
            circles[i].color = new Color(1, 1, 1, (i != index) ? 0.5f : 1);
        }
    }

    private float pressPos = 0;
    private float pressTime = 0;
    private bool pressed = false;
    public void OnPointerDown(UnityEngine.EventSystems.BaseEventData eventData)
    {
        pressed = true;
        pressTime = Time.timeSinceLevelLoad;
        UnityEngine.EventSystems.PointerEventData data = (UnityEngine.EventSystems.PointerEventData)eventData;
        pressPos = Camera.main.ScreenToWorldPoint(Input.mousePosition).x;
    }
        

    public void OnPointerUp(UnityEngine.EventSystems.BaseEventData eventData)
    {
        if (!pressed)
            return;
        
        float dTime = Time.timeSinceLevelLoad - pressTime;
        if (dTime < 1.5f)
        {
            UnityEngine.EventSystems.PointerEventData data = (UnityEngine.EventSystems.PointerEventData)eventData;
            float distance = pressPos - Camera.main.ScreenToWorldPoint(Input.mousePosition).x;
            if (Mathf.Abs(distance) > 1.0f)
            {
                if (banners.Count > 0)
                {
                    m_elapsedTime = 0.0f;
                    index += (distance < 0) ? -1 : 1;
                    if (index < 0)
                        index = banners.Count - 1;
                    else if (index >= banners.Count)
                    {
                        index = 0;
                    }



                    OnChangePage();
                }
            }
        }

        pressed = false;
        DragBlocker.Instance.OnDrop();
    }
}
