package com.hisense.himap.common.web;

import java.util.List;

import com.hisense.himap.common.model.EnumType;
import com.hisense.himap.common.service.BaseService;
import com.jfinal.core.Controller;

public class BaseController extends Controller {
	
	private BaseService service = new BaseService();
	
	public void index() {
		renderJsp("index.html");
	}
	
	/**
	 * 获取系统参数
	 */
	public void getSysParams(){
		String paramcode = getPara("sysparams");
		List record = service.getSysParam(paramcode);
		renderJson("record",record);
	}
	
	/**
	 * 获取枚举值
	 */
	public void getEnums(){
		String enumtype = getPara("enumtype");
		List<EnumType> record = service.getEnums(enumtype);
		renderJson("record",record);
	}
	
}
