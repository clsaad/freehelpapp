using System.Collections;
using UnityEngine;
using UnityEngine.UI;

public class Busca : MonoBehaviour
{
	public static int category = 0;
	public static int subcategory = 0;
	public InputField text;

    private void Start()
    {
        text.onValidateInput += delegate(string _text, int _charIndex, char _addedChar)
        {
                return OnValidateText(_addedChar);
        };
    }


    private char OnValidateText(char addedChar)
    {
        /*
        if (addedChar == '\n')
        {
            Debug.Log("funcionou");
            addedChar = '\0';
            DoSearch();
        }
        */

        return addedChar;
    }

	public void DoSearch()
	{
        EfetuaBusca(text.text, category, subcategory);	
	}

	public void EfetuaBusca(string term, int category = -1, int subcategory = -1)
	{
        term = term.Trim();

        if (term.Length < 3)
        {
            Alert.Show("Para efetuar uma busca, é necessário incluir três ou mais caracteres.");
            return;
        }

		Hashtable args = new Hashtable();

        args["term"] = term;

		if (category > 0)
			args["cat"] = category;

		if (subcategory > 0)
			args["subcat"] = subcategory;

		WebRequest.Post(WebRequest.REQUESTTYPE.SEARCH, args, OnCompleteSearch);
	}

	private void OnCompleteSearch(WWW www)
	{
        string jsonData = www.text.Trim();
        Page.Show("ServiceList", jsonData);
	}

    public void Hide()
    {
        gameObject.SetActive(false);
    }
        


    public void Show()
    {
        gameObject.SetActive(true);
        text.text = "";
        text.Select();
        text.ActivateInputField();
    }
}


