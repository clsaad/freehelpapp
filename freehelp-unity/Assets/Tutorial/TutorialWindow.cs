using UnityEngine;
using UnityEngine.UI;
using System.Collections;
using System.Collections.Generic;

public class TutorialWindow : MonoBehaviour 
{

    public RectTransform mesmaAlturaQueAVitrine = null;
    public RectTransform alinharAbaixoBanner = null;
    public float offsetAlinharAbaixo = 0.0f;
    public RectTransform alinharAbaixoBanner2 = null;
    public float offsetAlinharAbaixo2 = 0.0f;
    public RectTransform doScale = null;

    private void Start()
    {
        float scale = Main.GetScreenScale();
        float vitrineH = 340.0f * scale;
        if (mesmaAlturaQueAVitrine != null)
        {
            mesmaAlturaQueAVitrine.sizeDelta = new Vector2(mesmaAlturaQueAVitrine.sizeDelta.x, vitrineH);
        }
    
        if (alinharAbaixoBanner != null && mesmaAlturaQueAVitrine != null)
        {
            alinharAbaixoBanner.anchoredPosition = new Vector2(alinharAbaixoBanner.anchoredPosition.x, mesmaAlturaQueAVitrine.anchoredPosition.y- mesmaAlturaQueAVitrine.sizeDelta.y - offsetAlinharAbaixo);
        }

        if (alinharAbaixoBanner2 != null && mesmaAlturaQueAVitrine != null)
        {
            alinharAbaixoBanner2.anchoredPosition = new Vector2(alinharAbaixoBanner2.anchoredPosition.x, mesmaAlturaQueAVitrine.anchoredPosition.y- mesmaAlturaQueAVitrine.sizeDelta.y - offsetAlinharAbaixo2);
        }

        if (doScale != null)
        {
            doScale.localScale = Vector3.one * scale;
        }
    }

    /*
    [System.Serializable]
    public class RectHeight
    {
        public RectTransform rect;
        public float height;
    }

    [System.Serializable]
    public class RectY
    {
        public RectTransform rect;
        public float y;
    }

    public List<RectHeight> listHeight;
    public List<RectY> listY;

	private void Start () 
    {
        foreach (RectHeight r in listHeight)
        {
            r.rect.sizeDelta = new Vector2(r.rect.sizeDelta.x, r.height);
        }

        foreach (RectY r in listY)
        {
            r.rect.anchoredPosition = new Vector2(r.rect.anchoredPosition.x, r.y);
        }
	}
 *   
 */
}
