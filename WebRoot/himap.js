/**
 * Created by liuxiaobing on 2016-1-5.
 */
(function (root){
	var HOSTNAME = "";
	var MAPTYPE = "";
	var MAPREADY = null;
	
	//计算地图服务地址，地图类型
	var srcipts = document.getElementsByTagName("script");
	for(var i=0;i<srcipts.length;i++){
		var tempsrc = srcipts[i].src;
		if(tempsrc.length>=8 && tempsrc.substring(tempsrc.length-8) == "himap.js"){
			HOSTNAME = tempsrc.substring(0,tempsrc.length-8);
			MAPTYPE = srcipts[i].getAttribute("maptype") || "pgis";
			MAPREADY = srcipts[i].getAttribute("onready");
			break;
		}
	}
	var HiMapConfig = {};
	HiMapConfig.HOSTNAME = HOSTNAME;
	HiMapConfig.MAPTYPE = MAPTYPE;
	HiMapConfig.MAPREADY = MAPREADY;
	root["HiMapConfig"] = HiMapConfig;
	
	var scriptObj=document.createElement("script");
	scriptObj.type="text/javascript";
	scriptObj.src=HOSTNAME+"vendor/require/require.js";
	scriptObj.setAttribute("data-main",HOSTNAME+"vendor/himap/himapmain.js");
	document.getElementsByTagName("head")[0].appendChild(scriptObj);
	
	var scriptObj=document.createElement("script");
	scriptObj.type="text/javascript";
	scriptObj.src=HOSTNAME+"vendor/require/require.js";
	scriptObj.setAttribute("data-main",HOSTNAME+"vendor/himap/himapmain.js");
	document.getElementsByTagName("head")[0].appendChild(scriptObj);
	
	
	
})(this);