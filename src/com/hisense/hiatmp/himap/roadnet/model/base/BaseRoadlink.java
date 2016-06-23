package com.hisense.hiatmp.himap.roadnet.model.base;

import com.jfinal.plugin.activerecord.Model;
import com.jfinal.plugin.activerecord.IBean;

/**
 * Generated by JFinal, do not modify this file.
 */
@SuppressWarnings("serial")
public abstract class BaseRoadlink<M extends BaseRoadlink<M>> extends Model<M> implements IBean {

	public void setRoadid(java.lang.String roadid) {
		set("ROADID", roadid);
	}

	public java.lang.String getRoadid() {
		return get("ROADID");
	}

	public void setLinkid(java.lang.String linkid) {
		set("LINKID", linkid);
	}

	public java.lang.String getLinkid() {
		return get("LINKID");
	}

	public void setStrcoords(java.lang.String strcoords) {
		set("STRCOORDS", strcoords);
	}

	public java.lang.String getStrcoords() {
		return get("STRCOORDS");
	}

	public void setGeometry(java.lang.String geometry) {
		set("GEOMETRY", geometry);
	}

	public java.lang.String getGeometry() {
		return get("GEOMETRY");
	}

	public void setCrosspoints(java.lang.String crosspoints) {
		set("CROSSPOINTS", crosspoints);
	}

	public java.lang.String getCrosspoints() {
		return get("CROSSPOINTS");
	}

	public void setFormatlevel(java.lang.String formatlevel) {
		set("FORMATLEVEL", formatlevel);
	}

	public java.lang.String getFormatlevel() {
		return get("FORMATLEVEL");
	}

	public void setLinkname(java.lang.String linkname) {
		set("LINKNAME", linkname);
	}

	public java.lang.String getLinkname() {
		return get("LINKNAME");
	}

	public void setDirection(java.lang.String direction) {
		set("DIRECTION", direction);
	}

	public java.lang.String getDirection() {
		return get("DIRECTION");
	}

	public void setViodldm(java.lang.String viodldm) {
		set("VIODLDM", viodldm);
	}

	public java.lang.String getViodldm() {
		return get("VIODLDM");
	}

}