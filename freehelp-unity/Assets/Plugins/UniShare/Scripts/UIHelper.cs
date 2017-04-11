using UnityEngine;
using System.Collections;

public class UIHelper : MonoBehaviour {

	public GameObject[] hide;
	public GameObject[] show;

    public bool isMainPanel = false;

	public void _Run()
	{
		for(int i=0; i<hide.Length;i++)
		{
			hide[i].SetActive(false);
		}

		for(int i=0; i<show.Length;i++)
		{
			show[i].SetActive(true);
		}
	}

    public void Update()
    {
        if (isMainPanel && Input.GetKeyDown(KeyCode.Escape))
        {
            _Run();
        }
    }

}
