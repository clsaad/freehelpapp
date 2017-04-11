using UnityEngine;
using System.Collections.Generic;
using SimpleJSON;

public class Category
{
	public string name;
	public int id;
}

public class SubCategory
{
	public string name;
	public int cat;
	public int id;
}


public class Occupation
{
	public string name;
	public int id;
	public int sub;
	public int cat;
}

public class FreeHelp
{
	public List<Category> category = new List<Category>();
	public List<SubCategory> subCategories = new List<SubCategory>();
	public List<Occupation> occupation = new List<Occupation>();

	public float latitude
	{
		get
		{
			return -23.530606f;
			//return locationInfo.latitude;
		}
	}

	public float longitude
	{
		get
		{
			return -46.574328f;
			//return locationInfo.longitude;
		}
	}


	private FreeHelp() {}

	private static FreeHelp s_instance = null;
	public static FreeHelp Instance
	{
		get
		{
			if (s_instance == null) s_instance = new FreeHelp();
			return s_instance;
		}
	}

    public static void Quit()
    {
        #if UNITY_ANDROID
        Application.Quit();
        #endif

        #if UNITY_EDITOR
        UnityEditor.EditorApplication.isPlaying = false;
        #endif
    }

	private AudioSource m_btnClickAudioSource = null;
	public void PlayButtonSound()
	{
        return;

		if (m_btnClickAudioSource == null)
			m_btnClickAudioSource = GameObject.Find("ClickButton").GetComponent<AudioSource>();

		m_btnClickAudioSource.Play();
	}


	public List<SubCategory> GetSubCategory(int category)
	{
		List<SubCategory> list = new List<SubCategory>();
		foreach (SubCategory s in subCategories)
		{
			if (s.cat == category)
			{
				list.Add(s);
			}
		}
            
		return list;
	}

	public List<Occupation> GetOccupation(int subcategory)
	{
		List<Occupation> list = new List<Occupation>();
		foreach (Occupation s in occupation)
		{
			if (s.sub == subcategory)
			{
				list.Add(s);
			}
		}
		return list;
	}


	public string GetKM(float km)
	{
		float min = Mathf.Floor(km);
		float diff = km - min;
		float quebrado = Mathf.Floor( diff * 100 );
		string str = min + "." + quebrado.ToString("00") + "KM";
		return str;
	}

	public void OnLogin()
	{
		MenuLateral.Instance.OnLogin();
		Page.Show("CategorySelect");
	}


	public Occupation GetOccupationByID(int id)
	{
		foreach (Occupation s in occupation)
		{
			if (s.id == id) return s;
		}
		return null;
	}

	public Category GetCategoryByID(int id)
	{
		foreach (Category s in category)
		{
			if (s.id == id) return s;
		}
		return null;
	}

	public SubCategory GetSubcategoryByID(int id)
	{
		foreach (SubCategory s in subCategories)
		{
			if (s.id == id) return s;
		}
		return null;
	}

	public void Init(string categoryList)
	{
		JSONNode json = JSON.ParseFromWeb(categoryList);

		for (int i = 0; i < json["category"].Count; i++)
		{
			JSONNode node = json["category"][i];

			Category o = new Category();
			o.id = node["id"].AsInt;
			o.name = node["name"].Value;

			category.Add(o);
		}

		for (int i = 0; i < json["subcategory"].Count; i++)
		{
			JSONNode node = json["subcategory"][i];

			SubCategory o = new SubCategory();
			o.id = node["id"].AsInt;
			o.cat = node["cat"].AsInt;
			o.name = node["name"].Value;

			subCategories.Add(o);
		}

		for (int i = 0; i < json["occupation"].Count; i++)
		{
			JSONNode node = json["occupation"][i];

			Occupation o = new Occupation();
			o.id = node["id"].AsInt;
			o.cat = node["cat"].AsInt;
			o.sub = node["sub"].AsInt;
			o.name = node["name"].Value;

			occupation.Add(o);
		}
	}
}

