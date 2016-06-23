package com.hisense.hiatmp.himap.mapquery.web;

import java.util.ArrayList;
import java.util.List;



import com.hisense.hiatmp.himap.common.web.BaseController;
import com.hisense.hiatmp.himap.mapquery.model.QueryVO;
import com.hisense.hiatmp.himap.mapquery.service.MapQueryService;
import com.jfinal.plugin.activerecord.Record;

public class MapQueryController extends BaseController {
	private MapQueryService service = new MapQueryService();
	
	/**
	 * 获取设备明细信息
	 */
	public void getEquipmentInfo(){
		String deviceid = getPara("deviceid");
		String pointid = getPara("pointid");
		String devicetype = getPara("devicetype");
		List<Record> list = new ArrayList<Record>();
		List<Record> recordList = new ArrayList<Record>();
		if(deviceid!=null && deviceid.length()>0){
			list = service.getEquipmentInfo(deviceid);
			for(Record record:list){
				if(record.getStr("deviceid").equalsIgnoreCase(deviceid)){
					setAttr("currRecord",record);
				}else{
					recordList.add(record);
				}
			}
		}else{
			list = service.getEquipmentInfo(pointid,devicetype);
			if(list!=null && list.size()>0){
				setAttr("currRecord",list.get(0));
				for(int i=1;i<list.size();i++){
					recordList.add(list.get(i));
				}
			}
		}
		
		setAttr("recordList",recordList);
		renderJson();
	}
	
	//路段空间查询
	public void queryRoad(){
		try{
			QueryVO query = new QueryVO();
			query.setQuerytype(getPara("querytype"));
			query.setStrCoords(getPara("strCoords"));
			query.setDistance(getPara("distance"));
			
			List list =  this.service.queryRoad(query);
			setAttr("result", true);
			setAttr("rows", list);
		}catch(Exception e){
			e.printStackTrace();
			setAttr("result", false);
		}finally{
			renderJson();
		}
		
	}

	
	/**
	 * 空间查询设备方法
	 * @return
	 */
	public void queryEquip(){
		try{
			QueryVO query = new QueryVO();
			query.setQuerytype(getPara("querytype"));
			query.setStrCoords(getPara("strCoords"));
			query.setDistance(getPara("distance"));
			query.setDevicetype(getPara("devicetype"));
			if(query.getQuerytype().equalsIgnoreCase("queryBySQL")){
				String sql = getPara("sql");
				//List list = this.service.queryBySQL(sql);
				setAttr("result", true);
				setAttr("rows", null);
			}else{
				List list =  this.service.queryEquip(query);
				setAttr("result", true);
				setAttr("rows", list);
			}
			
			
		}catch(Exception e){
			e.printStackTrace();
			setAttr("result", false);
		}finally{
			renderJson();
		}
	}
	
}
