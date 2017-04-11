using UnityEngine;
using UnityEngine.UI;
using System.Collections;

public class GoogleMap : MonoBehaviour
{
	public class Marker
	{
		public string label;
		public int id;
        public string image;
		public Vector2 geoPos;
        public string endereco;
        public string distance;

		public override string ToString ()
		{
			return string.Format ("[Marker {0} {1}]", label, geoPos);
		}
	}

    private static GoogleMap s_instance = null;
    public static GoogleMap Instance
    {
        get
        {
            return s_instance;
        }
    }

	public OnlineMaps onlineMap;

    public Texture2D myPositionTexture = null;
    public Texture2D markTexture = null;

	private void Awake()
	{
		s_instance = this;
	}


	private void Start()
	{
		double lat = -23.5283114;
		double lng = -46.5753133;
		onlineMap.SetPosition(lng, lat);
	}



    public void SetPosition(Vector2 pos, int zoom)
	{
        onlineMap.SetPositionAndZoom(pos.x, pos.y, zoom);
	}

	public void SetMarkers(Marker[] markers)
	{
		onlineMap.RemoveAllMarkers();
		if (markers != null)
		{
			for (int i = 0; i < markers.Length; i++)
			{
				OnlineMapsMarker mark = new OnlineMapsMarker();
				mark.position = markers[i].geoPos;
				//mark.label = markers[i].label;
				mark.OnClick = OnClickMark;
				mark.customData = markers[i];
                mark.texture = markTexture;
				onlineMap.AddMarker(mark);
			}
        }

        if (GeoLocation.posicaoEncontrada)
        {
            OnlineMapsMarker me = new OnlineMapsMarker();
            me.position = GeoLocation.position;
            me.texture = myPositionTexture;
            onlineMap.AddMarker(me);

            onlineMap.Redraw();
        }
    }

	public void OnClickMark(object obj)
	{
		OnlineMapsMarker mark = (OnlineMapsMarker)obj;
        GoogleMap.Marker m = (GoogleMap.Marker)(mark.customData);

		Map.Instance.OnClickService(m.id, m.label, m.image, m.endereco, m.distance, m.geoPos);
	}


	/*
    public Image image;


    private void Awake()
    {
        s_instance = this;
        LoadMap(15, new Vector2(-23.5594607f, -46.6428091f), new Vector2(-23.5594607f, -46.6428091f));
    }

    private string GetMarker(Vector2 pos, string color)
    {
        string str = "&markers=size:mid%7Ccolor:#MARKERCOLOR#%7C#MARKERPOS#";
        str = str.Replace("#MARKERCOLOR#", color);
        str = str.Replace("#MARKERPOS#", pos.x + "," + pos.y);
        return str;
    }

    public void LoadMap(int zoom, Vector2 center, Vector2 myposition, params Vector2[] markpos)
    {
        string str = "http://maps.googleapis.com/maps/api/staticmap?center=#CENTER#&zoom=#ZOOM#&scale=2&size=640x640&maptype=roadmap&key=AIzaSyBYRvNAqjQ1mvHM6AKe5UyTZiSbg8xsaTg&format=png&visual_refresh=true";

        string strMarker = "&markers=size:mid%7Ccolor:#MARKERCOLOR#%7C#LABEL#:%7C#MARKERPOS#";

        str = str.Replace("#ZOOM#", zoom.ToString());
        str = str.Replace("#CENTER#", center.x + "," + center.y);

        str += GetMarker(myposition, "0x0000FF");
		
        image.enabled = true;
        image.sprite = null;
        WebRequest.LoadImage(image, str);
    }
    */
}