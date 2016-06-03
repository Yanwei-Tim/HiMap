package com.hisense.himap.mapquery.service;

import java.util.List;

import com.hisense.himap.common.service.BaseService;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

public class MapQueryService extends BaseService {
	
	/**
	 * 获取设备详情
	 * @param paramcodes
	 * @return
	 */
	public List<Record> getEquipmentInfo(String deviceid) {
		try {
        	String sql = "SELECT i.*,p.pointname,p.longitude,p.latitude from equipment_info i LEFT JOIN monitor_point p ON p.pointcode=i.pointid WHERE i.pointid IN (SELECT pointid from equipment_info WHERE deviceid=? ) AND i.devicetype IN (SELECT devicetype from equipment_info WHERE deviceid=?) ";
        	return Db.find(sql,deviceid,deviceid);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
	}

}
