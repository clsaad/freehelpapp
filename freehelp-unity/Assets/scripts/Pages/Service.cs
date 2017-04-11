using UnityEngine;
using UnityEngine.UI;

using SimpleJSON;
using System.Collections;
using System.Collections.Generic;

public class Service : Page
{
    public Sprite defaultUserImage;

	public Image imgService;
	public Text txtDescription;
	public Text txtNomeServico;
	public Text txtLocalServico;
	public Text txtOccupation;
	public RectTransform occupationBar;
    public RectTransform insertComentario;
    public RectTransform conectese;
	public RectTransform bloqueado;
    public RectTransform txtComentarios;

    public InputField inputComentario;

	public int serviceID;

    public GameObject prefabComentario;

    public Image like1;
    public Image like2;
    public Image like3;
    public Image like4;
    public Image like5;

    public Image likeComentario1;
    public Image likeComentario2;
    public Image likeComentario3;
    public Image likeComentario4;
    public Image likeComentario5;

    public Sprite likedImage;
    public Sprite notLikedImage;

    public Button btnEntrarEmContato;

    public RectTransform actions;

    private int comentarioLikes = 5;

    public Button btnWhatsapp;
    public Button btnSMS;


    private List<GameObject> objectsToDestroy = new List<GameObject>();

    private Vector2 serviceGeoLocation;

    private string phoneNumber = "";
    private string cellphoneNumber = "";

    private int CalculateStars(JSONNode commentData)
    {
        int stars = 0;
        int count = commentData.Count > 0 ? 0 : 1;

        for (int i = 0; i < commentData.Count; i++)
        {
            stars += commentData[i]["stars"].AsInt;
            count++;
        }

        return stars / count;
    }

	public override void Show (params object[] args)
	{
        ClearAllInputText();

        OnClickMaozinha(5);

        btnEntrarEmContato.gameObject.SetActive(true);

		jsonData = (string)(args[0]);

        Debug.Log(jsonData);

        foreach (GameObject go in objectsToDestroy)
        {
            Destroy(go);
        }

        JSONNode json = JSON.ParseFromWeb(jsonData);
        JSONNode data = json["service"][0];
		JSONNode commentData = json["comment"];

        float stars = data["stars"].AsFloat;
        string str_occupation = data["str_occupation"].Value.Trim();
        Debug.Log(">>> STARS " + stars); 

        Image[] allStars = new Image[]{ like1, like2, like3, like4, like5 };
        for (int i = 0; i < 5; i++)
        {
            Color color1 = new Color(70.0f / 255.0f, 210.0f / 255.0f, 255.0f / 255.0f, 1.0f);
            Color color2 = new Color(1, 1, 1, 0.3f);

            allStars[i].color = (i < stars) ? color1 : color2;
        }


		serviceID = data["id"].AsInt;

        phoneNumber = NormalizeNumber(data["telefone"].Value.Trim());
        cellphoneNumber = NormalizeNumber(data["celular"].Value.Trim());

        btnWhatsapp.interactable = btnSMS.interactable = (cellphoneNumber != "");

		string imgBase64 = data["image"].Value;
        Util.LoadImage(imgService, imgBase64, defaultUserImage);

		txtNomeServico.text = data["name"].Value;
		txtLocalServico.text = data["end_bairro"].Value;

        serviceGeoLocation = new Vector2(data["latitude"].AsFloat, data["longitude"].AsFloat);

		string strOccupation = "";

        if (str_occupation != "")
        {
            strOccupation = str_occupation;
        }
        else
        {

            List<string> _tempOccupationList = new List<string>();

            for (int i = 1; i <= 3; i++)
            {
                int _id = data["occupation" + i].AsInt;
                Debug.Log("occ = " + _id);
                Occupation o = FreeHelp.Instance.GetOccupationByID(_id);
                if (o != null && _tempOccupationList.Contains(o.name.ToLower()) == false)
                {
                    if (strOccupation != "")
                        strOccupation += " - ";
                    strOccupation += o.name;
                    _tempOccupationList.Add(o.name.ToLower());
                }
            }
        }
			
		txtOccupation.text = strOccupation;
		occupationBar.gameObject.SetActive(txtOccupation.text != "");

		string description = data["description"].Value;
		description = description.Replace("<br>", "\n");
		txtDescription.text = description;

		float yTxtDescription = -360;
		if (occupationBar.gameObject.activeSelf != true) yTxtDescription += 80;
		txtDescription.rectTransform.anchoredPosition = new Vector2(txtDescription.rectTransform.anchoredPosition.x, yTxtDescription);

		float tamanhoDoTexto = txtDescription.preferredHeight;

        if (tamanhoDoTexto < 300)
            tamanhoDoTexto = 300;

        actions.anchoredPosition = new Vector2(0.5f, yTxtDescription - tamanhoDoTexto - 30);

        prefabComentario.SetActive(false);

        float _y = actions.anchoredPosition.y - actions.rect.height;

        if (commentData.Count > 0)
        {
            txtComentarios.gameObject.SetActive(true);
            txtComentarios.anchoredPosition = new Vector2(txtComentarios.anchoredPosition.x, _y - 35);

            _y -= 100;
        
            for (int i = 0; i < commentData.Count; i++)
            {
                string _name = commentData[i]["name"].Value;
                string _image = commentData[i]["image"].Value.Trim();
                Debug.Log("img" + _image);
                string _date = commentData[i]["date"].Value;
                int _stars = commentData[i]["stars"].AsInt;
                string _text = commentData[i]["text"].Value;

                GameObject goComentario = (GameObject)Instantiate(prefabComentario);
                goComentario.transform.SetParent(prefabComentario.transform.parent);
                RectTransform rect = goComentario.GetComponent<RectTransform>();
                rect.localScale = Vector3.one;
                float right = 0;
                float left = 0;

                //rect.offsetMin = new Vector2(left, rect.offsetMin.y);
                //rect.offsetMax = new Vector2(right, rect.offsetMax.y);

                rect.offsetMax = new Vector2(365, rect.offsetMax.y);
                rect.anchoredPosition = new Vector2(0, _y);
                goComentario.SetActive(true);

                objectsToDestroy.Add(goComentario);

                Image imgUser = goComentario.transform.Find("imgMask").Find("imgServico").GetComponent<Image>();
                Util.LoadImage(imgUser, _image, defaultUserImage);

                Text txtName = goComentario.transform.Find("txtNome").GetComponent<Text>();
                txtName.text = _name;

                Text txtComentario = goComentario.transform.Find("txtComentario").GetComponent<Text>();
                txtComentario.text = _text;

                Text txtDate = goComentario.transform.Find("txtData").GetComponent<Text>();
                txtDate.text = NormalizeDate(_date);

                Transform likes = goComentario.transform.Find("likes");

                for (var j = 0; j < likes.childCount; j++)
                {
                    Image likeImage = likes.GetChild(j).GetComponent<Image>();
                    float a = j < _stars ? 1 : (55.0f / 255.0f); 
                    likeImage.color = new Color(0, 0, 0, a);
                }



                _y -= rect.rect.height;
            }
        }
        else
        {
            txtComentarios.gameObject.SetActive(false);
            if (actions.anchoredPosition.y > -822)
                actions.anchoredPosition = new Vector2(0.5f, -822);

        }

        if (_y > -1000)
            _y = -1000;
            
        if (User.Instance.IsLogged)
        {
            conectese.gameObject.SetActive(false);

            if (User.Instance.status == "1")
            {
                insertComentario.gameObject.SetActive(true);
                bloqueado.gameObject.SetActive(false);
                insertComentario.anchoredPosition = new Vector2(0.5f, _y);
                _y -= insertComentario.rect.height;
            }
            else
            {
                insertComentario.gameObject.SetActive(false);
                bloqueado.gameObject.SetActive(true);
                bloqueado.anchoredPosition = new Vector2(0.5f, _y);
                _y -= bloqueado.rect.height;
            }
        }
        else
        {
            
            conectese.gameObject.SetActive(true);
            insertComentario.gameObject.SetActive(false);
            bloqueado.gameObject.SetActive(false);



            conectese.anchoredPosition = new Vector2(0.5f, _y);
            _y -= conectese.rect.height;
        }

        pageBottom.anchoredPosition = new Vector2(0.5f, _y);

		base.Show (args);

	
	}


    private string NormalizeDate(string date)
    {
        string str = date.Split(' ')[0];
        if (str.IndexOf('-') > 3)
        {
            string[] parts = str.Split('-');
            str = parts[2] + "-" + parts[1] + "-" + parts[0]; 
        }
        str = str.Replace("-", "/");
        return str;
    }


    public void OnClickMaozinha(int value)
    {
        Image[] images = new Image[]{ likeComentario1, likeComentario2, likeComentario3, likeComentario4, likeComentario5 };
        for (int i = 0; i < 5; i++)
        {
            Color color1 = new Color(73.0f / 255.0f, 201.0f / 255.0f, 242.0f / 255.0f, 1.0f);
            Color color2 = new Color(1, 1, 1, 0.3f);
            images[i].color = (i < value) ? color1 : color2;
        }

        comentarioLikes = value;
    }

    public void OnClickOpenMap()
    {
        FreeHelpAnalytics.Event("app::serviço mapa", this.serviceID);
		Page.Show("Map");
    }

    public void OnClickEntrarEmContato()
    {
        btnEntrarEmContato.gameObject.SetActive(false);
        //iTween.MoveTo(btnEntrarEmContato.gameObject, iTween.Hash("x", 1000, "time", 3.0f));
    }

    public void OnClickMailBlocked()
    {
        Application.OpenURL("mailto:sac@freehelpapp.com.br");
    }


    private string NormalizeNumber(string num)
    {
        return num.Replace("(", "").Replace(")", "").Replace(" ", "").Replace("-", "");

    }

    public void OnClickTelefonar()
    {
        FreeHelpAnalytics.Event("app::serviço telefonar", this.serviceID);

        // FIX
        string phone = phoneNumber.Trim() == "" ? cellphoneNumber : phoneNumber;
        PhoneUtils.MakeCall(phone);
    }

    public void OnClickEnviarSMS()
    {
        FreeHelpAnalytics.Event("app::serviço sms", this.serviceID);

        string message = "";
        string phone = cellphoneNumber;
        PhoneUtils.SMS(phone, message);
    }

    public void OnClickEnviarWhatsapp()
    {
        FreeHelpAnalytics.Event("app::serviço whatsapp", this.serviceID);

        string message = "";
        string phone = cellphoneNumber;
        PhoneUtils.Whatsapp(NormalizeNumber(phone), txtNomeServico.text, message);
    }


    public void OnClickSendComment()
    {
        if (inputComentario.text.Trim() == "")
        {
            Alert.Show("É necessário incluir um texto que expresse sua opnião!");
        }
        else
        {
            Hashtable args = new Hashtable();
            args["userid"] = User.Instance.id;
            args["serviceid"] = serviceID;
            args["text"] = inputComentario.text;
            args["stars"] = comentarioLikes;

            WebRequest.Post(WebRequest.REQUESTTYPE.COMMENT, args, OnCompletePostComment);
        }
    }

    private void OnCompletePostComment(WWW www)
    {
        FreeHelpAnalytics.Event("app::serviço comentar", this.serviceID);

        inputComentario.text = "";
        Alert.Show("Obrigado, seu comentário foi registrado com sucesso e será avaliado pela equipe FreeHelp!");
    }


    public void OnClickConectarse()
    {
        Page.Show("Login");
    }


    //////////////////////
    /// 
    /// 
    /// 

}
