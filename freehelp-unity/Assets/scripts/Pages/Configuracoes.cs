using UnityEngine;
using System.Collections;

using UnityEngine.UI;

public class Configuracoes : Page 
{
    public InputField inputLocation;
    public InputField inputKM;

    public Scrollbar scroll;

    private int distanciaBusca = 5;

    private bool mostrou = false;

    public void OnClickBack()
    {
        UpperBar.Instance.OnPressBack();
    }

    public override void Show(params object[] args)
    {
        int min = 5;
        int max = 200;
        float val = (GeoLocation.distance - min) / (max - min);

        scroll.value = val;
        inputLocation.text = GeoLocation.usedAddress;
        mostrou = true;
        base.Show(args);
    }

    public override void Hide()
    {
        base.Hide();

        if (mostrou)
        {
			OnSave ();
        }
    }


	private void OnSave()
	{
		
		GeoLocation.distance = distanciaBusca;
		PlayerPrefs.SetInt("distance", distanciaBusca);

		if (inputLocation.text.Trim ().ToLower() != "desconhecido")
		{
			Hashtable args = new Hashtable ();
			args ["address"] = inputLocation.text.Trim ();

			WebRequest.Post (WebRequest.REQUESTTYPE.ADDRESS, args, OnReceiveAddressData);
		}
	}

	private void OnReceiveAddressData(WWW www)
	{
		string data = www.text.Trim ();

		if (data [0] == '{')
		{
			SimpleJSON.JSONNode json = SimpleJSON.JSON.Parse (data);

			GeoLocation.usedAddress = json ["address"].Value;
			GeoLocation.userLatitude = json ["lat"].AsFloat;
			GeoLocation.userLongitude = json ["lon"].AsFloat;

			GeoLocation.posicaoEncontrada = true;
		}
	}

    private void NumberToKM(float value)
    {
        inputKM.text = Mathf.FloorToInt(value) + "KM";
    }

    public void OnScrollBarChange(float value)
    {
        int min = 5;
        int max = 200;
        float val = value * (max - min);
        val += min;

        distanciaBusca = Mathf.FloorToInt( val );

        NumberToKM(val );
    }
}
