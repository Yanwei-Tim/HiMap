package com.hisense.himap.roadnet.web;

import java.util.ArrayList;
import java.util.List;

import com.hisense.himap.roadnet.model.Road;
import com.hisense.himap.roadnet.service.RnQueryServiceImpl;
import com.jfinal.core.Controller;

public class RnQueryController extends Controller {
	
	private RnQueryServiceImpl service = new RnQueryServiceImpl();
	
	public void index() {
		renderText("智能路网服务");
	}
	
	public void queryRecord(){
		String qtype = getPara("qtype");
		List result = new ArrayList();
		if(qtype.equalsIgnoreCase("0")){
			Road road = new Road();
			road.setDlmc((getPara("dlmc") == null?"":getPara("dlmc")));
			result = service.queryRecordByDTO(0,road);
		}else if(qtype.equalsIgnoreCase("5")){
			result = service.queryRecordByDTO(5,null);
		}
		
		renderJson("record",result);
	}

}
