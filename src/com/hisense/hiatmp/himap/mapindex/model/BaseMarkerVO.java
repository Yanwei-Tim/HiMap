package com.hisense.hiatmp.himap.mapindex.model;

import java.util.List;
import java.util.Map;


public class BaseMarkerVO { 
	private String id;
	private String title;
	private String longitude;
	private String latitude;
    private Map<String,String> markerinfo; //其他需要用到的数据
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getTitle() {
		return title;
	}
	public void setTitle(String title) {
		this.title = title;
	}
	public String getLongitude() {
		return longitude;
	}
	public void setLongitude(String longitude) {
		this.longitude = longitude;
	}
	public String getLatitude() {
		return latitude;
	}
	public void setLatitude(String latitude) {
		this.latitude = latitude;
	}
	public Map<String, String> getMarkerinfo() {
		return markerinfo;
	}
	public void setMarkerinfo(Map<String, String> markerinfo) {
		this.markerinfo = markerinfo;
	}
 
}
