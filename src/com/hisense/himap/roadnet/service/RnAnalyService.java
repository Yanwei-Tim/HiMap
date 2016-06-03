package com.hisense.himap.roadnet.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Vector;
import java.util.concurrent.CountDownLatch;

import com.hisense.himap.roadnet.astar.AStar;
import com.hisense.himap.roadnet.astar.ISearchNode;
import com.hisense.himap.roadnet.model.Node;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

public class RnAnalyService extends BaseRnService {
	
	/**
	 * 最短路径查询
	 * @param startpoint 起点
	 * @param endpoint 终点
	 * @param inpoints 必经点
	 * @param outpoints 绕过点(TODO,暂不支持)
	 * @param querytype 查询类型 0：最短路径 1:最少耗时(TODO,目前支持最短路径)
	 * @return 路径字符串
	 */
	public String queryShortestPath(String startpoint,String endpoint,List<String> inpoints,List<String> outpoints,int querytype){
		String result = "";
		List<ISearchNode> list = this.querySPList(startpoint,endpoint,inpoints,outpoints,querytype,-1);
		if(list != null && list.size()>0){
			for(int i=1;i<list.size();i++){
				RouteSearchNode searchnode = (RouteSearchNode)list.get(i);
				result+=searchnode.getStrcoords()+",";
			}
			result = result.substring(0,result.length()-1);
		}
		return result;
	}
	
	/**
	 * 最短路径查询
	 * @param startpoint 起点
	 * @param endpoint 终点
	 * @param inpoints 必经点
	 * @param outpoints 绕过点(TODO,暂不支持)
	 * @param querytype 查询类型 0：最短路径 1:最少耗时(TODO,目前支持最短路径)
	 * @paramsmaxSteps 最大搜索步数
	 * @return 路径list
	 */
	public List<ISearchNode> querySPList(String startpoint,String endpoint,List<String> inpoints,List<String> outpoints,int querytype,int maxSteps){
		
		List<ISearchNode> result = new ArrayList<ISearchNode>();
		Node snode = this.getNodeByPoint(startpoint);
		Node enode = this.getNodeByPoint(endpoint);
		if(snode == null || enode == null){
			return null;
		}
		Long start = new Date().getTime();
		
		List<Node> points = new ArrayList<Node>();
		points.add(snode);
		if(inpoints!=null && inpoints.size()>0){
			for(String point:inpoints){
				Node  node = this.getNodeByPoint(point);
				if(node!=null){
					points.add(node);
				}
			}
		}
		points.add(enode);
		AStar astar = new AStar();
		astar.setMaxSteps(maxSteps);
		for(int i=0;i<points.size()/2;i++){
			Node stepsnode = points.get(i*2);
			Node stepenode = points.get(i*2+1);
			RouteGoalNode goalNode = new RouteGoalNode(Double.parseDouble(stepenode.getStrcoords().split(",")[0]), Double.parseDouble(stepenode.getStrcoords().split(",")[1]));
			RouteSearchNode initNode = new RouteSearchNode(stepsnode,null,null,goalNode);
			ArrayList<ISearchNode> path = astar.shortestPath(initNode, goalNode);
			if(path!=null){
				result.addAll(path);
			}else{
				return null;
			}
		}
		Long end = new Date().getTime();
		System.out.println("cost: "+(end-start)+" ms");
		//System.out.println(result.size()+"--"+astar.bestNodeAfterSearch().toString());
		return result;
	}
	
	/**
	 * 沿路的设备搜索接口
	 * @param pos 当前位置坐标
	 * @param devicetype 设备类型，多种用逗号分隔
	 * @param distance 搜索距离
	 * @param sectionid 路段编号 (TODO)
	 * @return 设备集合
	 */
	public List queryPointsInRoad(String pos,String devicetype,String distance,String sectionid){
		List result = new Vector();
		Node startnode = this.getNodeByPoint(pos);
		//计算直线距离结果
		String sql = "SELECT mp.pointcode,to_char(mp.longitude) as longitude,to_char(mp.latitude)as latitude FROM monitor_point mp " +
				" WHERE mp.pointcode IN(SELECT pointcode from monitor_point_geometry g where " +
				"SDO_WITHIN_DISTANCE(g.geometry,mdsys.sdo_geometry(2001,8307,MDSYS.SDO_POINT_TYPE("+pos+",  0),null,  null),'distance="+distance+" querytype=WINDOW') = 'TRUE')";
		if(devicetype!=null){
			String[] dtarr = devicetype.split(",");
			String typecondition = "";
			for(String dt:dtarr){
				typecondition+="'"+dt+"',";
			}
			typecondition = typecondition.substring(0,typecondition.length()-1);
			sql +=" and i.devicetype in("+typecondition+")";
		}
		List<Record> devices = Db.find(sql);
		System.out.println("原始点个数："+devices.size());
		
		//循环直线距离结果，生成动态节点
		Double dmaxSteps = Double.parseDouble(distance)/10;
		int maxSteps = dmaxSteps.intValue();
		maxSteps = maxSteps>0?maxSteps:1;
		
		int num = 0;
		for(Record record:devices){
			System.out.println("计算第"+(num++)+"个点位:");
			String longitude = record.getStr("longitude");
			String latitude = record.getStr("latitude");
			
			List list = this.querySPList(startnode.getStrcoords(), longitude+","+latitude, null, null, 0,maxSteps);
			Double currdistance = 0d;
			Boolean isadd = true;
			if(list != null && list.size()>0){
				for(int i=1;i<list.size();i++){
					RouteSearchNode searchnode = (RouteSearchNode)list.get(i);
					currdistance+=searchnode.getArc().getArclength().doubleValue();
					if(currdistance>=Double.parseDouble(distance)){
						isadd = false;
						break;
					}
				}
			}else{
				isadd = false;
			}
			if(isadd){
				System.out.println(" matches");
				result.add(record);
			}
		}
		
		
		/*MemRouteData.initMemData();
		CountDownLatch countDownLatch = new CountDownLatch(devices.size());
		for(Record record:devices){
			Thread thread = new Thread(new SPThread(startnode, distance,maxSteps,record,result));
			thread.start();
		}
		try { 
			// 主线程等待所有子线程执行完成，再向下执行 
			countDownLatch.await(); 
		} catch (InterruptedException e) { 
			e.printStackTrace(); 
		}*/
		System.out.println("结果数量："+result.size());
		
		return result;
	}
	
	
	public Node getNodeByPoint(String point){
		Node snode = this.getNodeByJoinPoint(point);
		if(snode.getNodeid()==null){
			String result = MemRouteData.insertDynamicNode(snode);
			if(result.equalsIgnoreCase("false")){
				return null;
			}
		}
		return snode;
	}
	
}
