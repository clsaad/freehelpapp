// Copyright (c) 2014 Cranium Software

using UnityEngine;
using System.Collections;

public class SmartAnalyticsEvent : MonoBehaviour
{
	public string Action = null;
	public string Label = null;
	public string Value = null;
	public string Category = null;
	public string TrackingID = null;

	/// <summary>
	/// Report the event
	/// </summary>
	public void Report()
	{
		if( !string.IsNullOrEmpty( TrackingID ) )
		{
			SmartAnalytics.SetTrackingID( TrackingID );
		}

		if( !string.IsNullOrEmpty( Category ) && !string.IsNullOrEmpty( Label ) )
		{
			SmartAnalytics.SendEvent( Label, Value, Action, Category );
		}
		else if( !string.IsNullOrEmpty( Label ) )
		{
			SmartAnalytics.SendEvent( Label, Value, Action );
		}
		else
		{
			SmartAnalytics.SendEvent( Action, Value );
		}

	}
}
