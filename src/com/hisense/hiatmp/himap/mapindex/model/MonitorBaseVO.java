/**
 * <p>Title: MonitorPointVO</p>
 * <p>Description:安装点基本VO类，只保存几个字段，用来在前台缓存</p>
 * <p>Copyright: Copyright (c) 2013</p>
 * <p>Company:青岛海信网络科技有限公司</p>
 * @author  <a href="mailto:liuxiaobing1@hisense.com">liuxiaobing</a>
 * @created 2013年03月28日
 */
package com.hisense.hiatmp.himap.mapindex.model;

public class MonitorBaseVO {
	private String pointid;
	private String deviceid;
	private String devicename;
	private String devicetype;
	private String showlevel;
	private String longitude;
	private String latitude;
	private String nstate;
	private String departmentid;
	private String ctrlflag;
	private String deviceids;
	private String subtype;
	
	
	public String getSubtype() {
		return subtype;
	}
	public void setSubtype(String subtype) {
		this.subtype = subtype;
	}
	public String getDeviceids() {
		return deviceids;
	}
	public void setDeviceids(String deviceids) {
		this.deviceids = deviceids;
	}
	public String getDepartmentid() {
		return departmentid;
	}
	public void setDepartmentid(String departmentid) {
		this.departmentid = departmentid;
	}
	public String getNstate() {
		return nstate;
	}
	public void setNstate(String nstate) {
		this.nstate = nstate;
	}
	public String getPointid() {
		return pointid;
	}
	public void setPointid(String pointid) {
		this.pointid = pointid;
	}
	public String getDeviceid() {
		return deviceid;
	}
	public void setDeviceid(String deviceid) {
		this.deviceid = deviceid;
	}
	public String getDevicename() {
		return devicename;
	}
	public void setDevicename(String devicename) {
		this.devicename = devicename;
	}
	public String getDevicetype() {
		return devicetype;
	}
	public void setDevicetype(String devicetype) {
		this.devicetype = devicetype;
	}
	public String getShowlevel() {
		return showlevel;
	}
	public void setShowlevel(String showlevel) {
		this.showlevel = showlevel;
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
	public String getCtrlflag() {
		return ctrlflag;
	}
	public void setCtrlflag(String ctrlflag) {
		this.ctrlflag = ctrlflag;
	}
	
	
}
