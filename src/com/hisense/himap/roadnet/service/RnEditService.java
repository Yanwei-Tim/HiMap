package com.hisense.himap.roadnet.service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.hisense.himap.common.service.BaseService;
import com.hisense.himap.common.util.GISUtils;
import com.hisense.himap.roadnet.model.Arc;
import com.hisense.himap.roadnet.model.Joinpoint;
import com.hisense.himap.roadnet.model.Node;
import com.hisense.himap.roadnet.model.NodeRelations;
import com.hisense.himap.roadnet.model.Roadlink;
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

public class RnEditService extends BaseRnService {
	private static final Log4jLog log = Log4jLog.getLog(RnEditService.class);
	
	private static Double BUFFERSIZE = 0d;
	private static Double MERGELENGTH = 0d;
	private static Double CROSSSIZE = 0d;
	
	public String insertRoadLinkFromGD(List<Roadlink> list){
		for(Roadlink link:list){
			String sql = "insert into route_roadlink(roadid,linkid,strcoords,geometry,formatlevel,direction,viodldm) values ('";
			sql+=link.getRoadid()+"','"+link.getLinkid()+"','"+link.getStrcoords()+"',MDSYS.SDO_GEOMETRY(2002,8307,null,MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),MDSYS.SDO_ORDINATE_ARRAY("+link.getStrcoords()+")),0,0,'"+link.getViodldm()+"');";
			log.info(sql);
		}
		return "success";
	}
	
	/**
	 * 向路网中添加一条线
	 * @param a 线对象
	 * @return success/failure
	 */
	public String insertRoadLink(Roadlink a){
		if(BUFFERSIZE<=0){
			BUFFERSIZE = Double.parseDouble(PropKit.get("BUFFERSIZE"));
		}
		if(MERGELENGTH<=0){
			MERGELENGTH = Double.parseDouble(PropKit.get("MERGELENGTH"));
		}
		if(CROSSSIZE<=0){
			CROSSSIZE = Double.parseDouble(PropKit.get("CROSSSIZE"));
		}
		try {
			a.setStrcoords(a.getStrcoords().replaceAll(" ", ""));
			StringBuffer buff = new StringBuffer("");
			buff.append("select r.arcid from route_arc r where to_char(r.strcoords)='").append(a.getStrcoords()).append("'");
			List list = Db.find(buff.toString());
			if(list != null && list.size()>0){
				return "已存在相同弧段";
			}
			
			//自动断链,生成弧段列表
			List<Arc> arclist = genArcsByLink(a);
			System.out.println("size:"+arclist.size());
			
			//循环弧段列表，生成弧段、节点等数据
			List<Record> L;
			for(Arc arc:arclist){
				Double alen = GISUtils.getRoadLength(arc.getStrcoords());
				if(alen<MERGELENGTH){
					continue;
				}
				buff.delete(0, buff.toString().length());
				buff.append("select r.arcid from route_arc r where to_char(r.strcoords)='").append(arc.getStrcoords()).append("'");
				list = Db.find(buff.toString());
				if(list != null && list.size()>0){
					continue;
				}
				//连接点
				String startpoint = GISUtils.getStartNode(arc.getStrcoords());
				String endpoint = GISUtils.getEndNode(arc.getStrcoords());
				
				buff.delete(0, buff.toString().length());
				buff.append("select r.pointid,r.strcoords,r.cross_arcs from route_joinpoint r WHERE SDO_WITHIN_DISTANCE(r.geometry,mdsys.sdo_geometry(2001,8307,MDSYS.SDO_POINT_TYPE(")
						.append(startpoint).append(",0),null,null),'distance=0.001 querytype=WINDOW') = 'TRUE'");
				L = Db.find(buff.toString());
				if(L == null || L.size()<=0){
					buff.delete(0, buff.toString().length());
					buff.append("insert into route_joinpoint p(pointid,strcoords,cross_arcs,geometry) values('")
						.append(UUID.randomUUID().toString().replaceAll("-", "")).append("','")
						.append(startpoint).append("','")
						.append(arc.getArcid()).append("',MDSYS.SDO_GEOMETRY(2001,8307,SDO_POINT_TYPE(").append(startpoint).append(",null),NULL,NULL)")
						.append(")");
					Db.update(buff.toString());
				}else{
					Record record = L.get(0);
					String crossarcs = record.get("cross_arcs")+","+arc.getArcid();
					buff.delete(0, buff.toString().length());
					buff.append("update route_joinpoint j set j.cross_arcs='").append(crossarcs).
						append("' where j.pointid='").append(record.getStr("pointid")).append("'");
					Db.update(buff.toString());
				}
				
				buff.delete(0, buff.toString().length());
				buff.append("select r.pointid,r.strcoords,r.cross_arcs from route_joinpoint r WHERE SDO_WITHIN_DISTANCE(r.geometry,mdsys.sdo_geometry(2001,8307,MDSYS.SDO_POINT_TYPE(")
					.append(endpoint).append(",0),null,null),'distance=0.001 querytype=WINDOW') = 'TRUE'");
				L = Db.find(buff.toString());
				if(L == null || L.size()<=0){
					buff.delete(0, buff.toString().length());
					buff.append("insert into route_joinpoint (pointid,strcoords,cross_arcs,geometry) values('")
						.append(UUID.randomUUID().toString().replaceAll("-", "")).append("','")
						.append(endpoint).append("','")
						.append(arc.getArcid()).append("',MDSYS.SDO_GEOMETRY(2001,8307,SDO_POINT_TYPE(").append(endpoint).append(",null),NULL,NULL)")
						.append(")");
					Db.update(buff.toString());
				}else{
					Record record = L.get(0);
					String crossarcs = record.get("cross_arcs")+","+arc.getArcid();
					buff.delete(0, buff.toString().length());
					buff.append("update route_joinpoint j set j.cross_arcs='").append(crossarcs).
						append("' where j.pointid='").append(record.getStr("pointid")).append("'");;
					Db.update(buff.toString());
				}
				
				//节点
				Node startnode = this.getNodeByJoinPoint(startpoint);
				if(startnode.getNodeid() == null || startnode.getNodeid().equals("")){
					startnode.setNodeid(UUID.randomUUID().toString().replaceAll("-", ""));
					startnode.setStrcoords(startpoint);
					//添加开始节点
					buff.delete(0, buff.toString().length());
					buff.append("insert into route_node (nodeid,strcoords,joinpoints,geometry) values('")
						.append(startnode.getNodeid()).append("','")
						.append(startnode.getStrcoords()).append("','")
						.append(startnode.getJoinpoints()).append("',MDSYS.SDO_GEOMETRY(2001,8307,SDO_POINT_TYPE(").append(startpoint).append(",null),NULL,NULL)")
						.append(")");
					Db.update(buff.toString());
				}else{
					//更新开始节点的坐标、连接点
					buff.delete(0, buff.toString().length());
					buff.append("update route_node r set r.strcoords='")
						.append(startnode.getStrcoords())
						.append("',r.joinpoints='").append(startnode.getJoinpoints())
						.append("',r.geometry=").append("MDSYS.SDO_GEOMETRY(2001,8307,SDO_POINT_TYPE(").append(startnode.getStrcoords()).append(",null),NULL,NULL)")
						.append(" where r.nodeid='").append(startnode.getNodeid()).append("'");
					Db.update(buff.toString());
				}
				
				Node endnode = this.getNodeByJoinPoint(endpoint);
				if(endnode.getNodeid() == null || endnode.getNodeid().equals("")){
					//添加结束节点
					endnode.setNodeid(UUID.randomUUID().toString().replaceAll("-", ""));
					endnode.setStrcoords(endpoint);
					buff.delete(0, buff.toString().length());
					buff.append("insert into route_node (nodeid,strcoords,joinpoints,geometry) values('")
						.append(endnode.getNodeid()).append("','")
						.append(endnode.getStrcoords()).append("','")
						.append(endnode.getJoinpoints()).append("',MDSYS.SDO_GEOMETRY(2001,8307,SDO_POINT_TYPE(").append(endpoint).append(",null),NULL,NULL)")
						.append(")");
					Db.update(buff.toString());
				}else{
					//更新结束节点的坐标、连接点
					buff.delete(0, buff.toString().length());
					buff.append("update route_node r set r.strcoords='")
						.append(endnode.getStrcoords())
						.append("',r.joinpoints='").append(endnode.getJoinpoints())
						.append("',r.geometry=").append("MDSYS.SDO_GEOMETRY(2001,8307,SDO_POINT_TYPE(").append(endnode.getStrcoords()).append(",null),NULL,NULL)")
						.append(" where r.nodeid='").append(endnode.getNodeid()).append("'");
					Db.update(buff.toString());
				}
				
				arc.setStartnode(startnode.getNodeid());
				arc.setEndnode(endnode.getNodeid());
				if(arc.getStartnode().equalsIgnoreCase(arc.getEndnode())){
					arc.setArctype("1");
				}else{
					arc.setArctype("0");
				}
				//save arc
				buff.delete(0, buff.toString().length());
				buff.append("insert into route_arc(arcid,arclength,startnode,endnode,strcoords,roadcode,arctype,traffic_dir,geometry) values('")
					.append(arc.getArcid()).append("',").append(arc.getArclength()).append(",'").append(arc.getStartnode()).append("','")
					.append(arc.getEndnode()).append("','").append(arc.getStrcoords()).append("','").append(arc.getRoadcode()).append("','")
					.append(arc.getArctype()).append("','").append(arc.getTrafficDir()).append("',")
					.append("MDSYS.SDO_GEOMETRY(2002,8307,null,MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),MDSYS.SDO_ORDINATE_ARRAY(").append(arc.getStrcoords())
					.append(")))");
				//System.out.println(buff.toString());
				Db.update(buff.toString());
				
				//连通关系
				this.genNodeRelation(arc.getStartnode());
				this.genNodeRelation(arc.getEndnode());
				
			}
			
			return "success";
		 } catch (Exception e) {
            e.printStackTrace();
            return e.toString();
	     }
	}
	
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
							joinpoint+",0), null,  null),'distance="+CROSSSIZE+" querytype=WINDOW') = 'TRUE' order by SDO_GEOM.sdo_distance("
							+"r.geometry,mdsys.sdo_geometry(2001,8307, MDSYS.SDO_POINT_TYPE("+joinpoint+",0), null,  null),1)";
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
	
	/**
	 * 获取节点连通关系
	 * @param node
	 * @return
	 */
	public NodeRelations getNodeRelations(Node node){
		NodeRelations relation = NodeRelations.dao.findById(node.getNodeid());
		return relation;
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
	
	public String insertJptoNode(String nodeid,String pointid){
		Node node = this.getNodeByJoinPoint(Joinpoint.dao.findById(pointid).getStrcoords());
		if(node.getNodeid()!=null){
			this.rmJpfromNode(node.getNodeid(), pointid);
		}
		StringBuffer buff = new StringBuffer("");
		//插入节点表
		node = Node.dao.findById(nodeid);
		Joinpoint jp = Joinpoint.dao.findById(pointid);
		String newjpstr = node.getJoinpoints()+","+jp.getStrcoords();
		buff.append("update route_node r set r.joinpoints = ? where r.nodeid=?");
		Db.update(buff.toString(), newjpstr,nodeid);
		
		//更新弧段表
		buff.delete(0, buff.toString().length());
		buff.append("select * from route_arc r WHERE r.strcoords LIKE '"+jp.getStrcoords()+"%' or r.strcoords LIKE '%"+jp.getStrcoords()+"'");
		List<Record> arcList = Db.find(buff.toString());
		Map<String,Integer> newNodeMap = new HashMap<String,Integer>();
		for(Record record:arcList){
			buff.delete(0, buff.toString().length());
			if(record.getStr("strcoords").startsWith(jp.getStrcoords())){
				buff.append("update route_arc r set r.startnode = ? where r.arcid=?");
			}else{
				buff.append("update route_arc r set r.endnode = ? where r.arcid=?");
			}
			Db.update(buff.toString(),nodeid,record.getStr("arcid"));
		}
		
		//更新连通关系表
		this.genNodeRelation(nodeid);
		
		return "success";
	}
	
	/**
	 * 生成节点连通关系
	 * @param nodeid 节点编号
	 * @return
	 */
	public String genNodeRelation(String nodeid){
		/*Map<String,String> nextnodeMap = new HashMap<String,String>();
		StringBuffer buff = new StringBuffer("");
		buff.append("delete from route_node_relations r where r.nodeid=?");
		Db.update(buff.toString(),nodeid);
		
		buff.delete(0, buff.toString().length());
		buff.append("select * from route_arc a where a.startnode = ? or a.endnode = ?");
		List<Record> nodelist = Db.find(buff.toString(),nodeid,nodeid);
		String allarcs = "";
		for(Record record:nodelist){
			String nextnodeid = "";
			String relation = "";
			if(record.getStr("startnode") == null || record.getStr("endnode") == null){
				continue;
			}
			if(record.getStr("startnode").equalsIgnoreCase(nodeid)){
				nextnodeid = record.getStr("endnode");
				if(record.getStr("traffic_dir").equalsIgnoreCase("0")){
					relation = "arrive";
				}else if(record.getStr("traffic_dir").equalsIgnoreCase("1")){
					relation = "leave";
				}else if(record.getStr("traffic_dir").equalsIgnoreCase("2")){
					relation = "all";
				}else if(record.getStr("traffic_dir").equalsIgnoreCase("3")){
					relation = "none";
				}
			}else{
				nextnodeid = record.getStr("startnode");
				if(record.getStr("traffic_dir").equalsIgnoreCase("0")){
					relation = "leave";
				}else if(record.getStr("traffic_dir").equalsIgnoreCase("1")){
					relation = "arrive";
				}else if(record.getStr("traffic_dir").equalsIgnoreCase("2")){
					relation = "all";
				}else if(record.getStr("traffic_dir").equalsIgnoreCase("3")){
					relation = "none";
				}
			}
			String noderelation = nextnodeMap.get(nextnodeid);
			if(noderelation == null || noderelation.equals("")){
				noderelation = "arrive:0;leave:0";
			}
			if(relation.equalsIgnoreCase("arrive")){
				noderelation = "arrive:1;"+noderelation.split(";")[1];
			}else if(relation.equalsIgnoreCase("leave")){
				noderelation = noderelation.split(";")[0]+";leave:1";
			}else if(relation.equalsIgnoreCase("all")){
				noderelation = "arrive:1;leave:1";
			}
			nextnodeMap.put(nextnodeid, noderelation);
			allarcs +=record.getStr("arcid")+",";
		}
		if(allarcs.length()<=1){
			return "success";
		}
		allarcs = allarcs.substring(0,allarcs.length()-1);
		
		buff.delete(0, buff.toString().length());
		buff.append("select * from route_forbiddenturn a where a.crossnode = ?");
		List<Record> forblist = Db.find(buff.toString(),nodeid);
		
		Iterator iter = nextnodeMap.keySet().iterator();
		String nextnodes = "";
		String allrelation = "";
		String allnodes = "";
		while(iter.hasNext()){
			String fromnode = iter.next().toString();
			String fnrelation = nextnodeMap.get(fromnode);
			String relation = "";
			Iterator siter = nextnodeMap.keySet().iterator();
			while(siter.hasNext()){
				String tonode = siter.next().toString();
				String tnrelation = nextnodeMap.get(tonode);
				Boolean forbflag = false;
				for(Record forb:forblist){
					if(forb.getStr("fromnode").equalsIgnoreCase(fromnode) && forb.getStr("tonode").equalsIgnoreCase(tonode)){
						forbflag = true;
						break;
					}
				}
				if(!forbflag && fnrelation.split(";")[1].split(":")[1].equalsIgnoreCase("1") && tnrelation.split(";")[0].split(":")[1].equalsIgnoreCase("1")){
					relation+="1";
				}else{
					relation+="0";
				}
			}
			allrelation+=relation+",";
			allnodes+=fromnode+",";
		}
		allrelation = allrelation.substring(0,allrelation.length()-1);
		allnodes = allnodes.substring(0,allnodes.length()-1);
		buff.delete(0, buff.toString().length());
		buff.append("insert into route_node_relations(nodeid,next_nodes,next_arcs,ltztj) values(?,?,?,?)");
		//System.out.println(nodeid+"--"+allnodes+"--"+allarcs+"--"+allrelation);
		Db.update(buff.toString(),nodeid,allnodes,allarcs,allrelation);*/
		
		return "success";
	}
	
	/**
	 * 更新一条连通关系 
	 * @param nodeid
	 * @param fromnode
	 * @param tonode
	 * @param relation
	 * @return
	 */
	public String updateNodeRelation(String nodeid,String fromnode,String tonode,String relation){
		StringBuffer buff = new StringBuffer("");
		if(relation.equalsIgnoreCase("0")){
			buff.append("insert into route_forbiddenturn(ftid,crossnode,fromnode,tonode) values('")
				.append(UUID.randomUUID().toString().replaceAll("-", "")).append("','")
				.append(nodeid).append("','")
				.append(fromnode).append("','")
				.append(tonode).append("')");
		}else{
			buff.append("delete from route_forbiddenturn r where r.crossnode='")
				.append(nodeid).append("' and r.fromnode='")
				.append(fromnode).append("' and r.tonode = '")
				.append(tonode).append("'");
		}
		Db.update(buff.toString());
		//this.genNodeRelation(nodeid);
		return "success";
	}
	
	/**
	 * 删除一个节点上的连接点
	 * @param nodeid
	 * @param pointid
	 * @return
	 */
	@SuppressWarnings("unchecked")
	public String rmJpfromNode(String nodeid,String pointid){
		//节点表处理 删除连接点字段里的记录
		StringBuffer buff = new StringBuffer("");
		Node node = Node.dao.findById(nodeid);
		List<Record> jpList = this.getJpInNode(node);
		if(jpList.size()<=0){
			return "success";
		}
		String newjpstr = "";
		String jpstr = Joinpoint.dao.findById(pointid).getStrcoords();
		for(Record record:jpList){
			if(record.getStr("pointid").equalsIgnoreCase(pointid)){
				continue;
			}
			newjpstr+=record.getStr("strcoords")+",";
		}
		if(newjpstr.length()<=1){
			return "success";
		}
		newjpstr = newjpstr.substring(0,newjpstr.length()-1);
		buff.append("update route_node r set r.joinpoints = ? where r.nodeid=?");
		Db.update(buff.toString(), newjpstr,nodeid);
		
		//弧段表处理
		buff.delete(0, buff.toString().length());
		String geomstr = GISUtils.genGeomStr(jpstr, "point");
		//System.out.println(geomstr);
		buff.append("update route_arc r set r.startnode = null where r.startnode = ? and SDO_WITHIN_DISTANCE(r.geometry,"+geomstr+",'distance=1 querytype=window')='TRUE'");
		Db.update(buff.toString(),nodeid);
		buff.delete(0, buff.toString().length());
		buff.append("update route_arc r set r.endnode = null where r.endnode = ? and SDO_WITHIN_DISTANCE(r.geometry,"+geomstr+",'distance=1 querytype=window')='TRUE'");
		Db.update(buff.toString(),nodeid);
		
		
		//连通关系表处理
		this.genNodeRelation(nodeid);
		return "success";
	}
	
	
	
	/**
	 * 根据link自动断链，生成弧段列表
	 * @param a link对象
	 * @return 弧段列表
	 */
	public List<Arc> genArcsByLink(Roadlink a){
		List<Arc> arcList = new ArrayList<Arc>(); //存储断链后的弧段列表
		LineString geom_a = GISUtils.genLineString(a.getStrcoords());
		BufferOp bufOp = new BufferOp(geom_a);
		bufOp.setEndCapStyle(BufferParameters.CAP_ROUND);	
		Double buffdis = GISUtils.getRectDistance(GISUtils.getStartNode(a.getStrcoords()),BUFFERSIZE);
		Geometry buffA = bufOp.getResultGeometry(buffdis);
		String buffAstr = "";
		for(Coordinate coord:buffA.getCoordinates()){
			buffAstr+=coord.x+","+coord.y+",";
		}
		buffAstr+=buffA.getCoordinates()[0].x+","+buffA.getCoordinates()[0].y;
		
		/*String sql = "select r.arcid,r.startnode,r.endnode,r.strcoords,r.roadcode,r.arctype,r.traffic_dir from route_arc r " +
				" where r.roadcode!='"+a.getViodldm()+"' and sdo_relate(r.geometry,MDSYS.SDO_GEOMETRY(2003,8307,null,MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,1),MDSYS.SDO_ORDINATE_ARRAY("+
				buffAstr+")),'mask=ANYINTERACT')='TRUE'";*/
		
		String sql = "select r.arcid,r.startnode,r.endnode,r.strcoords,r.roadcode,r.arctype,r.traffic_dir from route_arc r " +
		" where sdo_relate(r.geometry,MDSYS.SDO_GEOMETRY(2001,8307,null,MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),MDSYS.SDO_ORDINATE_ARRAY("+
		a.getStrcoords()+")),'mask=ANYINTERACT')='TRUE'";
		
		List<Record> L = Db.find(sql);
		if(L != null && L.size()>0){
			List<String> M = new ArrayList<String>(); //交点集合
			for(Record Li:L){
				String licoords = Li.getStr("strcoords");
				if(licoords.equalsIgnoreCase(a.getStrcoords())){
					continue;
				}
				//计算两条线是否相交
				LineString geom_joinarc = GISUtils.genLineString( licoords);
				Geometry geom_linejoin = geom_a.intersection(geom_joinarc);
				
				if(geom_linejoin.isEmpty()){
					//如果不相交，计算与缓冲区的交点坐标
					
					Point joinpoint = buffA.intersection(geom_joinarc).getCentroid();
					if(joinpoint.isEmpty()){
						continue;
					}
					String strjp =  joinpoint.getCoordinate().toString();
					strjp = strjp.split(",")[0].substring(1)+","+strjp.split(",")[1];
					
					//如果交点坐标距离Li的端点<系统阈值MERGELENGTH，将交点坐标添加到坐标几何M中
					Double sdis = GISUtils.dist(strjp, GISUtils.getStartNode(licoords));
					Double edis = GISUtils.dist(strjp, GISUtils.getEndNode(licoords));
					if(sdis<=MERGELENGTH || edis<=MERGELENGTH){
						M.add(strjp);
					}
				}else{
					//如果相交，将Li与a的交点坐标添加到交点坐标集合M中
					String strjp =  geom_linejoin.getCoordinate().toString();
					strjp = strjp.split(",")[0].substring(1)+","+strjp.split(",")[1];
					M.add(strjp);
					
					//如果交点坐标距离Li的端点>系统阈值MERGELENGTH
					Double sdis = GISUtils.dist(strjp, GISUtils.getStartNode(licoords));
					Double edis = GISUtils.dist(strjp, GISUtils.getEndNode(licoords));
					if(sdis>MERGELENGTH && edis>MERGELENGTH){
						//根据交点坐标将Li断开，追加到C中
						List<String> strjparr = new ArrayList<String>();
						strjparr.add(strjp);
						List<String> splitstrs = GISUtils.splitLineByPoints(licoords, strjparr);
						for(String str:splitstrs){
							Arc arc = new Arc();
							arc.setArcid(UUID.randomUUID().toString().replaceAll("-", ""));
							arc.setRoadcode(Li.getStr("roadcode"));
							arc.setStrcoords(str);
							arc.setTrafficDir(Li.getStr("traffic_dir"));
							arc.setArclength(new BigDecimal(GISUtils.getRoadLength(arc.getStrcoords())));
							arcList.add(arc);
						}
						
						//@todo 2.	删除连通关系表中弧段Li相关记录，从弧段表中将Li删除（暂不删除，因为可能有路段关联关系）
					}
				}
				//根据交点坐标集合M将弧段a进行断链，将断链后的结果添加到C中
				List<String> splitstrs = GISUtils.splitLineByPoints(a.getStrcoords(), M);
				for(String str:splitstrs){
					Arc arc = new Arc();
					arc.setArcid(UUID.randomUUID().toString().replaceAll("-", ""));
					arc.setRoadcode(a.getViodldm());
					arc.setStrcoords(str);
					arc.setTrafficDir(a.getDirection());
					arc.setArclength(new BigDecimal(GISUtils.getRoadLength(arc.getStrcoords())));
					arcList.add(arc);
				}
			}
		}else{
			Arc arc = new Arc();
			arc.setArcid(UUID.randomUUID().toString().replaceAll("-", ""));
			arc.setRoadcode(a.getViodldm());
			arc.setStrcoords(a.getStrcoords());
			arc.setTrafficDir(a.getDirection());
			arc.setArclength(new BigDecimal(GISUtils.getRoadLength(arc.getStrcoords())));
			arcList.add(arc);
		}
		return arcList;
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
	
	public String delRouteArc(String arcid){
		Arc arc = Arc.dao.findById(arcid);
		if(arc==null){
			return "success";
		}
		String[] strcoords = arc.getStrcoords().split(",");
		String startpoint = strcoords[0]+","+strcoords[1];
		String endpoint = strcoords[strcoords.length-2]+","+strcoords[strcoords.length-1];
		this.rmJpfromNode(arc.getStartnode(), this.getJpByStrcoords(startpoint).getStr("pointid"));
		this.rmJpfromNode(arc.getEndnode(), this.getJpByStrcoords(endpoint).getStr("pointid"));
		
		String sql = "delete from route_arc r where r.arcid=?";
		Db.update(sql,arcid);
		return "success";
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
	 * 查询原始数据
	 * @return
	 */
	public List getAllRoadLink(){
		try {
			//log.info("查询原始数据");
            //String sql = "SELECT r.roadid,r.linkid,r.strcoords,r.viodldm,r.direction from route_roadlink r where r.formatlevel='1' and  r.viodldm IN(SELECT c.dldm FROM vio_coderoad c WHERE c.xzqh IN('370200','370202')) order by r.roadid,SDO_GEOM.sdo_distance(r.geometry,mdsys.sdo_geometry(2001,8307,MDSYS.SDO_POINT_TYPE(1,1,0),null,null),1)";
            String sql = "SELECT r.roadid,r.linkid,r.strcoords,r.viodldm,r.direction from route_roadlink r where r.formatlevel='1' and  sdo_relate(r.geometry, MDSYS.SDO_GEOMETRY(2002, 8307,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,3),MDSYS.SDO_ORDINATE_ARRAY(120.28112,36.04602,120.39392,36.09655)), 'mask=OVERLAPBDYDISJOINT+INSIDE' ) ='TRUE'";
            List<Record> result = Db.find(sql);
            return result;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
	}
	
	/**
	 * 更新弧段方向
	 * @param arcid 弧段编号
	 * @param direction 方向 0正向 1反向 2双向 3限行
	 * @return 
	 */
	public String updateArcDirection(String arcid,int direction){
		Arc arc = Arc.dao.findById(arcid);
		if(null == arcid || arcid.length()<=0 || direction>3 || direction<-1){
			return "参数传递错误";
		}
		String sql = "update route_arc a set a.traffic_dir = ? where a.arcid=?";
		try{
			Db.update(sql,direction, arcid);
			this.genNodeRelation(arc.getStartnode());
			this.genNodeRelation(arc.getEndnode());
		}catch(Exception e){
			return "更新数据出错";
		}
		return "success";
	}
	
	/**
	 * 更新弧段坐标
	 * @param arcid 弧段编号
	 * @param strcoords 坐标字符串
	 * @return 
	 */
	public String updateArcStrcoords(String arcid,String strcoords){
		if(null == arcid || arcid.length()<=0 || null == strcoords || strcoords.length()<=0){
			return "参数传递错误";
		}
		Arc arc = Arc.dao.findById(arcid);
		Roadlink r = new Roadlink();
		r.setStrcoords(strcoords);
		r.setRoadid(arc.getRoadcode());
		r.setViodldm(arc.getRoadcode());
		r.setDirection(arc.getTrafficDir());
		this.delRouteArc(arcid);
		this.insertRoadLink(r);
		
		/*String geomstr = GISUtils.genGeomStr(strcoords,"line");
		String sql = "update route_arc a set a.strcoords = ?,a.geometry = "+geomstr+" where a.arcid=?";
		try{
			Db.update(sql,strcoords,geomstr, arcid);
		}catch(Exception e){
			return "更新数据出错";
		}*/
		return "success";
	}
	
	
	/**
	 * 更新原始数据的方向
	 * @param linkid
	 * @param direction
	 * @return
	 */
	public String updateLinkDirection(String linkid,int direction){
		if(null == linkid || linkid.length()<=0 || direction>2 || direction<-1){
			return "参数传递错误";
		}
		String sql ="";
		try{
			if(direction ==-1){
				sql = "update route_roadlink r set r.formatlevel='1' where r.linkid=?";
				Db.update(sql,linkid);
			}else{
				sql = "update route_roadlink r set r.formatlevel='1',r.direction=? where r.linkid=?";
				Db.update(sql,direction,linkid);
			}
			return "success";
		}catch(Exception e){
			return "更新数据出错";
		}
	}
	
	/**
	 * 获取路段列表
	 * @param sectionname 路段名称
	 * @return
	 */
	public List getSectionList(String sectionname){
		String sql = "select r.sectionid,r.sectionname,r.arcs from route_section r ";
		if(sectionname!=null && sectionname.length()>0){
			sql += " where r.sectionname like '%"+sectionname+"%'";
		}
		List list = Db.find(sql);
		return list;
	}
	
	
	
	/**
	 * 合并原始link数据
	 */
	public void meargeRoadLink(){
		try {
			//log.info("查询原始数据");
            String sql = "SELECT r.roadid,r.linkid,r.strcoords from route_roadlink r where r.formatlevel='0'";
            List<Record> result = Db.find(sql);
            List<Geometry> linestrings = new ArrayList<Geometry>();
            for(Record record:result){
            	linestrings.add(GISUtils.genLineString(record.getStr("STRCOORDS")));
            }
            LineMerger lineMerger = new LineMerger();
    		lineMerger.add(linestrings);
    		List<Geometry> mergedLineStrings = (List<Geometry>) lineMerger.getMergedLineStrings();
    		StringBuffer buff = new StringBuffer();
    		String presql = "INSERT INTO route_roadlink VALUES('1',";
    		for(Geometry lineString:mergedLineStrings){
    			String strcoords = GISUtils.getLineStrcoords(lineString);
    			String[] points = strcoords.split(",");
    			if(points.length<4){
    				continue;
    			}
    			//System.out.println(strcoords);
    			if(points.length>100){
    				int substrnums = points.length/100;
    				for(int i=0;i<=substrnums;i++){
    					int start = i*100;
    					int end = (i==substrnums?(points.length-1):(i*100+100));
    					StringBuffer substr = new StringBuffer("");
    					for(int j=start;j<end;j++){
    						substr.append(points[j]).append(",").append(points[++j]).append(",");
    					}
    					if(substr.toString().length()<=0 || (end-start<=1)){
    						continue;
    					}
    					substr.delete(substr.toString().length()-1, substr.toString().length());
    					buff.delete(0, buff.toString().length());
    	    			buff.append(presql).append("'").append(UUID.randomUUID().toString().replaceAll("-", "")).append("',");
    	    			buff.append("'").append(substr.toString()).append("',");
    	    			buff.append("MDSYS.SDO_GEOMETRY(2002, 8307,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),MDSYS.SDO_ORDINATE_ARRAY(");
    	    			buff.append(substr.toString()).append(")),NULL,1,NULL,NULL);");
    	    			log.info(buff.toString());
    				}
    			}else{
    				buff.delete(0, buff.toString().length());
        			buff.append(presql).append("'").append(UUID.randomUUID().toString().replaceAll("-", "")).append("',");
        			buff.append("'").append(GISUtils.getLineStrcoords(lineString)).append("',");
        			buff.append("MDSYS.SDO_GEOMETRY(2002, 8307,NULL,MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),MDSYS.SDO_ORDINATE_ARRAY(");
        			buff.append(GISUtils.getLineStrcoords(lineString)).append(")),NULL,1,NULL,NULL);");
        			log.info(buff.toString());
    			}
    			
    		}
    		//System.out.println(mergedLineStrings.size());
        } catch (Exception e) {
            e.printStackTrace();
        }
	}

}
