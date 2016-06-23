define([],function (){
	var trafficlegendfunc = null;
	
	//显示路况信息
	function showSectionStatus(){
		if(null ==HiMapConfig.geoserverURL||HiMapConfig.geoserverURL ==""){
			return;
		}
		if(trafficlegendfunc!=null){
			hideSectionStatus();
		}
		var param = {};
		param.layername = "sde:sectionstatus";
		param.refreshtime = 300000;
		param.cql_filter = "ZOOMLEVEL='"+_MapApp.getZoomLevel()+"'";
		trafficlegendfunc = _MapApp.addWMSLayer(param);
		trafficlegendfunc.addClickListener(onclick);
	}
	function hideSectionStatus(){
		if(trafficlegendfunc!=null){
			trafficlegendfunc.close();
			trafficlegendfunc = null;
		}
	}
	function onclick(pos){
		//alert("pos:"+pos.x+","+pos.y);
	}

	return{
		showSectionStatus : showSectionStatus,
		hideSectionStatus : hideSectionStatus
	}
});