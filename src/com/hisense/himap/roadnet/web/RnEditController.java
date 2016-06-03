package com.hisense.himap.roadnet.web;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import com.alibaba.fastjson.JSON;
import com.alibaba.fastjson.JSONArray;
import com.hisense.himap.roadnet.model.Node;
import com.hisense.himap.roadnet.model.NodeRelations;
import com.hisense.himap.roadnet.model.Roadlink;
import com.hisense.himap.roadnet.service.RnEditService;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;

public class RnEditController extends BaseRnController {
	
	private RnEditService editservice = enhance(RnEditService.class);
	
	public void index() {
		renderText("路网维护接口");
	}
	
	public void getAllRoadLink(){
		renderJson("record",editservice.getAllRoadLink());
	}
	
	/**
	 * 更新link方向
	 */
	public void updateLinkDirection(){
		String linkid = getPara("linkid");
		int direction=-1;
		try{
			direction = getParaToInt("direction");
		}catch(Exception e){
			setAttr("result",false);
			setAttr("info","参数传递错误");
		}
		String info = editservice.updateLinkDirection(linkid, direction);
		if(info.equalsIgnoreCase("success")){
			setAttr("result",true);
		}else{
			setAttr("result",false);
			setAttr("info",info);
		}
		renderJson();
		
	}
	
	
	/**
	 * 从高德地图添加roadlink
	 */
	public static Map<String,String> roadidMap = new HashMap<String,String>();
	public void addRoadLinkFromGD(){
		String info = getPara("roadinfo");
		Roadlink qrlink = JSON.parseObject(info,Roadlink.class);
		if(roadidMap.get(qrlink.getRoadid())!=null){
			setAttr("result",true);
		}else{
			roadidMap.put(qrlink.getRoadid(), qrlink.getRoadid());
			JSONArray paths = JSONArray.parseArray(qrlink.getStrcoords());
			List<Roadlink> list = new ArrayList<Roadlink>();
			for(int i =0; i<paths.size(); i++){
				Roadlink rlink = new Roadlink();
				rlink.setRoadid(qrlink.getRoadid());
				rlink.setViodldm(qrlink.getViodldm());
				rlink.setLinkid(UUID.randomUUID().toString().replaceAll("-", ""));
				JSONArray path = (JSONArray) paths.get(i);
				String strcoord = "";
				for(int m=0;m<path.size();m++){
					Map map = (Map)path.get(m);
					strcoord+=map.get("lng")+","+map.get("lat")+",";
				}
				rlink.setStrcoords(strcoord.substring(0,strcoord.length()-1));
				list.add(rlink);
			}
			editservice.insertRoadLinkFromGD(list);
			setAttr("result",true);
		}
		renderJson();
	}
	
	/**
	 * 根据link批量生成路网信息
	 */
	public void initRoadLink(){
		List<Record> list = editservice.getAllRoadLink();
		System.out.println(list.size());
		int i = 0;
		for(Record record:list){
			System.out.print(i+"  ");
			i++;
			Roadlink r = new Roadlink();
			r.setStrcoords(record.getStr("strcoords"));
			r.setRoadid(record.getStr("roadid"));
			r.setViodldm(record.getStr("viodldm"));
			r.setDirection(record.getStr("direction"));
			editservice.insertRoadLink(r);
		}
		renderJson();
		
	}
	
	/**
	 * 添加一条link
	 */
	public void addRoadLink(){
		/*List<Record> list = editservice.getAllRoadLink();
		System.out.println(list.size());
		int i = 0;
		for(Record record:list){
			System.out.print(i+"  ");
			i++;
			Roadlink r = new Roadlink();
			r.setStrcoords(record.getStr("strcoords"));
			r.setRoadid(record.getStr("roadid"));
			r.setViodldm(record.getStr("viodldm"));
			r.setDirection(record.getStr("direction"));
			editservice.insertRoadLink(r);
		}*/
		
		Roadlink r = new Roadlink();
		r.setStrcoords(getPara("strcoords"));
		r.setRoadid(getPara("roadid"));
		r.setViodldm(getPara("dldm"));
		r.setDirection(getPara("direction"));
		
		setAttr("result",editservice.insertRoadLink(r));
		renderJson();
	}
	
	public void getRouteNode(){
		String strcoords = getPara("strcoords");
		Node node = editservice.getNodeByJoinPoint(strcoords);
		
		setAttr("routenode",new Node().set("nodeid", node.getNodeid()).set("strcoords", node.getStrcoords()));
		if(node.getNodeid()!=null && !node.getNodeid().equalsIgnoreCase("")){
			
			setAttr("nearnodes",editservice.getNextNodes(node.getNodeid()));
			
			setAttr("ftlist",editservice.getForbiddenturn(node.getNodeid()));

			List<Record> jplist = editservice.getJpInNode(node);
			setAttr("joinpoints",jplist);
			
			List<Record> nearjplist = editservice.getJpNearNode(node,300d);
			List<Record> list = new ArrayList<Record>();
			for(Record record:nearjplist){
				String pointid = record.getStr("pointid");
				Boolean isjp = false;
				for(Record jp:jplist){
					if(pointid.equalsIgnoreCase(jp.getStr("pointid"))){
						isjp = true;
						break;
					}
				}
				if(!isjp){
					list.add(record);
				}
			}
			setAttr("nearjoinpoints",list);
		}
		renderJson();
	}
	
	public void insertJptoNode(){
		String nodeid = getPara("nodeid");
		String pointid = getPara("pointid");
		setAttr("result",this.editservice.insertJptoNode(nodeid, pointid));
		renderJson();
	}
	public void rmJpfromNode(){
		String nodeid = getPara("nodeid");
		String pointid = getPara("pointid");
		setAttr("result",this.editservice.rmJpfromNode(nodeid, pointid));
		renderJson();
	}
	
	/**
	 * 合并
	 */
	public void MergeNodesFromPolygon(){
		String polygon = getPara("polygon");
	}
	
	public void updateNodeRelation(){
		String nodeid = getPara("nodeid");
		String fromnode = getPara("fromnode");
		String tonode = getPara("tonode");
		String relation = getPara("relation");
		setAttr("result",this.editservice.updateNodeRelation(nodeid, fromnode, tonode, relation));
		renderJson();
	}
	
	public void getRouteArc(){
		String strcoords = getPara("strcoords");
		List<Record> result = this.editservice.getRouteArc(strcoords);
		if(result.size()>0){
			System.out.println(result.get(0).getStr("arcid"));
			setAttr("result",result.get(0));
		}else{
			setAttr("result","");
		}
		renderJson();
	}
	
	public void delArc(){
		String arcid = getPara("arcid");
		setAttr("result",this.editservice.delRouteArc(arcid));
		renderJson();
	}
	
	public void updateArcStrcoords(){
		String arcid = getPara("arcid");
		String strcoords = getPara("strcoords");
		setAttr("result",this.editservice.updateArcStrcoords(arcid, strcoords));
		renderJson();
	}
	
	public void updateArcdirection(){
		String arcid = getPara("arcid");
		String direction = getPara("direction");
		setAttr("result",this.editservice.updateArcDirection(arcid, Integer.parseInt(direction)));
		renderJson();
	}
	
	public void getSectionList(){
		String sectionname = getPara("sectionname");
		setAttr("record",this.editservice.getSectionList(sectionname));
		renderJson();
	}
	
	public void getIntsList(){
		String intsname = getPara("intsname");
		String xzqh = getPara("xzqh");
		setAttr("record",this.editservice.getIntsList(intsname,xzqh));
		renderJson();
	}	
	public void updateIntsNode(){
		String intsid = getPara("intsid");
		String nodeid = getPara("nodeid");
		setAttr("result",this.editservice.updateIntsNode(intsid, nodeid));
		renderJson();
	}
	
	
	
}
