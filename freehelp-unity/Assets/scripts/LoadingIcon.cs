using UnityEngine;

public class LoadingIcon : MonoBehaviour
{
	private RectTransform m_transform = null;
	private float ang = 180;
	private void Update()
	{
		ang += Time.deltaTime * 30.0f;
		if (ang >= 360) ang -= 360;
		if (m_transform == null) m_transform = GetComponent<RectTransform>();
		float vel = Mathf.Sin(ang * Mathf.PI / 180.0f);
		vel = Mathf.Clamp( Mathf.Abs(vel), 0.3f, 1.0f);
		m_transform.Rotate(0, 0, -400.0f * Time.deltaTime * vel);
	}
}
