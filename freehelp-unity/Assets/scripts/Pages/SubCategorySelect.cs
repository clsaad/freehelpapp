using UnityEngine;
using UnityEngine.UI;
using System.Collections.Generic;

public class SubCategorySelect : Page
{
    public VitrineView vitrine;

    public RectTransform rectTitle;
	public GameObject originalButton;
    public Busca busca;

    public Text txtNomeCategoria;

	private List<GameObject> generatedButtons = new List<GameObject>();

	public override void Show (params object[] args)
	{
		int categoryID = (int)(args[0]);

        vitrine.Init(categoryID);



        float scale = Main.GetScreenScale();
        RectTransform vr = vitrine.GetComponent<RectTransform>();
        vr.sizeDelta = new Vector2(vr.sizeDelta.x, 340 * scale);

        rectTitle.anchoredPosition = new Vector2(0, vr.anchoredPosition.y - 340 *scale + 90);

        txtNomeCategoria.text = FreeHelp.Instance.GetCategoryByID(categoryID).name;

        Busca.category = categoryID;
        Busca.subcategory = -1;

        busca.Hide();
		originalButton.SetActive(false);

		List<SubCategory> subCategories = FreeHelp.Instance.GetSubCategory(categoryID);

		foreach (GameObject go in generatedButtons)
		{
			Destroy(go);
		}
			
		for (int i = 0; i < subCategories.Count; i++)
		{
			GameObject go = (GameObject)Instantiate(originalButton);
			generatedButtons.Add(go);
            go.transform.SetParent(originalButton.transform.parent);
			go.SetActive(true);
			RectTransform rect = go.GetComponent<RectTransform>();
			rect.localScale = Vector3.one;
            rect.offsetMin = Vector2.zero;
            rect.offsetMax = new Vector2(0, 128);
			rect.anchoredPosition = new Vector2(0, -240 - (95 * i));
			Text txt = rect.Find("Text").GetComponent<Text>();
            txt.text = "• " + subCategories[i].name;
			go.name = subCategories[i].id.ToString();

            pageBottom.anchoredPosition = new Vector2(0.5f, rect.anchoredPosition.y - 100 - (240 * scale));
		}

        busca.gameObject.SetActive(false);

		base.Show(args);
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

	public void OnClickSubcategoryButton(Button btn)
	{
        Busca.subcategory = int.Parse( btn.transform.parent.name );
        WebRequest.Post(WebRequest.REQUESTTYPE.CLICK_SUBCATEGORY, iTween.Hash("sub", btn.transform.parent.name));
        WebRequest.Post(WebRequest.REQUESTTYPE.GETSERVICELIST, iTween.Hash("cat", Busca.category.ToString(), "sub", Busca.subcategory.ToString()), OnGetServiceList);
	}

	private void OnGetServiceList(WWW www)
	{
		string data = www.text.Trim();

		if (data[0] == '{')
		{
			Page.Show("ServiceList", data);
		}
		else
		{
			// Error
		}
	}
}
