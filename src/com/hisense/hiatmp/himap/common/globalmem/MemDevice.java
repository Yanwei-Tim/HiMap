package com.hisense.hiatmp.himap.common.globalmem;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import com.hisense.hiatmp.himap.common.util.BeanUtils;
import com.hisense.hiatmp.himap.mapindex.model.MarkerVO;
import com.hisense.hiatmp.himap.mapindex.model.MonitorBaseVO;
import com.hisense.hiatmp.himap.mapindex.service.HiKdTree;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.index.kdtree.KdNode;

public class MemDevice {
	
	public static Map<String,MarkerVO> monitorMap;//缓存所有安装点
	public static Map<String,HiKdTree> monitorKDTrees;//所有安装点组成的KD-Tree
	public static Map<String,Record> equipMap; //
	public static Map<String,Map<String,List<Record>>> monitorequipMap; //
	
	public void initEquips(){
		String[] devicetypes = PropKit.get("DEVICETYPES").split(",");
		String typeconditions = "";
		for(String devicetype:devicetypes){
			typeconditions+="'"+devicetype+"',";
		}
		typeconditions = typeconditions.substring(0,typeconditions.length()-1);
		String sql = "select "+PropKit.get("EQUIPCOULMNS")+",enum2.enumname as providername,enum.enumname as statename from equipment_info i " +
				"left join (SELECT * FROM ENUM_TYPE WHERE ENUMTYPEID = 100) enum on enum.enumvalue = i.devicestate " +
				"left join (select * from enum_type where enumtypeid = 902) enum2 on enum2.enumvalue = i.provider " +
				"where i.pointid IS NOT NULL and i.devicetype in("+typeconditions+") and i.devicestate in('1','2','3','4','5')";
		System.out.println(sql);
		if(equipMap == null){
			equipMap = new HashMap<String,Record>();
		}
		if(monitorequipMap == null){
			monitorequipMap = new HashMap<String,Map<String,List<Record>>>();
		}
		List<Record> list = Db.find(sql);
		for(Record record:list){
			equipMap.put(record.getStr("deviceid"), record);
			if(monitorequipMap.get(record.getStr("pointid")) == null){
				Map<String,List<Record>> emap = new HashMap<String,List<Record>>();
				for(String dtype:devicetypes){
					emap.put(dtype, new ArrayList<Record>());
				}
				monitorequipMap.put(record.getStr("pointid"),emap);
			}
			Map<String,List<Record>> emap = monitorequipMap.get(record.getStr("pointid"));
			List<Record> elist = emap.get(record.getStr("devicetype"));
			if(elist == null){
				elist = new ArrayList<Record>();
				emap.put(record.getStr("devicetype"), elist);
			}
			for(Record e:elist){
				if(e.getStr("deviceid").equalsIgnoreCase(record.getStr("deviceid"))){
					elist.remove(e);
					break;
				}
			}
			elist.add(record);
		}
	}
	
	public void initMonitors() {
		try{
			System.out.println("缓存点位数据...");
			monitorKDTrees = new HashMap<String,HiKdTree>();
			String[] clulevels = PropKit.get("CLU_LEVELS").split(",");
			monitorKDTrees.put("0", new HiKdTree());
			for(String clulevel:clulevels){
				monitorKDTrees.put(clulevel, new HiKdTree(Double.parseDouble(clulevel))); 
			}
			monitorMap = new HashMap<String,MarkerVO>();
			
			String[] devicetypes = PropKit.get("DEVICETYPES").split(",");
			StringBuffer buff = new StringBuffer("");
			this.initEquips();
			//缓存安装点信息
			buff.delete(0, buff.toString().length());
	        buff.append(" SELECT p.pointcode,p.pointname,to_char(p.longitude) as longitude,to_char(p.latitude) as latitude,p.provider,p.departmentid")
	                .append(",p.dldm,p.lkdm,p.ddms from monitor_point p ")
	                .append(" WHERE p.longitude>100 AND p.longitude<180 ")
	                .append(" ORDER BY abs(p.longitude-(SELECT AVG(longitude) from monitor_point p WHERE p.longitude>100 AND p.longitude<180))");
	        List<Record> monitorList = Db.find(buff.toString());
			if (monitorList != null && monitorList.size() > 0) {
				for (int i = 0; i < monitorList.size(); i++) {
					Record record = monitorList.get(i);
					MarkerVO vo = new MarkerVO();
					vo.setId(record.getStr("pointcode"));
					vo.setTitle(record.getStr("pointname"));
					vo.setLongitude(record.getStr("longitude").toString());
					vo.setLatitude(record.getStr("latitude").toString());
					monitorMap.put(vo.getId(),vo);
					
					// 按照不同聚合级别生成安装点kdtree
					try{
						Double x = Double.parseDouble(vo.getLongitude());
						Double y = Double.parseDouble(vo.getLatitude());
						if(x>0 && y>0){
							Iterator iter = monitorKDTrees.keySet().iterator();
							while(iter.hasNext()){
								String key = iter.next().toString();
								HiKdTree tree = monitorKDTrees.get(key);
								MarkerVO tempvo = new MarkerVO();
								BeanUtils.copyProperties(vo,tempvo);
								Map<String,String> markerinfo = new HashMap<String,String>();
								tempvo.setMarkerinfo(markerinfo);
								KdNode node = tree.insert(new Coordinate(x,y),tempvo);
								if(i==0){tree.root = node;};
							}
						}
					}catch(Exception e){
						e.printStackTrace();
					}
				}
			}
			
			
			Iterator iter = monitorKDTrees.keySet().iterator();
			while(iter.hasNext()){
				String clulevel = iter.next().toString();
				for(KdNode node:monitorKDTrees.get(clulevel).reportSubTree()){
					MarkerVO monitor = (MarkerVO)node.getData();
					Map<String,Integer> equipcounts = new HashMap<String,Integer>();
					for(String dtype:devicetypes){
						equipcounts.put(dtype, 0); 
					}
					List<String> nodepoints = new ArrayList();
					if(monitor.getMarkermultinfo()!=null && monitor.getMarkermultinfo().get("points")!=null){
						nodepoints = monitor.getMarkermultinfo().get("points");
					}else{
						nodepoints.add(monitor.getId());
					}
					for(String point: nodepoints){
						Map<String,List<Record>> equipmap = monitorequipMap.get(point);
						if(equipmap == null) continue;
						Iterator equipiter = equipmap.keySet().iterator();
						while(equipiter.hasNext()){
							String dtype = equipiter.next().toString();
							
							if(equipcounts.get(dtype) == null){continue;}
							int counts = equipcounts.get(dtype);
							counts += equipmap.get(dtype).size();
							equipcounts.put(dtype, counts);
							
						}
					}
					
					for(String dtype:devicetypes){
						int nums = equipcounts.get(dtype);
						if(nums == 1){
							for(String point: nodepoints){
								Map<String,List<Record>> equipmap = monitorequipMap.get(point);
								if(equipmap!=null){
									List<Record> devices = equipmap.get(dtype);
									if(devices!=null && devices.size()>0){
										monitor.getMarkerinfo().put("device-"+dtype, devices.get(0).getStr("deviceid"));
										break;
									}
								}
								
								
							}
						}
						monitor.getMarkerinfo().put("num-"+dtype, Integer.toString(nums));
					}
				}
			}
			
	        System.out.println("缓存点位数据成功");	      

		}catch(Exception e){
			e.printStackTrace();
			System.out.println("缓存点位数据出错");
		}
		
		
	}
}
