define([],function (){
	//应急资源图层
	function showEmergencyInfo(infotype){
		var lid = "8"+infotype;
		_MapApp.Tools.sendAjax(HiMapConfig.HOSTNAME+"mapindex/getLayerData?lid=8&infotype="+infotype,function(result){
			var layerinfo = {};
			layerinfo.lid = lid;
			layerinfo.data = result.data;
			layerinfo.imgurl = HiMapConfig.HOSTNAME+"vendor/himap/icons/layericons/resource.png";
			layerinfo.tplurl = HiMapConfig.HOSTNAME+"vendor/himap/templates/tpl_8.html";
			layerinfo.tplid = "8";
			_MapApp.addVectorLayer(layerinfo);
		},false,"json");
	}
	
	function hideEmergencyInfo(infotype){
		var lid = "8"+infotype;
		_MapApp.removeVectorLayer(lid);
	}
	
	//交通基础信息
	function showTrafficInfo(infotype){
		var lid = "7"+infotype;
		_MapApp.Tools.sendAjax(HiMapConfig.HOSTNAME+"mapindex/getLayerData?lid=7&infotype="+infotype,function(result){
			var layerinfo = {};
			layerinfo.lid = lid;
			layerinfo.data = result.data;
			layerinfo.imgurl = HiMapConfig.HOSTNAME+"vendor/himap/icons/layericons/resource.png";
			layerinfo.tplurl = HiMapConfig.HOSTNAME+"vendor/himap/templates/tpl_7.html";
			layerinfo.tplid = "7";
			_MapApp.addVectorLayer(layerinfo);
		},false,"json");
	}
	
	function hideTrafficInfo(infotype){
		var lid = "7"+infotype;
		_MapApp.removeVectorLayer(lid);
	}
	

	return{
		showEmergencyInfo : showEmergencyInfo,
		hideEmergencyInfo : hideEmergencyInfo,
		showTrafficInfo : showTrafficInfo,
		hideTrafficInfo : hideTrafficInfo
	}
});