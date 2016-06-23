package com.hisense.hiatmp.himap.roadnet.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.hisense.hiatmp.himap.common.service.BaseService;
import com.hisense.hiatmp.himap.common.util.GISUtils;
import com.hisense.hiatmp.himap.roadnet.model.Arc;
import com.hisense.hiatmp.himap.roadnet.model.Forbiddenturn;
import com.hisense.hiatmp.himap.roadnet.model.Joinpoint;
import com.hisense.hiatmp.himap.roadnet.model.Node;
import com.hisense.hiatmp.himap.roadnet.model.NodeRelations;
import com.hisense.hiatmp.himap.roadnet.model.Roadlink;
import com.jfinal.aop.Before;
import com.jfinal.kit.PropKit;
import com.jfinal.log.Log4jLog;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.LineString;
import com.vividsolutions.jts.geom.Point;
import com.vividsolutions.jts.operation.buffer.BufferOp;
import com.vividsolutions.jts.operation.buffer.BufferParameters;
import com.vividsolutions.jts.operation.linemerge.LineMerger;

public class BaseRnService extends BaseService {
	private static final Log4jLog log = Log4jLog.getLog(BaseRnService.class);
	
	private static Double BUFFERSIZE = 0d;
	private static Double MERGELENGTH = 0d;
	private static Double CROSSSIZE = 0d;
	
	
	/**
	 * 计算连接点所属节点
	 * @param joinpoint 连接点坐标
	 * @return 所属节点，无记录返回null
	 */
	public Node getNodeByJoinPoint(String joinpoint){
		if(CROSSSIZE<=0){
			CROSSSIZE = Double.parseDouble(PropKit.get("CROSSSIZE"));
		}
		try{
			Node node;
			String sql = "SELECT * from route_node r WHERE SDO_WITHIN_DISTANCE(r.geometry,mdsys.sdo_geometry(2001,8307, MDSYS.SDO_POINT_TYPE("+
							joinpoint+",0), null,  null),'distance="+CROSSSIZE+" querytype=WINDOW') = 'TRUE'";
			List<Node> list = Node.dao.find(sql);
			if(list!=null && list.size()>0){
				node = list.get(0);
				if(node.getJoinpoints().equals("")){
					node.setJoinpoints(joinpoint);
				}else{
					node.setJoinpoints(node.getJoinpoints()+","+joinpoint);
				}
				node.setStrcoords(GISUtils.genCentroid(node.getJoinpoints()));
			}else{
				node = new Node();
				node.setJoinpoints(joinpoint);
				node.setStrcoords(joinpoint);
			}
			return node;
		}catch(Exception e){
			e.printStackTrace();
			Node node = new Node();
			return node;
		}
	}
	
	public List<Record> getNextNodes(String nodeid){
		String sql = "SELECT n.nodeid,n.strcoords from route_node n WHERE" +
					" n.nodeid IN(SELECT a1.endnode from route_arc a1 WHERE a1.startnode=? AND a1.traffic_dir IN(0,2) )"+
					"OR n.nodeid IN(SELECT a2.startnode from route_arc a2 WHERE a2.endnode=? AND a2.traffic_dir IN(1,2))";
		List<Record> list = Db.find(sql,nodeid,nodeid);
		return list;
	}
	
	public List<Forbiddenturn> getForbiddenturn(String nodeid){
		String sql = "select r.ftid,r.crossnode,r.fromnode,r.tonode from route_forbiddenturn r WHERE r.crossnode=?";
		List<Forbiddenturn> ftlist = Forbiddenturn.dao.find(sql,nodeid);
		return ftlist;
	}
	
	/**
	 * 根据节点编号集合获取符合条件的节点列表
	 * @param nodeids 节点编号集合
	 * @return
	 */
	public List getNodeList(String[] nodeids){
		String condition = "in(";
		for(int i=0;i<nodeids.length;i++){
			condition+="'"+nodeids[i]+"',";
		}
		condition = condition.substring(0,condition.length()-1)+")";
		String sql = "select r.nodeid,r.strcoords from route_node r where r.nodeid "+condition;
		//System.out.println(sql);
		List list = Db.find(sql);
		return list;
	}
	
	/**
	 * 获取节点上的连接点
	 * @param node
	 * @return
	 */
	public List getJpInNode(Node node){
		if(node == null || node.getJoinpoints() == null){
			return new ArrayList();
		}
		String[] points = node.getJoinpoints() == null?null:node.getJoinpoints().split(",");
		
		String condition = "in(";
		for(int i=0;i<points.length/2;i++){
			condition+="'"+points[i*2]+","+points[i*2+1]+"',";
		}
		condition = condition.substring(0,condition.length()-1)+")";
		String sql = "select r.pointid,r.strcoords,r.cross_arcs from route_joinpoint r where r.strcoords "+condition;
		//System.out.println(sql);
		List list = Db.find(sql);
		return list;
	}
	
	/**
	 * 获取节点周边的连接点
	 * @param node 节点
	 * @param distance 距离
	 * @return
	 */
	public List getJpNearNode(Node node,Double distance){
		String sql = "select r.pointid,r.strcoords,r.cross_arcs from route_joinpoint r where SDO_WITHIN_DISTANCE(r.geometry,mdsys.sdo_geometry(2001,8307,mdsys.sdo_point_type("+node.getStrcoords()+",0),NULL,NULL),'distance="+distance+" querytype=window')='TRUE'";
		List list = Db.find(sql);
		return list;
	}
	
	public List getRouteArc(String strcoords){
		List<Record> result = null;
		StringBuffer buff = new StringBuffer("");
		String geomstr = GISUtils.genGeomStr(strcoords, "point");
		buff.append("select a.arcid,a.strcoords,a.traffic_dir from route_arc a where SDO_WITHIN_DISTANCE(a.geometry,"+geomstr+",'distance=10 querytype=WINDOW') = 'TRUE' order by SDO_GEOM.sdo_distance(a.geometry,"+geomstr+",1)");
		//System.out.println(buff.toString());
		result = Db.find(buff.toString());
		return result;
	}
	
	public Record getJpByStrcoords(String strcoords){
		List<Record> result = null;
		StringBuffer buff = new StringBuffer("");
		String geomstr = GISUtils.genGeomStr(strcoords, "point");
		buff.append("select * from route_joinpoint r where SDO_WITHIN_DISTANCE(r.geometry,"+geomstr+",'distance=0.01 querytype=WINDOW') = 'TRUE' order by SDO_GEOM.sdo_distance(r.geometry,"+geomstr+",1)");
		result = Db.find(buff.toString());
		if(result.size()>0){
			return result.get(0);
		}else{
			return new Record();
		}
	}
	
	/**
	 * 线性弧段表达式转换为坐标
	 * @param lrsarcs 线性弧段表达式,格式：arcid,startmile,endmile;arcid,startmile,endmile;.....
	 * @return 坐标字符串
	 */
	public String convertLRSArcsToStrcoords(String lrsarcs){
		String[] arcs = lrsarcs.split(";");
		String strcoords = "";
		for(String lrsarc:arcs){
			String[] arc = lrsarc.split(",");
			String arcid = arc[0];
			String startmile;
			String endmile;
			String strcoord = "";
			if(arc.length==3){
				startmile = arc[1];
				endmile = arc[2];
				String sql = "SELECT sdo_util.to_wktgeometry(SDO_LRS.CONVERT_TO_STD_GEOM(SDO_LRS.clip_geom_segment( SDO_LRS.CONVERT_TO_LRS_GEOM(a.GEOMETRY), "
							+startmile+","+endmile+"))) as segm FROM  route_arc a WHERE a.arcid = ?";
				List<Record> list = Db.find(sql,arcid);
				if(list!=null && list.size()>0){
					String wktgeom = list.get(0).getStr("segm");
					wktgeom = wktgeom.substring(wktgeom.indexOf("(")+1,wktgeom.indexOf(")"));
					strcoord = wktgeom.replaceAll(" ", ",");
				}
			}else{
				String sql = "select a.strcoords from route_arc a where a.arcid=?";
				List<Arc> arcList = Arc.dao.find(sql,arcid);
				if(arcList.size()>0){
					strcoord = arcList.get(0).getStrcoords();
				}
			}
			strcoords+=strcoord+",";
		}
		strcoords = strcoords.substring(0,strcoords.length()-1);
			
		return "";
	}
	
	/**
	 * 获取行政区划枚举值
	 * @return
	 */
	public List getXZQH(){
		String sql = "SELECT e.enumvalue,e.enumname from enum_type e WHERE e.enumtypeid=180 order by e.enumvalue";
		return Db.find(sql);
	}
	
}
