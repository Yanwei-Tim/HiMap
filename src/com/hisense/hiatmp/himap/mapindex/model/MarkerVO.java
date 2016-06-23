package com.hisense.hiatmp.himap.mapindex.model;

import java.util.List;
import java.util.Map;


public class MarkerVO { 
	private String id;
	private String title;
	private String imgurl;
	private int imgwidth = 24;
	private int imgheight = 24;
	private String longitude;
	private String latitude;
	private String coordinates;
	private String coordtype; //类型 0 点 1线 2面 3单方线的线 4双方向的线
    private String templateid;//弹窗模板编号
    private String[] openinfo; //弹窗内容
    private Map<String,String> markerinfo; //其他需要用到的数据
    /**
     * 其他list格式的数据
     */
    private Map<String,List> markermultinfo;
    
    
    
	public Map<String, List> getMarkermultinfo() {
		return markermultinfo;
	}
	public void setMarkermultinfo(Map<String, List> markermultinfo) {
		this.markermultinfo = markermultinfo;
	}
	public int getImgwidth() {
		return imgwidth;
	}
	public void setImgwidth(int imgwidth) {
		this.imgwidth = imgwidth;
	}
	public int getImgheight() {
		return imgheight;
	}
	public void setImgheight(int imgheight) {
		this.imgheight = imgheight;
	}
	public Map<String, String> getMarkerinfo() {
		return markerinfo;
	}
	public void setMarkerinfo(Map<String, String> markerinfo) {
		this.markerinfo = markerinfo;
	}
	public String[] getOpeninfo() {
		return openinfo;
	}
	public void setOpeninfo(String[] openinfo) {
		this.openinfo = openinfo;
	}
	public String getCoordinates() {
		return coordinates;
	}
	public void setCoordinates(String coordinates) {
		this.coordinates = coordinates;
	}
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
	public String getImgurl() {
		return imgurl;
	}
	public void setImgurl(String imgurl) {
		this.imgurl = imgurl;
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
	public String getCoordtype() {
		return coordtype;
	}
	public void setCoordtype(String coordtype) {
		this.coordtype = coordtype;
	}
	public String getTemplateid() {
		return templateid;
	}
	public void setTemplateid(String templateid) {
		this.templateid = templateid;
	}
    
    
}
