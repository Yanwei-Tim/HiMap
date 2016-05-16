package com.hisense.himap.roadnet.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import com.hisense.himap.common.util.GISUtils;
import com.hisense.himap.roadnet.astar.AStar;
import com.hisense.himap.roadnet.astar.ISearchNode;
import com.hisense.himap.roadnet.model.Arc;
import com.hisense.himap.roadnet.model.Node;

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
		List<ISearchNode> list = this.querySPList(startpoint,endpoint,inpoints,outpoints,querytype);
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
	 * @return 路径list
	 */
	public List<ISearchNode> querySPList(String startpoint,String endpoint,List<String> inpoints,List<String> outpoints,int querytype){
		
		List<ISearchNode> result = new ArrayList<ISearchNode>();
		Node snode = this.getNodeByPoint(startpoint);
		Node enode = this.getNodeByPoint(endpoint);
		
		Long start = new Date().getTime();
		
		List<Node> points = new ArrayList<Node>();
		points.add(snode);
		if(inpoints!=null && inpoints.size()>0){
			for(String point:inpoints){
				points.add(this.getNodeByPoint(point));
			}
		}
		points.add(enode);
		AStar astar = new AStar();
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
	
	public Node getNodeByPoint(String point){
		Node snode = this.getNodeByJoinPoint(point);
		if(snode.getNodeid()==null){
			MemRouteData.insertDynamicNode(snode);
		}
		return snode;
	}
	
}
