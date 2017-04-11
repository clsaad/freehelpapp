// Copyright (c) 2014 Cranium Software

// SmartAnalyticsNetwork
//
// A wrapper for simple network functionality using HTTP requests

// TODO:
// * add support for more HTTP stuff

using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public static class SmartAnalyticsNetwork
{
	public delegate void HTTPRequestComplete( string response );
	
	public static void HTTPGetRequest( string requestString )
	{
		HTTPGetRequest( requestString, null );
	}
	
	public static void HTTPGetRequest( string requestString, HTTPRequestComplete onComplete )
	{
		DummyBehaviour.StartCoroutine( SendGetRequestAsyncHelper( requestString, onComplete ) ) ;
	}
	
	public static void HTTPPostRequest( string requestString, byte[] data, Hashtable headers )
	{
		HTTPPostRequest( requestString, data, headers, null );
	}
	
	public static void HTTPPostRequest( string requestString, byte[] data, Hashtable headers, HTTPRequestComplete onComplete )
	{
		DummyBehaviour.StartCoroutine( SendPostRequestAsyncHelper( requestString, data, headers, onComplete ) ) ;
	}
	
	private static IEnumerator SendGetRequestAsyncHelper( string requestString, HTTPRequestComplete onComplete )
	{
		WWW www = new WWW( requestString );
		yield return www;

		//Debug.Log("complete! " + requestString);
		HandleHTTPRequestCompletion( www, onComplete );
	}

    public static Dictionary<string, string> HashtableToDictionary(Hashtable table)
    {
        Dictionary<string, string> dic = new Dictionary<string, string>();
        foreach (string key in table.Keys)
        {
            dic.Add(key, table[key].ToString());
        }

        return dic;
    }

    private static IEnumerator SendPostRequestAsyncHelper( string requestString, byte[] data, Hashtable headers, HTTPRequestComplete onComplete )
	{						
		WWW www = new WWW( requestString, data, HashtableToDictionary(headers));
		yield return www;
		
		HandleHTTPRequestCompletion( www, onComplete );
	}
	
	private static void HandleHTTPRequestCompletion( WWW www, HTTPRequestComplete onComplete )
	{
		if( www.error != null )
		{
			#if UNITY_EDITOR
			Debug.Log( "[Network] Error: " + www.error );
			#endif
		}
		else
		{
			Debug.Log ("Complete register event!");
			if( onComplete != null )
			{
				onComplete( www.text );
			}
		}
	}
	
	private static MonoBehaviour DummyBehaviour
	{
		get
		{
			if( s_dummyBehaviour == null )
			{
				s_dummyObject = new GameObject();
				s_dummyBehaviour = (MonoBehaviour)(s_dummyObject.AddComponent< DummyObject >());
				s_dummyObject.name = "DummyObjectForNetworkingCoroutines";
			}
			
			return s_dummyBehaviour;
		}
	}
	
	private static GameObject s_dummyObject = null;
	private static MonoBehaviour s_dummyBehaviour = null;
	
}
