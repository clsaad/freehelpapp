using UnityEngine;
using System.Collections;

public class AutoSizeWidth : MonoBehaviour 
{

    public RectTransform rect;

	void Start () {
        rect.sizeDelta = new Vector2(630.0f * Main.GetScreenScale(), rect.sizeDelta.y);
	}
}
