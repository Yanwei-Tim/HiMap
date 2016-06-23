package com.hisense.hiatmp.himap.mapquery.model;

public class QueryVO {
	/**
	 * ********设备查询*********</br>
	 * queryByPoint	点周边查询</br>
	 * queryByLine	线周边查询</br>
	 * queryByRect	矩形内部查询</br>
	 * queryByPolygon	多边形内部查询</br>
	 * queryByCircle	圆形内部查询</br>
	 * ********路段查询*********</br>
	 * querylineByPoint 查询点周边的路段 </br>
	 * querylineByLine	查询线周边的路段 </br>
	 * querylineByRect	查询矩形内的路段 </br>
	 * querylineByPolygon	查询多边形内的路段</br>
	 * querylineByCircle	查询圆内的路段</br>
	 */
	private String querytype;
	private String strCoords;
	private String distance;
	private String devicetype;
	
	
	public String getQuerytype() {
		return querytype;
	}
	public void setQuerytype(String querytype) {
		this.querytype = querytype;
	}
	public String getStrCoords() {
		return strCoords;
	}
	public void setStrCoords(String strCoords) {
		this.strCoords = strCoords;
	}
	public String getDistance() {
		return distance;
	}
	public void setDistance(String distance) {
		this.distance = distance;
	}
	public String getDevicetype() {
		return devicetype;
	}
	public void setDevicetype(String devicetype) {
		this.devicetype = devicetype;
	}
	
	
}
