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
	
	function showClusterDevicesByType(dtype){
		require([rootpath+"modules/index/js/device/deviceInteract"],function(deviceInteract){
			deviceInteract.showDevicesByType(dtype);
		});
	}
	
	function removeDevicesByType(dtype){
		require([rootpath+"modules/index/js/device/deviceInteract"],function(deviceInteract){
			deviceInteract.removeDevicesByType(dtype);
		});
	}
	
	//显示路况信息
	function showSectionStatus(sectionid,style,sectionlevel){
		require([rootpath+"modules/index/js/device/deviceInteract"],function(sectionstatusInteract){
			sectionstatusInteract.showSectionStatus();
		});
	}
	function hideSectionStatus(){
		require([rootpath+"modules/index/js/device/deviceInteract"],function(sectionstatusInteract){
			sectionstatusInteract.hideSectionStatus();
		});
	}

	return{
		showEmergencyInfo : showEmergencyInfo,
		hideEmergencyInfo : hideEmergencyInfo,
		showTrafficInfo : showTrafficInfo,
		hideTrafficInfo : hideTrafficInfo,
		showClusterDevicesByType : showClusterDevicesByType,
		removeDevicesByType : removeDevicesByType,
		showSectionStatus : showSectionStatus,
		hideSectionStatus : hideSectionStatus
	}
});