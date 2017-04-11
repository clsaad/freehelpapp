using UnityEngine;

public class CategorySelect : Page
{
    public VitrineView vitrine;


    public RectTransform buttonsPos;
    public RectTransform buttonsGroup;

    public override void Show(params object[] args)
    {
        base.Show(args);

        vitrine.Init(0);

        float scale = Main.GetScreenScale();
        buttonsGroup.localScale = Vector3.one * scale;

        RectTransform vr = vitrine.GetComponent<RectTransform>();
        vr.sizeDelta = new Vector2(vr.sizeDelta.x, 340 * scale);

        buttonsPos.anchoredPosition = new Vector2(0, -300 * scale - (100 * (scale - 1)));

        pageBottom.anchoredPosition = new Vector2(0, -1160 * scale);
    }

	public void OnClickCategory(int id)
	{
        WebRequest.Post(WebRequest.REQUESTTYPE.CLICK_CATEGORY, iTween.Hash("cat", id));
		Page.Show("SubCategorySelect", id);
	}
}
