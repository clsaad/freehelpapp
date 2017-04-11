using UnityEngine;
using System.Collections;

public class PlayerController : MonoBehaviour {

	public float Speed;
	private int count;
	
	// Update is called once per frame
	void FixedUpdate () {
		float moveHorizontal = Input.GetAxis("Horizontal");
		float moveVertical = Input.GetAxis("Vertical");

		Vector3 movement = new Vector3(moveHorizontal, 0.0f, moveVertical);

		GetComponent<Rigidbody>().AddForce(movement * Speed * Time.deltaTime);
	}

	void OnTriggerEnter(Collider other)
	{
		if (other.gameObject.tag == "Pickup")
		{
			other.gameObject.SetActive(false);
			count += 1;
		}
	}
}
