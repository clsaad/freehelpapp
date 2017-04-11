using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class Map : Page
{
    private static Map s_instance = null;



    public Button btnCenterMap;
    public Sprite imgUserNull;

    public RectTransform frameServico;
    public Text txtNome;
    public Text txtDescricao;
    public Text txtDistance;
    public Image imgUser;

    private float m_wantedY = -250;

    private List<GoogleMap.Marker> m_markers = new List<GoogleMap.Marker>();

    private int currentID;


    private void Awake()
    {
        s_instance = this;
    }

    public static Map Instance
    {
        get
        {
            return s_instance;
        }
    }

    public void CenterMap()
    {
        GoogleMap.Instance.SetPosition(GeoLocation.position, 14);
    }

	public override void Show (params object[] args)
	{
		base.Show (args);

        MyDebug.Log(jsonData);

        SimpleJSON.JSONNode json = SimpleJSON.JSON.ParseFromWeb(jsonData);
		json = (json["data"] == null) ? json["service"] : json["data"];

        m_markers.Clear();
		GoogleMap.Marker m = null;

        frameServico.anchoredPosition = new Vector2(0, m_wantedY);

        Vector2 center = Vector2.zero;

		Vector2 upperLeft = Vector2.zero;
		Vector2 bottonRight = Vector2.zero;

		for (int i = 0; i < json.Count; i++)
		{
			m = new GoogleMap.Marker();
			m.label = json[i]["name"].Value;
            m.endereco = json[i]["end_endereco"].Value + "\n" + json[i]["end_bairro"].Value;
            m.distance = FreeHelp.Instance.GetKM(json[i]["distance"].AsFloat);
            m.geoPos = new Vector2(json[i]["longitude"].AsFloat, json[i]["latitude"].AsFloat);
            m.id = json[i]["id"].AsInt;
            m.image = json[i]["image"].Value;
			m_markers.Add(m);

			if (i == 0) {
				upperLeft = m.geoPos;
				bottonRight = m.geoPos;
			}

			if (m.geoPos.x < upperLeft.x) {
				upperLeft.x = m.geoPos.x;
			}

			if (m.geoPos.x > bottonRight.x) {
				bottonRight.x = m.geoPos.x;
			}

			if (m.geoPos.y < upperLeft.y) {
				upperLeft.y = m.geoPos.y;
			}

			if (m.geoPos.y > bottonRight.y) {
				bottonRight.y = m.geoPos.y;
			}

            center += m.geoPos;
			OnClickService(m.id, m.label, m.image, m.endereco, m.distance, m.geoPos);
		}


		float distance = 15.0f / GeoLocation.distance * 20.0f;
		if (distance < 6)
			distance = 6;

        MyDebug.Log ("distance = " + GeoLocation.distance);

        center /= json.Count;

        int zoom = 11;

        //GoogleMap.Instance.SetPosition(m.geoPos, zoom);
		if (GeoLocation.posicaoEncontrada) {
			GoogleMap.Instance.SetPosition (center, zoom);
		} else {
			GoogleMap.Instance.SetPosition (GeoLocation.position, zoom);
		}

		GoogleMap.Instance.SetMarkers(m_markers.ToArray());


        UpperBar.Instance.btnViewMap.SetActive(false);
        UpperBar.Instance.btnViewList.SetActive(false);

        btnCenterMap.gameObject.SetActive(GeoLocation.posicaoEncontrada);
	
        if (m_markers.Count == 1)
        {
            OnClickService(m_markers[0]);
            Invoke("OnClickFirstService", 0.15f);
        }
    }

    public void OnClickServiceCard()
    {
        WebRequest.Post(WebRequest.REQUESTTYPE.GETSERVICEDATA, iTween.Hash("id", currentID), OnGetServiceData);
    }

    public void OnGetServiceData(WWW www)
    {
        string data = www.text.Trim();

        if (data[0] == '{')
        {
            Page.Show("Service", data);
        }
    }

    public void OnClickFirstService()
    {
        OnClickService(m_markers[0]);
    }

    public void OnClickService(GoogleMap.Marker marker)
    {
        OnClickService(marker.id, marker.label, marker.image, marker.endereco, marker.distance, marker.geoPos);
    }

	public void OnClickService(int id, string nome, string image, string endereco, string distance, Vector2 geoPosition)
    {
        txtNome.text = nome;
        txtDescricao.text = endereco;
        txtDistance.text = distance;

        Util.LoadImage(imgUser, image, imgUserNull);

        currentID = id;

        frameServico.gameObject.SetActive(true);
        m_wantedY = 0;
        frameServico.anchoredPosition = new Vector2(0, -240);

		GoogleMap.Instance.SetPosition(geoPosition, 15);
    }

    private void Update()
    {
        frameServico.anchoredPosition = new Vector2(0, Mathf.Lerp(frameServico.anchoredPosition.y, m_wantedY, Time.deltaTime * 8.0f));
    }
}
