package com.hisense.hiatmp.himap.roadnet.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.hisense.hiatmp.himap.roadnet.model.Node;
import com.jfinal.plugin.activerecord.Record;

public class SPThread implements Runnable {
	private Record record;
	private String distance;
	private Node startnode;
	private List result;
	private int maxSteps;
	private RnAnalyService service = new RnAnalyService();
	
	public SPThread(Node startnode,String distance,int maxSteps,Record record,List result){
		this.startnode = startnode;
		this.distance = distance;
		this.maxSteps = maxSteps;
		this.record = record;
		this.result = result;
		
	}
	@Override
	public void run() {
		String longitude = record.getStr("longitude");
		String latitude = record.getStr("latitude");
		
		List list = this.service.querySPList(startnode.getStrcoords(), longitude+","+latitude, null, null, 0,maxSteps);
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


}
