package com.hisense.hiatmp.himap.mapindex.web;


import java.util.ArrayList;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;


import com.hisense.hiatmp.himap.common.web.BaseController;
import com.hisense.hiatmp.himap.mapindex.model.BaseMarkerVO;
import com.hisense.hiatmp.himap.mapindex.service.MapIndexService;

public class MapIndexController extends BaseController {
	private MapIndexService service = new MapIndexService();
	
	//计算地图按钮权限
	public void getMapToolAuth(){
		//TODO 依赖common服务 -判断当前用户是否有020406权限
		//String userMenuStr = GlobalMenuRoleUtil.getAuthorityMenu();
		//if(userMenuStr.indexOf("020604")<0){
		setAttr("oneKeySearch",true);
		renderJson();
	}
	
	/**
	 * 初始化图层信息
	 */
	public void getuserLayers(){
		setAttr("rows",service.getuserLayers());
		renderJson();
	}
	
	/**
	 * 修改用户图层配置
	 */
	public void editFavorLayer(){
		String params = getPara("params");
		setAttr("rows",service.modifyFavorLayer(params));
		renderJson();
	}
	
	public void getLayerData(){
		Map params = getParaMap();
		setAttr("data",service.getLayerData(params));
		renderJson();
	}
	
	
	/**
	 * 获得安装点集合
	 * @return
	 * @throws Exception 
	 */
	public void getMonitor(){
		try{
			String clulevel = getPara("clulevel");
			String bbox = getPara("bbox");
			List result = service.getMonitor(clulevel, bbox);
			setAttr("rows",result);
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			renderJson();
		}
	}
	
	/**
	 * 获得安装点集合
	 * @return
	 * @throws Exception 
	 */
	public void getMonitorOnMapChange(){
		try{
			String clulevel = getPara("clulevel");
			String bbox = getPara("bbox");
			String prebbox = getPara("prebbox");
			/*Map<String,List> result = himapMgr.getMonitor();
			mm.put("result", true);
			mm.put("rows", result.get(clulevel));*/
			//himapMgr.initMonitors();
			Map<String,BaseMarkerVO> monitorMap = new HashMap<String,BaseMarkerVO>();
			Map<String,BaseMarkerVO> preMonitorMap = new HashMap<String,BaseMarkerVO>();
			List result = service.getMonitor(clulevel, bbox);
			List preresult = service.getMonitor(clulevel, prebbox);
			for(int i=0;i<preresult.size();i++){
				BaseMarkerVO marker = (BaseMarkerVO)preresult.get(i);
				preMonitorMap.put(marker.getId(), marker);
			}
			
			List<BaseMarkerVO> addList = new ArrayList<BaseMarkerVO>();
			List<BaseMarkerVO> delList = new ArrayList<BaseMarkerVO>();
			
			for(int i=0;i<result.size();i++){
				BaseMarkerVO marker = (BaseMarkerVO)result.get(i);
				if(preMonitorMap.get(marker.getId())==null){
					addList.add(marker);
				}
				monitorMap.put(marker.getId(), marker);
			}
			Iterator iter = preMonitorMap.keySet().iterator();
			while(iter.hasNext()){
				BaseMarkerVO marker = preMonitorMap.get(iter.next());
				if(monitorMap.get(marker.getId())==null){
					delList.add(marker);
				}
			}
			
			setAttr("addrows", addList);
			setAttr("delrows", delList);
		}catch(Exception e){
			e.printStackTrace();
		}finally{
			renderJson();
		}
	}
	
}
