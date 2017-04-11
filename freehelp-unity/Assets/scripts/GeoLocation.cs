using UnityEngine;
using System.Collections;

public class GeoLocation : MonoBehaviour 
{
	public static float distance = 10;
    public static float realLatitude  = -23.5513025f;
    public static float realLongitude = -46.6336568f;
    public static float userLatitude  = -23.5513025f;
    public static float userLongitude = -46.6336568f;
    public static string usedAddress  = "";
    public static string realAddress  = "";

    public static bool posicaoEncontrada = false;


    public static Vector2 position
    {
        get { return new Vector2(userLongitude, userLatitude); }
    }

    IEnumerator Start()
    {
        distance = PlayerPrefs.GetInt("distance", 15);

        // First, check if user has location service enabled
        if (!Input.location.isEnabledByUser)
        {
            MyDebug.Log("Location Disabled");
            OnLocationNotFound();
            yield break;
        }

        // Start service before querying location
        Input.location.Start();

        // Wait until service initializes
        int maxWait = 20;
        while (Input.location.status == LocationServiceStatus.Initializing && maxWait > 0)
        {
            yield return new WaitForSeconds(1);
            maxWait--;
        }

        // Service didn't initialize in 20 seconds
        if (maxWait < 1)
        {
            OnLocationNotFound();
            print("Timed out");
            yield break;
        }

        // Connection has failed
        if (Input.location.status == LocationServiceStatus.Failed)
        {
            OnLocationNotFound();
            print("Unable to determine device location");
            yield break;
        }
        else
        {
            // Access granted and location value could be retrieved
            userLatitude = realLatitude = Input.location.lastData.latitude;
            userLongitude = realLongitude = Input.location.lastData.longitude;
            //print("Location: " + Input.location.lastData.latitude + " " + Input.location.lastData.longitude + " " + Input.location.lastData.altitude + " " + Input.location.lastData.horizontalAccuracy + " " + Input.location.lastData.timestamp);
            posicaoEncontrada = true;


            GoogleMap.Instance.SetPosition(new Vector2(userLongitude, userLatitude), 14);



			Hashtable args = new Hashtable ();
			args ["latitude"] = realLatitude;
			args ["longitude"] = realLongitude;

			WebRequest.Post(WebRequest.REQUESTTYPE.ADDRESS, args, OnReceiveAddress);


        }

        // Stop service if there is no need to query location updates continuously
        Input.location.Stop();
    }

    private void OnLocationNotFound()
    {
        usedAddress = realAddress = "Desconhecido";
    }

    private void OnReceiveAddress(WWW www)
    {
        if (!string.IsNullOrEmpty(www.error) || www.text.Trim() == "0")
        {
             OnLocationNotFound();
        }
        else
        {
            usedAddress = realAddress = www.text;
        }
    }
}
