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
import com.hisense.himap.roadnet.service.BaseRnService;
import com.hisense.himap.roadnet.service.RnEditService;
import com.jfinal.aop.Before;
import com.jfinal.core.Controller;
import com.jfinal.kit.JsonKit;
import com.jfinal.plugin.activerecord.Record;
import com.jfinal.plugin.activerecord.tx.Tx;

public class BaseRnController extends Controller {
	
	private BaseRnService baseservice = enhance(BaseRnService.class);
	
	public void index() {
		renderText("路网接口");
	}

	/**
	 * 线性弧段表达式转换为坐标
	 */
	public void convertLRSArcsToStrcoords(){
		String lrsarcs = getPara("lrsarcs");
		renderJson("record",baseservice.convertLRSArcsToStrcoords(lrsarcs));
	}
	
	
	
}
