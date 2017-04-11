using UnityEngine;
using UnityEngine.UI;
using SimpleJSON;

using System.Collections.Generic;

public class ServiceList : Page
{
    public class ServiceData
    {
        public JSONNode data;
        public int id;
        public bool listed = false;
    }

    public GameObject originalButton;
	public GameObject originalTextSeparator;
    public GameObject goNotFound;

    public Sprite defaultUserImage;

    public Text txtNomeCategoria;

    public Button btnLupa;
    public Busca busca;

	private List<GameObject> generatedButtons = new List<GameObject>();

    private List<int> empresas = new List<int>();

    private string usedJson = "";

    public override void OnJustSetVisible()
    {
        jsonData = usedJson;
        base.OnJustSetVisible();
    }

	public override void Show (params object[] args)
	{

        MyDebug.Log("SUB CATEGORY" + Busca.subcategory);
        

        if (Busca.category == 0 && Busca.subcategory == -1)
        {
            txtNomeCategoria.text = "Busca";
        }
        else if (Busca.category != 0 && Busca.subcategory <= 0)
        {
            txtNomeCategoria.text = FreeHelp.Instance.GetCategoryByID(Busca.category).name;
        }
        else
        {
            txtNomeCategoria.text = (Busca.subcategory == 0) ? "Histórico" : FreeHelp.Instance.GetSubcategoryByID(Busca.subcategory).name;
        }

		jsonData = (string)args[0];

        usedJson = jsonData;

        busca.Hide();

        JSONNode json = JSON.ParseFromWeb(jsonData);
		JSONNode data = json["data"];

		originalButton.SetActive(false);
        originalTextSeparator.SetActive(false);

		foreach(GameObject go in generatedButtons)
		{
			Destroy(go);
		}

        goNotFound.SetActive(data.Count == 0);

        empresas.Clear();

        List<ServiceData> servicesData = new List<ServiceData>();

        for (int i = 0; i < data.Count; i++)
        {
            ServiceData sd = new ServiceData();
            sd.data = data[i];
            if (sd.data["id"].Value != "")
            {
                int id = sd.data["id"].AsInt;
                sd.id = id;
                //Debug.Log(sd.data["name"].Value + ", " + sd.data["id"].AsInt);
                if (empresas.Contains(id) == false)
                {
                    empresas.Add(id);
                    servicesData.Add(sd);
                }
            }
        }

        List<List<ServiceData>> serviceByOccupation = new List<List<ServiceData>>();
        for (int i = 0; i < 512; i++)
        {
            serviceByOccupation.Add(new List<ServiceData>());
        }
            
        Debug.Log("SUB CATEGORIA " + Busca.subcategory);

        for (int i = 0; i < servicesData.Count; i++)
        {
            ServiceData sd = servicesData[i];

            List<int> o = new List<int>();

            if (Busca.subcategory > 0)
            {
                for (int j = 1; j <= 3; j++)
                {
                    if (sd.data["subcategory" + j].AsInt == Busca.subcategory)
                    {
                        o.Add(sd.data["occupation" + j].AsInt);
                    }
                }
            }
            else
            {
                for (int j = 1; j <= 3; j++)
                {
                    o.Add(sd.data["occupation" + j].AsInt);
                }
            }


            for (int j = 0; j < o.Count; j++)
            {
                if (o[j] > 0)
                {
                    if (serviceByOccupation[o[j]].Contains(sd) == false)
                    {
                        serviceByOccupation[o[j]].Add(sd);
                        sd.listed = true;
                    }
                }
            }
        }

        int addCount = 0;
        float _i = 0;

        var SEPARATE_BY_OCCUPATION = false;

        if (SEPARATE_BY_OCCUPATION == true)
        {
            for (int o = 0; o < serviceByOccupation.Count; o++)
            {
                if (serviceByOccupation[o].Count > 0)
                {
                    Debug.Log(o);
                    Occupation occupation = FreeHelp.Instance.GetOccupationByID(o);

                    if (occupation != null)
                    {
                        AddTitle(occupation.name, _i);
                        _i += 0.3f;
                    }

                    for (int i = 0; i < serviceByOccupation[o].Count; i++)
                    {
                        AddService(serviceByOccupation[o][i], _i);
                        servicesData.Remove(serviceByOccupation[o][i]);

                        _i += 1.0f;
                        addCount++;
                    }
                }
            }
        }

        // OUTROS
        if (servicesData.Count > 0)
        {
            if (addCount > 0)
            {
                AddTitle("Outros", _i);
                _i += 0.3f;
            }


            for (var i = 0; i < servicesData.Count; i++)
            {
                AddService( servicesData[i], _i );
                _i += 1.0f;
            }
        }




        base.Show (args);
	}


    private void AddTitle(string text, float _i)
    {
        GameObject go = (GameObject)Instantiate(originalTextSeparator);
        generatedButtons.Add(go);
        go.transform.SetParent(originalTextSeparator.transform.parent);
        go.SetActive(true);
        RectTransform rect = go.GetComponent<RectTransform>();
        rect.localScale = Vector3.one;
        rect.offsetMin = new Vector2(0, 0);
        rect.offsetMax = new Vector2(0, 100);
        rect.anchoredPosition = new Vector2(0, -225 - (208 * _i));
        rect.Find("txtNome").GetComponent<Text>().text = text;
 
    }

    private void AddService(ServiceData sd, float _i)
    {
        GameObject go = (GameObject)Instantiate(originalButton);
        generatedButtons.Add(go);
        go.transform.SetParent(originalButton.transform.parent);
        go.SetActive(true);
        RectTransform rect = go.GetComponent<RectTransform>();
        rect.localScale = Vector3.one;
        rect.offsetMin = new Vector2(0, 0);
        rect.offsetMax = new Vector2(0, 100);
        rect.anchoredPosition = new Vector2(0, -225 - (208 * _i));
        //Debug.Log(sd.data);
        //Debug.Log(sd.data.ToString());

        string str_occupation = sd.data["str_occupation"].Value.Trim();
        string strOccupation = str_occupation == "" ? GetOccupationBySubcategory(Busca.subcategory, sd).Trim() : str_occupation;
        rect.Find("txtOccupation").GetComponent<Text>().text = strOccupation;

        rect.Find("txtNome").GetComponent<Text>().text = sd.data["name"].Value;
        rect.Find("txtEndereco").GetComponent<Text>().text = sd.data["end_bairro"].Value;
        rect.Find("txtDistancia").GetComponent<Text>().text = FreeHelp.Instance.GetKM(sd.data["distance"].AsFloat);

        if (strOccupation == "")
        {
            List<RectTransform> rts = new List<RectTransform>()
            {
                    rect.Find("txtEndereco").GetComponent<RectTransform>(),
                    rect.Find("txtDistancia").GetComponent<RectTransform>(),
                    rect.Find("likes").GetComponent<RectTransform>()
            };

            for (int i = 0; i < rts.Count; i++)
            {
                rts[i].anchoredPosition = new Vector2(rts[i].anchoredPosition.x, rts[i].anchoredPosition.y + 35);
            }
        }


        Transform starsCountainer = rect.Find("likes");
        List<Image> starsImage = new List<Image>()
        {
            starsCountainer.Find("like0").GetComponent<Image>(),
            starsCountainer.Find("like1").GetComponent<Image>(),
            starsCountainer.Find("like2").GetComponent<Image>(),
            starsCountainer.Find("like3").GetComponent<Image>(),
            starsCountainer.Find("like4").GetComponent<Image>()
        };

        float stars = sd.data["median_stars"].AsFloat;
        for (int i = 0; i < starsImage.Count; i++)
        {
            starsImage[i].color = new Color(0,0,0, (stars <= i) ? 0.35f : 1.0f);
        }

        go.name = sd.data["id"].Value;

        Debug.Log("service = " + sd.data["id"].Value + ", stars = " + sd.data["median_stars"].Value);

        pageBottom.anchoredPosition = new Vector2(0.5f, rect.anchoredPosition.y - 150);


        string _image = sd.data["image"].Value.Trim();
        Image imgService = rect.Find("imgMask").Find("imgServico").GetComponent<Image>();
        Util.LoadImage(imgService, _image, defaultUserImage);

    }


    private string GetOccupationBySubcategory(int subcategory, ServiceData sd)
    {
        //Debug.Log("subcategory = " + subcategory);

        string str = "";

        for (int i = 1; i <= 3; i++)
        {
            if (sd.data["subcategory" + i].AsInt == subcategory)
            {
                Occupation o = FreeHelp.Instance.GetOccupationByID(sd.data["occupation" + i].AsInt);

                if (o != null)
                {
                    if (str != "")
                        str += " - ";
                    
                    str += o.name;
                }
            }
        }

        return str;
    }



	public void OnClickServiceButton(Button btn)
	{
        WebRequest.Post(WebRequest.REQUESTTYPE.CLICK_SERVICE, iTween.Hash("service", btn.transform.parent.name));
		WebRequest.Post(WebRequest.REQUESTTYPE.GETSERVICEDATA, iTween.Hash("id", btn.transform.parent.name), OnGetServiceData);
	}

	public void OnGetServiceData(WWW www)
	{
		string data = www.text.Trim();

		if (data[0] == '{')
		{
			Page.Show("Service", data);
		}
		else
		{
			// Error
		}
	}

    public void OnClickBusca()
    {
        if (busca.gameObject.activeSelf == true)
        {
            busca.DoSearch();
        }
        else
        {
            busca.Show();
        }
    }
}
