package com.hisense.hiatmp.himap.mapquery.dao;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hisense.hiatmp.himap.common.util.GISUtils;
import com.hisense.hiatmp.himap.mapquery.model.QueryVO;
import com.jfinal.kit.PropKit;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;

public class MapQueryDAO {
	
	public List<Record>  queryRoad(QueryVO query) throws Exception {
		StringBuffer buff = new StringBuffer();

		
		buff.append("select s.SECTIONID as sectionid,s.sectionname,g.zoomlevel,st.status,to_char(st.computetime, 'yyyy-mm-dd hh24:mi:ss') as receivetime ,g.positions,st.volume,st.speed,s.sectionlevel from monitor_section  s")
			.append(" left join (select s.section_id,max(status) as status,sum(s.volume) as volume,round(avg(s.speed)) as speed,max(s.computetime) as computetime from section_status_current s where s.volume>0 and s.speed>0 group by s.section_id) st on s.sectionid=st.section_id")
			.append(" left join monitor_section_positions g on s.sectionid=g.sectionid")
			.append(" where ");
		if(query.getQuerytype().equals("querylineByPoint")|| query.getQuerytype().equals("queryByPoint")){ //点周边查询
			buff.append("  SDO_WITHIN_DISTANCE(g.geometry,mdsys.sdo_geometry(2001,8307, MDSYS.SDO_POINT_TYPE(")
					.append(query.getStrCoords()).append(",0),null,null),")
					.append(" 'distance=").append(query.getDistance()).append(" querytype=WINDOW') = 'TRUE'");
			buff.append(" and g.zoomlevel='0'");
			buff.append(" order by SDO_GEOM.sdo_distance(g.geometry,")
				.append("mdsys.sdo_geometry(2001,8307, MDSYS.SDO_POINT_TYPE(")
				.append(query.getStrCoords()).append(",0),null,null),1)");
		}else if(query.getQuerytype().equals("querylineInpoint")){ //点周边查询
			buff.append(" SDO_FILTER(g.geometry,mdsys.sdo_geometry(2001,8307, MDSYS.SDO_POINT_TYPE(")
				.append(query.getStrCoords()).append(",0),null,null),")
				.append(" 'querytype=WINDOW') = 'TRUE'  ");
			buff.append(" and g.zoomlevel='0'");
		}else if(query.getQuerytype().equals("querylineByLine")|| query.getQuerytype().equals("queryByLine")){ //线周边查询
			buff.append("   SDO_GEOM.sdo_distance(")
				.append(" g.geometry,MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),")
				.append(" MDSYS.SDO_ORDINATE_ARRAY(")
				.append(query.getStrCoords())
				.append(")),1)<=").append(query.getDistance());
			buff.append(" and g.zoomlevel='0'");
			buff.append(" order by ");
			buff.append("   SDO_GEOM.sdo_distance(")
				.append(" g.geometry,MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),")
				.append(" MDSYS.SDO_ORDINATE_ARRAY(")
				.append(query.getStrCoords())
				.append(")),1)");
		}else if(query.getQuerytype().equals("querylineByRect")|| query.getQuerytype().equals("queryByRect")){//矩形内部查询
			buff.append("  sdo_relate(")
					.append(" g.geometry,MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,3),")
					.append(" MDSYS.SDO_ORDINATE_ARRAY(")
					.append(query.getStrCoords())
					.append(")),'mask=OVERLAPBDYDISJOINT+COVERS+inside' ) = 'TRUE'");
			buff.append(" and g.zoomlevel='0'");
		}else if(query.getQuerytype().equals("querylineByPolygon")|| query.getQuerytype().equals("queryByPolygon")){//多边形内部查询
			buff.append("  sdo_relate(")
				.append(" g.geometry,MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,1),")
				.append(" MDSYS.SDO_ORDINATE_ARRAY(")
				.append(query.getStrCoords())
				.append(")),'mask=OVERLAPBDYDISJOINT+COVERS+inside querytype=WINDOW' ) = 'TRUE'");
			buff.append(" and g.zoomlevel='0'");
		}else if(query.getQuerytype().equals("querylineByCircle")|| query.getQuerytype().equals("queryByCircle")){ //圆形内部查询
			String points = query.getStrCoords();
			String pointarr[] = points.split(",");
			if(pointarr.length!=3){
				return null;
			}
			String circlePoints = GISUtils.generatePoints(pointarr[0]+","+pointarr[1],60,pointarr[2]);
			buff.append("  sdo_relate(")
				.append(" g.geometry,MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,1),")
				.append(" MDSYS.SDO_ORDINATE_ARRAY(")
				.append(circlePoints)
				.append(")),'mask=OVERLAPBDYDISJOINT+COVERS+inside' ) = 'TRUE'");
			buff.append(" and g.zoomlevel='0'");
		}else{
			return null;
		}
		System.out.println(buff.toString());
		List<Record> list = Db.find(buff.toString());
		
		return list;
	}
	
	public List<Record>  querySectionDevice(String sectionid,String devicetype) throws Exception {
		StringBuffer buff = new StringBuffer();

		buff.append("select s.sectionid,s.deviceid,s.devicetype,s.sectionname,s.devicename,s.deviceorder from section_device s where 1=1");
		if(sectionid!=null){
			buff.append(" and s.sectionid='").append(sectionid).append("'");
		}
		if(devicetype!=null){
			buff.append(" and s.devicetype='").append(devicetype).append("'");
		}
		buff.append(" order by s.deviceorder");
		
			 
		//System.out.println(buff.toString());
//		return this.jdbcTemplate.queryForList(buff.toString());
		List result = Db.find(buff.toString());
		
		return result;
	}
	
	public List  queryEquip(QueryVO query) throws Exception {
		StringBuffer buff = new StringBuffer();
		String devicetype = "";
		if(query.getDevicetype()!=null && !query.getDevicetype().equals("")){
			String[] types = query.getDevicetype().split(",");
			for(String ty:types){
				devicetype+="'"+ty+"',";
			}
			devicetype=devicetype.substring(0,devicetype.length()-1);
		}
		buff.append("select ei.* from equipment_info ei ");
		if(query.getQuerytype().equals("queryByPoint")){ //点周边查询
			buff.append(" left join monitor_point_geometry g on ei.pointid = g.pointcode")
				.append(" where g.pointcode in(select i.pointid from equipment_info i ");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" where i.devicetype in(").append(query.getDevicetype()).append(")");
			}
			
			buff.append(") and");
			buff.append("  SDO_WITHIN_DISTANCE(g.geometry,mdsys.sdo_geometry(2001,8307, MDSYS.SDO_POINT_TYPE(")
					.append(query.getStrCoords()).append(",0),null,null),")
					.append(" 'distance=").append(query.getDistance()).append(" querytype=WINDOW') = 'TRUE'");
			
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" and ei.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(" and ei.devicestate in('1','2','3','4','5')");
//			buff.append("  AND ei.pointid IN(select distinct resourceid  from role_resource_relation where roleid in ");
//			buff.append(" (select roleid from user_role_relation where nuserid = '"+GlobalRoleUtil.getCurrentAuthInfo().getUserid()+"')) ");
			buff.append(" order by SDO_GEOM.sdo_distance(g.geometry,")
				.append("mdsys.sdo_geometry(2001,8307, MDSYS.SDO_POINT_TYPE(")
				.append(query.getStrCoords()).append(",0),null,null),1)");
		}else if(query.getQuerytype().equals("queryByLine")){ //线周边查询
			buff.append(" left join monitor_point_geometry g on ei.pointid = g.pointcode")
				.append(" where g.pointcode in(select i.pointid from equipment_info i ");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" where i.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(") and");
			buff.append("  SDO_WITHIN_DISTANCE(")
				.append(" g.geometry,MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),")
				.append(" MDSYS.SDO_ORDINATE_ARRAY(")
				.append(query.getStrCoords())
				.append(")),'querytype=WINDOW distance="+query.getDistance()+"') = 'TRUE'");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" and ei.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(" and ei.devicestate in('1','2','3','4','5')");
//			buff.append("  AND ei.pointid IN(select distinct resourceid  from role_resource_relation where roleid in ");
//			buff.append(" (select roleid from user_role_relation where nuserid = '"+GlobalRoleUtil.getCurrentAuthInfo().getUserid()+"')) ");
			buff.append(" order by SDO_GEOM.sdo_distance(g.geometry,")
				.append("MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),")
				.append(" MDSYS.SDO_ORDINATE_ARRAY(")
				.append(query.getStrCoords())
				.append(")),1)");
		}else if(query.getQuerytype().equals("queryByLineOrderByStart")){ //线周边查询,按照到起点的顺序排序
			buff.append(" left join monitor_point_geometry g on ei.pointid = g.pointcode")
				.append(" where g.pointcode in(select i.pointid from equipment_info i ");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" where i.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(") and");
			buff.append("  SDO_WITHIN_DISTANCE(")
				.append(" g.geometry,MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,2,1),")
				.append(" MDSYS.SDO_ORDINATE_ARRAY(")
				.append(query.getStrCoords())
				.append(")),'querytype=WINDOW distance="+query.getDistance()+"') = 'TRUE'");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" and ei.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(" and ei.devicestate in('1','2','3','4','5')");
//			buff.append("  AND ei.pointid IN(select distinct resourceid  from role_resource_relation where roleid in ");
//			buff.append(" (select roleid from user_role_relation where nuserid = '"+GlobalRoleUtil.getCurrentAuthInfo().getUserid()+"')) ");
			
			buff.append(" order by SDO_GEOM.sdo_distance(g.geometry,")
	        	.append("mdsys.sdo_geometry(2001,8307, MDSYS.SDO_POINT_TYPE(")
	        	.append(query.getStrCoords().split(",")[0] + "," + query.getStrCoords().split(",")[1]).append(",0),null,null),1)");
		}else if(query.getQuerytype().equals("queryByRect")){//矩形内部查询
			buff.append(" left join monitor_point_geometry g on ei.pointid = g.pointcode")
				.append(" where g.pointcode in(select i.pointid from equipment_info i ");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" where i.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(") and");
			buff.append("  sdo_relate(")
					.append(" g.geometry,MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,3),")
					.append(" MDSYS.SDO_ORDINATE_ARRAY(")
					.append(query.getStrCoords())
					.append(")),'mask=INSIDE+TOUCH' ) = 'TRUE'");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" and ei.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(" and ei.devicestate in('1','2','3','4','5')");
//			buff.append("  AND ei.pointid IN(select distinct resourceid  from role_resource_relation where roleid in ");
//			buff.append(" (select roleid from user_role_relation where nuserid = '"+GlobalRoleUtil.getCurrentAuthInfo().getUserid()+"')) ");
			
		}else if(query.getQuerytype().equals("queryByPolygon")){//多边形内部查询
			buff.append(" left join monitor_point_geometry g on ei.pointid = g.pointcode")
				.append(" where g.pointcode in(select i.pointid from equipment_info i ");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" where i.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(") and");
			buff.append("  sdo_relate(")
				.append(" g.geometry,MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,1),")
				.append(" MDSYS.SDO_ORDINATE_ARRAY(")
				.append(query.getStrCoords())
				.append(")),'mask=INSIDE+TOUCH' ) = 'TRUE'");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" and ei.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(" and ei.devicestate in('1','2','3','4','5')");
//			buff.append("  AND ei.pointid IN(select distinct resourceid  from role_resource_relation where roleid in ");
//			buff.append(" (select roleid from user_role_relation where nuserid = '"+GlobalRoleUtil.getCurrentAuthInfo().getUserid()+"')) ");

			
		}else if(query.getQuerytype().equals("queryByCircle")){ //圆形内部查询
			buff.append(" left join monitor_point_geometry g on ei.pointid = g.pointcode")
				.append(" where g.pointcode in(select i.pointid from equipment_info i ");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" where i.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(") and");
			String points = query.getStrCoords();
			String pointarr[] = points.split(",");
			if(pointarr.length!=3){
				return null;
			}
			String circlePoints = GISUtils.generatePoints(pointarr[0]+","+pointarr[1],60,pointarr[2]);
			buff.append("  sdo_relate(")
				.append(" g.geometry,MDSYS.SDO_GEOMETRY(2003, 8307,NULL, MDSYS.SDO_ELEM_INFO_ARRAY(1,1003,1),")
				.append(" MDSYS.SDO_ORDINATE_ARRAY(")
				.append(circlePoints)
				.append(")),'mask=INSIDE+TOUCH' ) = 'TRUE'");
			if(devicetype!=null && !devicetype.equals("")){
				buff.append(" and ei.devicetype in(").append(query.getDevicetype()).append(")");
			}
			buff.append(" and ei.devicestate in('1','2','3','4','5')");
//			buff.append("  AND ei.pointid IN(select distinct resourceid  from role_resource_relation where roleid in ");
//			buff.append(" (select roleid from user_role_relation where nuserid = '"+GlobalRoleUtil.getCurrentAuthInfo().getUserid()+"')) ");
			
		}else{
			return null;
		}

		System.out.println(buff.toString());
//		return this.jdbcTemplate.queryForList(buff.toString());
		List result = Db.find(buff.toString());
		
		return result;
	}
	
}
