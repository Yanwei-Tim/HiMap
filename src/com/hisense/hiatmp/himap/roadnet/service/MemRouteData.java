package com.hisense.hiatmp.himap.roadnet.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.hisense.hiatmp.himap.common.service.BaseService;
import com.hisense.hiatmp.himap.common.util.GISUtils;
import com.hisense.hiatmp.himap.roadnet.model.Arc;
import com.hisense.hiatmp.himap.roadnet.model.Forbiddenturn;
import com.hisense.hiatmp.himap.roadnet.model.Node;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

public class MemRouteData  extends BaseService {
	
	public static List<Node> NODELIST;
	public static Map<String,Node> NODEMAP;
	public static List<Arc> ARCLIST;
	public static Map<String,Arc> ARCMAP;
	public static Map<String,List<Arc>> ARCMAPBYSTARTNODE;
	public static Map<String,List<Forbiddenturn>> FTMAP;
	
	public static List<Node> DNODELIST = new ArrayList<Node>();
	public static List<Arc> DARCLIST = new ArrayList<Arc>();
	
	//初始化数据
	public static void initMemData(){
		
		//初始化节点
		System.out.println("初始化节点数据...");
		NODELIST = Node.dao.find("select * from route_node");
		NODEMAP = new HashMap<String,Node>();
		for(Node node:NODELIST){
			NODEMAP.put(node.getNodeid(), node);
		}
		
		//初始化弧段数据
		System.out.println("初始化弧段数据...");
		ARCLIST = Arc.dao.find("select * from route_arc");
		ARCMAP = new HashMap<String,Arc>();
		ARCMAPBYSTARTNODE = new HashMap<String,List<Arc>>();
		for(Arc arc:ARCLIST){
			ARCMAP.put(arc.getArcid(), arc);
			if(arc.getTrafficDir().equals("0") || arc.getTrafficDir().equals("2")){
				List<Arc> list = ARCMAPBYSTARTNODE.get(arc.getStartnode());
				if(list == null){
					list =  new ArrayList<Arc>();
				}
				list.add(arc);
				ARCMAPBYSTARTNODE.put(arc.getStartnode(), list);
			}
			if(arc.getTrafficDir().equals("1") || arc.getTrafficDir().equals("2")){
				List<Arc> list = ARCMAPBYSTARTNODE.get(arc.getEndnode());
				if(list == null){
					list =  new ArrayList<Arc>();
				}
				list.add(arc);
				ARCMAPBYSTARTNODE.put(arc.getEndnode(), list);
			}
		}
		
		//初始化转向限制数据
		System.out.println("初始化转向限制数据...");
		List<Forbiddenturn> ftlist = Forbiddenturn.dao.find("select * from route_forbiddenturn");
		FTMAP = new HashMap<String,List<Forbiddenturn>>();
		for(Forbiddenturn ft:ftlist){
			List<Forbiddenturn> list = FTMAP.get(ft.getCrossnode());
			if(list == null){
				list = new ArrayList<Forbiddenturn>();
			}
			list.add(ft);
			FTMAP.put(ft.getCrossnode(), list);
		}
		
		
		
		
		
		System.out.println("数据初始化完成");
	}
	
	/**
	 * 根据距离合并弧段数据，提高查询效率
	 * @param distance
	 */
	public static void mergedArcByDistance(int distance){
		Map<String,Arc> mergedArc = new HashMap<String,Arc>();
		Map<String,List<Arc>> mergedArcMapByStartNode = new HashMap<String,List<Arc>>();
		for(Arc arc:ARCLIST){
			
		}
	}
	
	/**
	 * 根据节点编号获取节点对象
	 * @param nodeid
	 * @return
	 */
	public static Node getNodeById(String nodeid){
		if(NODELIST == null){
			initMemData();
		}
		return NODEMAP.get(nodeid);
		/*Node node = Node.dao.findById(nodeid);
		return node;*/
	}
	
	/**
	 * 获取下一连接弧段
	 * @param nodeid 当前节点
	 * @param fromnodeid 上一节点
	 * @return
	 */
	public static List<Arc> getArcByStartNode(String nodeid,String fromnodeid){
		if(nodeid.equalsIgnoreCase(fromnodeid)){
			return null;
		}
		if(NODELIST == null){
			initMemData();
		}
		List<Arc> result = new ArrayList<Arc>();
		List<Arc> nextarcs = ARCMAPBYSTARTNODE.get(nodeid);
		List<Forbiddenturn> flist = FTMAP.get(nodeid);
		if(nextarcs == null){
			return result;
		}else if(fromnodeid != null && flist != null){
			for(Arc arc:nextarcs){
				String endnode = arc.getEndnode().equalsIgnoreCase(nodeid)?arc.getStartnode():arc.getEndnode();
				/*if(endnode.equalsIgnoreCase(fromnodeid)){
					continue;
				}*/
				Boolean isforbidden = false;
				for(Forbiddenturn fturn:flist){
					if(fturn.getFromnode().equalsIgnoreCase(fromnodeid) && fturn.getTonode().equals(endnode)){
						isforbidden = true;
						break;
					}
				}
				if(!isforbidden){
					result.add(arc);
				}
			}
		}else{
			for(Arc arc:nextarcs){
				/*String endnode = arc.getEndnode().equalsIgnoreCase(nodeid)?arc.getStartnode():arc.getEndnode();
				if(endnode.equalsIgnoreCase(fromnodeid)){
					continue;
				}*/
				result.add(arc);
			}
		}
		/*List<Arc> result2 = new ArrayList<Arc>();
		for(Arc arc:result){
			if(arc.getStartnode().equalsIgnoreCase(arc.getEndnode())){
				continue;
			}else{
				result2.add(arc);
			}
		}*/
		return result;
		
	}
	
	/**
	 * 向内存数据中插入动态节点
	 * @param node 动态节点
	 */
	public static String insertDynamicNode(Node node){
		if(node.getNodeid()==null){
			node.setNodeid(UUID.randomUUID().toString().replaceAll("-", ""));
		}
		if(NODELIST == null){
			initMemData();
		}
		
		StringBuffer buff = new StringBuffer("SELECT r.arcid,r.strcoords,r.traffic_dir,to_char(sdo_util.to_wktgeometry(SDO_LRS.CONVERT_TO_STD_GEOM(SDO_LRS.PROJECT_PT(SDO_LRS.CONVERT_TO_LRS_GEOM(r.geometry),")
								.append("mdsys.sdo_geometry(2001,8307,MDSYS.SDO_POINT_TYPE(")
								.append(node.getStrcoords()).append(" ,0),null,null))))) as projectpt")
								.append(" FROM route_arc r WHERE SDO_WITHIN_DISTANCE(r.geometry,mdsys.sdo_geometry(2001,8307,MDSYS.SDO_POINT_TYPE(")
								.append(node.getStrcoords()).append(" ,0),null,null),'distance=10 querytype=WINDOW') = 'TRUE'");
		List<Record> list = Db.find(buff.toString());
		if(list!=null){
			for(Record record:list){
				String wktgeometry = record.getStr("projectpt");
				wktgeometry = wktgeometry.substring(wktgeometry.indexOf("(")+1,wktgeometry.indexOf(")"));
				String longitude = wktgeometry.split(" ")[0];
				String latitude = wktgeometry.split(" ")[1];
				String pointstr = longitude+","+latitude;
				List<String> points = new ArrayList<String>();
				points.add(pointstr);
				String arcid = record.getStr("arcid");
				String strcoords = record.getStr("strcoords");
				String trafficDir = record.getStr("traffic_dir");
				Arc prearc = ARCMAP.get(arcid);
				List<String> splitarcstrs = GISUtils.splitLineByPoints(strcoords,points);
				for(String arcstr:splitarcstrs){
					if(arcstr.split(",").length<=2){
						break;
					}
					Arc arc = new Arc();
					arc.setArcid(UUID.randomUUID().toString().replaceAll("-", ""));
					arc.setStrcoords(arcstr);
					arc.setArclength(new BigDecimal(GISUtils.getRoadLength(arcstr)));
					arc.setTrafficDir(trafficDir);
					if(GISUtils.getStartNode(arcstr).equalsIgnoreCase(pointstr)){
						arc.setStartnode(node.getNodeid());
						arc.setEndnode(prearc.getEndnode());
					}else{
						arc.setStartnode(prearc.getStartnode());
						arc.setEndnode(node.getNodeid());
					}
					DARCLIST.add(arc);
					ARCLIST.add(arc);
					ARCMAP.put(arc.getArcid(), arc);
					
					if(arc.getTrafficDir().equals("0") || arc.getTrafficDir().equals("2")){
						List<Arc> templist = ARCMAPBYSTARTNODE.get(arc.getStartnode());
						if(templist == null){
							templist =  new ArrayList<Arc>();
						}
						templist.add(arc);
						ARCMAPBYSTARTNODE.put(arc.getStartnode(), templist);
					}
					if(arc.getTrafficDir().equals("1") || arc.getTrafficDir().equals("2")){
						List<Arc> templist = ARCMAPBYSTARTNODE.get(arc.getEndnode());
						if(templist == null){
							templist =  new ArrayList<Arc>();
						}
						templist.add(arc);
						ARCMAPBYSTARTNODE.put(arc.getEndnode(), templist);
					}
				}
				
			}
			DNODELIST.add(node);
			NODELIST.add(node);
			NODEMAP.put(node.getNodeid(), node);
			return "success";
		}else{
			return "false";
		}
		
	}
	
	
	public void removeDynamicNode(Node node){
		
	}
}
