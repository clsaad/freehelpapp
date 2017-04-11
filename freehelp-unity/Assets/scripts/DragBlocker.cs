using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class DragBlocker : MonoBehaviour
{
    public Image image;

    private static DragBlocker s_instance; 
    public static DragBlocker Instance
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

    private void Start()
    {
        OnDrop();
    }

    public void OnDrag()
    {
        image.raycastTarget = true;
    }

    public void OnDrop()
    {
        image.raycastTarget = false;
    }
}
