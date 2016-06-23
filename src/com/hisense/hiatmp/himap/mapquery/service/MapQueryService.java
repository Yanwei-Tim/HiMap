package com.hisense.hiatmp.himap.mapquery.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hisense.hiatmp.himap.common.globalmem.MemDevice;
import com.hisense.hiatmp.himap.common.service.BaseService;
import com.hisense.hiatmp.himap.mapindex.model.MarkerVO;
import com.hisense.hiatmp.himap.mapquery.dao.MapQueryDAO;
import com.hisense.hiatmp.himap.mapquery.model.QueryVO;
import com.jfinal.plugin.activerecord.Record;

public class MapQueryService extends BaseService {
	
	private MapQueryDAO himapDAO = new MapQueryDAO();
	
	/**
	 * 获取设备详情
	 * @param paramcodes
	 * @return
	 */
	public List<Record> getEquipmentInfo(String deviceid) {
		try {
			Record record = MemDevice.equipMap.get(deviceid);
			String pointid = record.getStr("pointid");
			String devicetype = record.getStr("devicetype");
			return this.getEquipmentInfo(pointid,devicetype);
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
	}
	
	/**
	 * 获取安装点上的设备列表
	 * @param pointid
	 * @param devicetype
	 * @return
	 */
	public List<Record> getEquipmentInfo(String pointid,String devicetype) {
		try {
			Map<String,List<Record>> map = MemDevice.monitorequipMap.get(pointid);
			if(map == null || map.size()<=0){
				return null;
			}
			List<Record> list = map.get(devicetype);
			MarkerVO monitor = MemDevice.monitorMap.get(pointid);
			for(Record e:list){
				if(devicetype.equalsIgnoreCase("10") && e.get("vmstype").equals("7")){//条形屏区分横屏竖屏 硬编码
					if(e.getStr("devicename").indexOf("竖屏")>=0){
						e.set("vmssubtype", 2);
					}else{
						e.set("vmssubtype", 1);
					}
				}
				//TODO 依赖common服务-设置authflg字段
				e.set("pointname", monitor.getTitle());
				e.set("longitude", monitor.getLongitude());
				e.set("latitude", monitor.getLatitude());
			}
			return list;

        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
	}
	
	
	/**
	 * 路段空间查询
	 * @param query
	 * @return
	 * @throws Exception
	 */
	public List<MarkerVO> queryRoad(QueryVO query) throws Exception {
		
		List<MarkerVO> result  = new ArrayList<MarkerVO>();
		//符合条件的路段
		List<Record> list = this.himapDAO.queryRoad(query);
		if(list==null || list.size()<0){
			return null;
		}
		for(Record record:list){
			MarkerVO bean  = new MarkerVO();
			bean.setId(record.getStr("sectionid"));
			bean.setTitle(record.getStr("sectionname")==null?"":record.getStr("sectionname"));
			bean.setCoordinates(record.getStr("positions")==null?"":record.getStr("positions"));
			bean.setCoordtype("2");
			bean.setTemplateid("2");
			
			//其他信息
			
			Map<String,String> markerinfo = new HashMap<String,String>();
			markerinfo.put("zoomlevel", record.getStr("zoomlevel")==null?"":record.getStr("zoomlevel"));
			markerinfo.put("volume", record.getStr("volume")==null?"":record.getStr("volume"));
			markerinfo.put("averagespeed", record.getStr("averagespeed")==null?"":record.getStr("averagespeed"));
			markerinfo.put("traveltime", record.getStr("traveltime")==null?"":record.getStr("traveltime"));
			markerinfo.put("receivetime", record.getStr("receivetime")==null?"":record.getStr("receivetime"));
			markerinfo.put("status", record.getStr("status")==null?"":record.getStr("status"));
			markerinfo.put("sectionlevel", record.getStr("sectionlevel")==null?"":record.getStr("sectionlevel"));
			List<Record> videolist = this.himapDAO.querySectionDevice(record.getStr("sectionid"),null);
			if(videolist!=null && videolist.size()>0){
				for(int i=0;i<videolist.size();i++){
					Record videomap =  videolist.get(i);
					markerinfo.put("videoid"+(i+1),videomap.getStr("deviceid")==null?"":videomap.getStr("deviceid"));
					markerinfo.put("videoname"+(i+1),videomap.getStr("devicename")==null?"":videomap.getStr("devicename"));
				}
			}
			bean.setMarkerinfo(markerinfo);
			
			result.add(bean);

		}

		return result;
		
	}

	
	public List queryEquip(QueryVO query) throws Exception {
		List list = this.himapDAO.queryEquip(query);
		if(list==null || list.size()<=0){
			return null;
		}
		
		return list;
	}
	
}
