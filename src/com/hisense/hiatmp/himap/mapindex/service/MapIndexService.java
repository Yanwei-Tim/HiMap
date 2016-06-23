package com.hisense.hiatmp.himap.mapindex.service;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


import com.hisense.hiatmp.himap.common.globalmem.MemDevice;
import com.hisense.hiatmp.himap.common.service.BaseService;
import com.hisense.hiatmp.himap.mapindex.model.BaseMarkerVO;
import com.hisense.hiatmp.himap.mapindex.model.MarkerVO;
import com.jfinal.plugin.activerecord.Db;
import com.jfinal.plugin.activerecord.Record;
import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Envelope;
import com.vividsolutions.jts.index.kdtree.KdNode;

public class MapIndexService extends BaseService {
	
	private static Map<String,String> roadMap = null;
	
	public List<Record> getuserLayers() {
		//TODO 依赖common服务-计算当前用户
		String userid = "admin4";
		String sql = "SELECT l.*,CASE WHEN u.showorder IS NULL THEN '0' ELSE '1' END AS isfavor,u.showorder AS favororder"+
					" from layer_type l LEFT JOIN (SELECT * FROM user_favor_layer WHERE userid=?) u ON u.layerid = l.lid";
		return Db.find(sql,userid);
		
	}
	
	public String modifyFavorLayer(String params)  {
		//TODO 依赖common服务-计算当前用户
		String userid = "admin4";
		try{
			String sql = "delete from user_favor_layer where userid=?";
			Db.update(sql,userid);
			 if(params == null || params.equals("")){
	        	return "success";
	        }
			String[] paramArr = params.split("&");
			for(String param:paramArr){
				String lid = param.split(",")[0];
				String order = param.split(",")[1];
				sql = "insert into user_favor_layer(userid,layerid,showorder) values(?,"+lid+","+order+")";
				System.out.println(sql);
				Db.update(sql,userid);
			}
			
			return "success";
		}catch (Exception e) {
			e.printStackTrace();
			return null;
		} 
	}
	
	private String getParamValue(Map params,String key){
		String result = "";
		Object obj = params.get(key);
		if(obj!=null){
			result =  ((String[]) obj)[0];
		}
		return result;
	}
	
	/**
	 * 获取图层数据
	 * @param params
	 * @return
	 */
	public List getLayerData(Map params){
		String lid = getParamValue(params,"lid");
		if(lid.equals("8")){ //应急资源图层
			String infotype = getParamValue(params,"infotype");
			return this.getAllEmergencyInfo(infotype);
		}else if(lid.equals("7")){
			String infotype = getParamValue(params,"infotype");
			return this.getAllTrafficInfo(infotype);
		}else if(lid.equals("6")){ //交警辖区分界
			String nlevel = getParamValue(params,"nlevel");
			String deptid = getParamValue(params,"deptid");
			return this.getDistrict(nlevel, deptid);
		}else if(lid.equals("402")){ //占路施工
			
		}
		return null;
	}
	
	/**
	 * 应急资源图层数据
	 * @param infotype
	 * @return
	 */
	private List getAllEmergencyInfo(String infotype){
		StringBuffer buff = new StringBuffer("SELECT e.id, d.deptshortname,e1.enumname as danweifenlei,e.department_name as title,e2.enumname as danweijibie,e.address,e.linkman,e.telephone,e.longandlatitude as strcoords,e1.enumvalue from emergency_resources_manage e");
		buff.append(" LEFT JOIN enum_type e1 ON e1.enumvalue=e.resource_type");
		buff.append(" LEFT JOIN enum_type e2 ON e2.enumvalue=e.department_level");
		buff.append(" LEFT JOIN department d ON d.cdepartmentid=e.create_department");
		buff.append(" WHERE e1.enumtypeid=1320 AND e2.enumtypeid=1321");
		if(infotype!=null && !infotype.equalsIgnoreCase("")){
			buff.append(" and e.RESOURCE_TYPE = '").append(infotype).append("'");
		}
		System.out.println(buff.toString());
		List<Record> list = Db.find(buff.toString());
		return list;
	}
	
	/**
	 * 交通基础信息
	 * @param infotype
	 * @return
	 */
	private List getAllTrafficInfo(String infotype){
		if(this.roadMap == null){
			roadMap = new HashMap<String,String>();
			String sql = "select nid,dlmc from vio_coderoad";
			List<Record> roadlist = Db.find(sql);
			if (roadlist != null && roadlist.size() > 0) {
				for (Record record:roadlist) {
					roadMap.put(record.getStr("nid"), record.getStr("dlmc"));
				}
			}
		}
		StringBuffer buff = new StringBuffer("SELECT t.*,t.name AS title,t.coordinates as strcoords,d1.deptshortname as ddeptname,d2.deptshortname as zhongdeptname,r.dlmc");
		buff.append(" from   TRAFFIC_INFO t LEFT JOIN department d1 ON d1.cdepartmentid=t.dadept")
			.append(" LEFT JOIN department d2 ON d2.cdepartmentid=t.zhongdept ")
			.append(" LEFT JOIN vio_coderoad r ON r.nid = t.dldm")
			.append(" WHERE t.delflag=0 and t.type=?");
		System.out.println(buff.toString());
		List<Record> list = Db.find(buff.toString(),infotype);
		if(list!=null && list.size()>0){
			for(Record record:list){
				String coordinates = record.getStr("coordinates");
				
				int crdlength = coordinates.split(",").length;
				if(crdlength==2){
					record.set("coordtype", "1");//设置图层类型为点
				}else if(crdlength ==1){
					record.set("coordtype", "1");//设置图层类型为点
					//桩号转坐标
					coordinates = convertPileToCrd(record.getStr("dldm"), coordinates);
					record.set("coordinates", coordinates);//设置图层类型为线
				}else{
					record.set("coordtype", "2");//设置图层类型为线
				}
				
				//2.1 设置弹窗模版
				if(infotype.equals("11")){//隧道
					record.set("tplid", "701");
					record.set("suidao", true);
					record.set("imgurl",":suidao.png");
				}else if(infotype.equals("12")){//互通立交
					record.set("tplid", "702");
					record.set("hutonglijiao", true);
					record.set("imgurl",":hutonglijiao.png");
				}else if(infotype.equals("23")){//服务区
					record.set("tplid", "703");
					record.set("fuwuqu", true);
					record.set("imgurl",":fuwuqu.png");
				}else if(infotype.equals("24")){//出入口
					record.set("tplid", "704"); 
					record.set("churukou", true);
					record.set("imgurl",":churukou.png");
				}else if(infotype.equals("25")){//收费站
					record.set("tplid", "705");
					record.set("shoufeizhan", true);
					record.set("imgurl",":shoufeizhan.png");
				}else if(infotype.equals("26")){//执法站
					record.set("tplid", "706");
					record.set("zhifazhan", true);
					record.set("imgurl",":zhifazhan.png");
				}
				
				record.set("direction", record.getStr("direction").equalsIgnoreCase("0")?"上行":"下行");
				
				String startpoint = record.getStr("startpoint") == null?"":record.getStr("startpoint") ;
				if(startpoint.length()==7){
					String kmile = startpoint.substring(0,4);//公里数
					String mmile = startpoint.substring(4);//米数
					record.set("startpoint","K"+kmile+"+"+mmile); //起始桩号
				}
				String endpoint = record.getStr("endpoint") == null?"":record.getStr("endpoint") ;
				if(endpoint.length()==7){
					String kmile = endpoint.substring(0,4);//公里数
					String mmile = endpoint.substring(4);//米数
					record.set("endpoint","K"+kmile+"+"+mmile); //起始桩号
				}
				
				String gsgl = record.getStr("gsgl")==null?"":record.getStr("gsgl");
				String[] gsglarr = gsgl.split(",");
				String gsgls = "";
				for(String nid:gsglarr){
					if(this.roadMap.get(nid)!=null){
						gsgls += this.roadMap.get(nid)+",";
					}
				}
				if(gsgls.length()>1){
					gsgls = gsgls.substring(0,gsgls.length()-1);
				}
				record.set("gsgls", gsgls);//连通高速公路
				
			}
		}
		return list;
	}
	
	/**
	 * 桩号转坐标
	 * @param dldm	道路代码
	 * @param pileno	桩号 （4位公里数+3位米数，不足补0，如"0100003",表示100公里+3米）
	 * @return	坐标
	 * @throws Exception
	 */
	public String convertPileToCrd(String dldm, String pileno){
		int miletostart = 0;
		if(pileno.length()==7){
			//计算起始里程值
			String sql = "select nvl(vc.startpoint,'-1') as startpile from vio_coderoad vc WHERE vc.dldm='"+dldm+"'";
			List<Record> templist = Db.find(sql);
			if(templist == null || templist.size()<=0){
				return "-2";
			}
			String startpile = templist.get(0).getStr("startpile");
			if(startpile.equals("-1")){
				return "";
			}
			if(startpile.length()!=4 && startpile.length()!=7){
				return "-1";
			}
			String startkmile = startpile.substring(0,4);
			String startmmile = "0";
			if(startpile.length()==7){
				startmmile = startpile.substring(4);
			}
			while(startkmile.startsWith("0") && startkmile.length()>1){
				startkmile = startkmile.substring(1);
			}
			while(startmmile.startsWith("0") && startmmile.length()>1){
				startmmile = startmmile.substring(1);
			}
			int qs = Integer.parseInt(startkmile)*1000+Integer.parseInt(startmmile);
			
			
			//将桩号转换为里程值
			String kmile = pileno.substring(0,4);
			while(kmile.startsWith("0") && kmile.length()>1){
				kmile = kmile.substring(1);
			}
			String mmile = pileno.substring(4);
			while(mmile.startsWith("0") && mmile.length()>1){
				mmile = mmile.substring(1);
			}
			miletostart = Integer.parseInt(kmile)*1000+Integer.parseInt(mmile);
			
			//根据里程值计算坐标
			sql = "SELECT to_char(sdo_util.to_wktgeometry(SDO_LRS.CONVERT_TO_STD_GEOM(SDO_LRS.LOCATE_PT(SDO_LRS.CONVERT_TO_LRS_GEOM(vcg.GEOMETRY),"+miletostart+"-"+qs+"))))";
			sql += " as  wktgeometry FROM vio_coderoad vc LEFT JOIN vio_coderoad_geometry vcg ON vc.dldm=vcg.dldm";
			sql +=" WHERE vc.dldm='"+dldm+"'";
			try{
				List<Record> list = Db.find(sql);
				if(list!=null && list.size()>0){
					String wktgeometry = list.get(0).getStr("wktgeometry");
					wktgeometry = wktgeometry.substring(wktgeometry.indexOf("(")+1,wktgeometry.indexOf(")"));
					String longitude = wktgeometry.split(" ")[0];
					if(longitude.length()>9){
						longitude = longitude.substring(0,9);
					}
					String latitude = wktgeometry.split(" ")[1];
					if(latitude.length()>8){
						latitude = latitude.substring(0,8);
					}
					return longitude+","+latitude;
				}
			}catch(Exception e){
				return null;
			}
			return null;
		}else{
			return null;
		}
	}
	
	/**
	 * 交警辖区图层
	 * @param nlevel
	 * @param deptid
	 * @return
	 */
	private List getDistrict(String nlevel,String deptid){
		StringBuffer buff = new StringBuffer("select c.*,d.deptshortname as shortname,d.nlevel,e.enumname as colorcode from district c");
		buff.append(" left join department d on d.cdepartmentid = c.dept_id  ");
		buff.append(" left join enum_type e on e.enumvalue = c.color where e.enumtypeid='1310' ");
		if (nlevel != null && !nlevel.equalsIgnoreCase("")) {
			buff.append(" and d.nlevel = '").append(nlevel).append("'");
		}
		if (deptid != null && !deptid.equalsIgnoreCase("")) {
			buff.append(" and d.cdepartmentid = '").append(deptid).append("'");
		}
		return Db.find(buff.toString());
	}
	
	
	public List getMonitor(String clulevel,String bbox) throws Exception{
		List result = new ArrayList();
		HiKdTree tree = MemDevice.monitorKDTrees.get(clulevel);
		String[] sbound = bbox.split(",");
		if(sbound.length!=4){
			return null;
		}
		Double[] dbound = new Double[4];
		for(int i=0;i<4;i++){
			dbound[i] = Double.parseDouble(sbound[i]);
		}
		Envelope env = new Envelope(new Coordinate(dbound[0],dbound[1]),new Coordinate(dbound[2],dbound[3]));
		List<KdNode> nodelist = tree.query(env);
		//按照到中心点的距离进行排序
		Coordinate center = env.centre();
		for(int i = nodelist.size()-1;i>0;i--){
			for(int j=0;j<i;j++){
				KdNode pnode = nodelist.get(j);
				KdNode nnode = nodelist.get(j+1);
				KdNode swapnode = null;
				if(center.distance(pnode.getCoordinate())>center.distance(nnode.getCoordinate())){
					swapnode = pnode;
					nodelist.set(j, nnode);
					nodelist.set(j+1, swapnode);
				}
			}
		}
		for(KdNode subnode:nodelist){
			MarkerVO marker = (MarkerVO)subnode.getData();
			BaseMarkerVO basemarker = new BaseMarkerVO();
			basemarker.setId(marker.getId());
			basemarker.setTitle(marker.getTitle());
			basemarker.setLongitude(marker.getLongitude());
			basemarker.setLatitude(marker.getLatitude());
			basemarker.setMarkerinfo(marker.getMarkerinfo());
			result.add(basemarker);
		}
		
		return result;
	}
	
	
	
	public Map<String,List> getMonitor() throws Exception{
		Map<String,List> result = new HashMap<String,List>();
		Iterator itera = MemDevice.monitorKDTrees.keySet().iterator();
		while(itera.hasNext()){
			String clulevel = itera.next().toString();
			result.put(clulevel, MemDevice.monitorKDTrees.get(clulevel).reportSubTreeData());
		}
		return result;
	}
	
	
	
}
