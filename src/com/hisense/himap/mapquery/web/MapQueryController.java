package com.hisense.himap.mapquery.web;

import java.util.ArrayList;
import java.util.List;

import com.hisense.himap.common.web.BaseController;
import com.hisense.himap.mapquery.service.MapQueryService;
import com.jfinal.plugin.activerecord.Record;

public class MapQueryController extends BaseController {
	private MapQueryService service = new MapQueryService();
	
	/**
	 * 获取设备明细信息
	 */
	public void getEquipmentInfo(){
		String deviceid = getPara("deviceid");
		List<Record> list = service.getEquipmentInfo(deviceid);
		List<Record> recordList = new ArrayList<Record>();
		for(Record record:list){
			if(record.getStr("deviceid").equalsIgnoreCase(deviceid)){
				setAttr("currRecord",record);
			}else{
				recordList.add(record);
			}
		}
		setAttr("recordList",recordList);
		renderJson();
	}
	
}
