using UnityEngine;
using System.Collections;

public class PrintScreen : MonoBehaviour 
{
#if UNITY_EDITOR
    private void Update()
    {
        if (Input.GetKeyDown(KeyCode.P))
        {
            int printNum = PlayerPrefs.GetInt("print", 0);

            string path = Application.dataPath + "/../Prints/" + printNum + ".png";
            Application.CaptureScreenshot(path);
            Debug.Log("Print saved as " + path);
            printNum++;
            PlayerPrefs.SetInt("print", printNum);

        }
    }
#endif
}
