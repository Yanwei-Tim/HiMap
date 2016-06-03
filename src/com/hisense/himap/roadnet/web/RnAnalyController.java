package com.hisense.himap.roadnet.web;

import java.util.ArrayList;
import java.util.List;

import com.hisense.himap.common.util.GISUtils;
import com.hisense.himap.roadnet.model.Road;
import com.hisense.himap.roadnet.service.RnAnalyService;
import com.hisense.himap.roadnet.service.RnQueryServiceImpl;
import com.hisense.himap.roadnet.service.RouteSearchNode;
import com.jfinal.core.Controller;

public class RnAnalyController extends BaseRnController {
	
	private RnAnalyService service = new RnAnalyService();
	
	public void index() {
		renderText("智能路网服务");
	}
	
	/**
	 * 最短路径查询接口
	 */
	public void queryShortestPath(){
		String startpoint = getPara("startpoint");
		String endpoint = getPara("endpoint");
		String strqt = getPara("querytype");
		int querytype;
		if(strqt == null){
			querytype = 0;
		}else{
			querytype = Integer.parseInt(strqt);
		}
		List<String> inpoints = new ArrayList<String>();
		List<String> outpoints= new ArrayList<String>();
		GISUtils.genPoints(getPara("inpoints"),inpoints);
		GISUtils.genPoints(getPara("outpoints"),outpoints);
		/*List list = service.querySPList(startpoint, endpoint, inpoints, outpoints, querytype);
		List<String> result = new ArrayList<String>();
		for(int i=0;i<list.size();i++){
			RouteSearchNode node = (RouteSearchNode)list.get(i);
			if(node.getArc()!=null){
				result.add(node.getArc().getStrcoords());
			}
		}
		renderJson("path",result);*/
		String result = service.queryShortestPath(startpoint, endpoint, inpoints, outpoints, querytype);
		renderJson("path",result);
	}
	
	/**
	 * 沿路的设备搜索接口
	 */
	public void queryPointsInRoad(){
		String devicetype = getPara("devicetype");
		String distance = getPara("distance");
		String sectionid = getPara("sectionid");
		String pos = getPara("pos");
		List result = service.queryPointsInRoad(pos, devicetype, distance, sectionid);
		renderJson("result",result);
	}


}
