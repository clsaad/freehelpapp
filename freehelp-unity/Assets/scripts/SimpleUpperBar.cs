using UnityEngine;

public class SimpleUpperBar : MonoBehaviour
{
	public void OnClickBack()
	{
		Page.Show("Login");
	}

	private void Update()
	{
		if (Input.GetKeyDown(KeyCode.Escape))
		{
			OnClickBack();
		}
	}
}

