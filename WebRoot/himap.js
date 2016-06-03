/**
 * Created by liuxiaobing on 2016-1-5.
 */
(function (root){
	var config = {
		HOSTNAME : "",
		MAPTYPE	: "",
		MAPREADY : "",
		mapurl : "",//地图url地址
		centerpoint  : "",//地图中心点
		initlevel : "", //地图初始化显示层级
		geoserverURL : "",//geoserver地址，用于展示路况、渲染图等专题图
		mapmaxlevel : ""//地图最大显示级别
	};
	
	//从客户端读取地图服务地址，地图类型,回调函数
	var srcipts = document.getElementsByTagName("script");
	for(var i=0;i<srcipts.length;i++){
		var tempsrc = srcipts[i].src;
		if(tempsrc.length>=8 && tempsrc.substring(tempsrc.length-8) == "himap.js"){
			config.HOSTNAME = tempsrc.substring(0,tempsrc.length-8);
			if(config.HOSTNAME.indexOf("http")<0){
				config.HOSTNAME = "http://"+window.location.host+"/HiMap/";
				
			}
			config.MAPTYPE = srcipts[i].getAttribute("maptype") || "pgis";
			config.MAPREADY = srcipts[i].getAttribute("onready");
			break;
		}
	}
	root["HiMapConfig"] = config;
	
	//获取初始地图配置项
	var request;
	if (window.ActiveXObject) {
	    request = new ActiveXObject("Microsoft.XMLHTTP");
	} else if (window.XMLHttpRequest) {
	    request = new XMLHttpRequest();
	}
	var url = config.HOSTNAME+"getSysParams?sysparams=2001,2002,2003,2004,2005";
	try {
	    request.onreadystatechange = function(){
	        if (request.readyState == 4) {
	            var data = "";
	            if (request.status == 200 || request.status == 0) {
	                if (typeof(JSON) == 'undefined'){
	                    data = eval("("+request.responseText+")");
	                }else{
	                    data = JSON.parse(request.responseText);
	                }
	                for(var i=0;i<data.record.length;i++){
	                	var sysparam = data.record[i];
	                	if(sysparam.paramcode == '2001'){
	                		config.mapurl = sysparam.paramvalue;
	                	}else if(sysparam.paramcode == '2002'){
	                		config.centerpoint = sysparam.paramvalue;
	                	}else if(sysparam.paramcode == '2003'){
	                		config.mapmaxlevel = sysparam.paramvalue;
	                	}else if(sysparam.paramcode == '2004'){
	                		config.initlevel = sysparam.paramvalue;
	                	}else if(sysparam.paramcode == '2005'){
	                		config.geoserverURL = sysparam.paramvalue;
	                	}
	                }
	                if(config.mapurl == ""){
	                    alert("地图引擎配置错误!");
	                }else{
	                	if(config.MAPTYPE == "pgis"){  //载入PGIS API
		                    document.writeln("<SCRIPT type='text/javascript' src='"+config.mapurl+"'><\/SCRIPT>");
	                	}
	                }
	                
	            }
	        }
	    };
	    request.open("POST", url, false);
	    request.send("");
	} catch (exception) {
	    // alert("您要访问的资源不存在!");
	}
	
	
	
	var scriptObj=document.createElement("script");
	scriptObj.type="text/javascript";
	scriptObj.src=config.HOSTNAME+"vendor/require/require.js";
	scriptObj.setAttribute("data-main",config.HOSTNAME+"vendor/himap/himapmain.js");
	document.getElementsByTagName("head")[0].appendChild(scriptObj);
	
	var cssObj=document.createElement("link");
	cssObj.real="stylesheet";
	cssObj.type = "text/css";
	cssObj.src=config.HOSTNAME+"vendor/himap/css/MyMap.css";
	document.getElementsByTagName("head")[0].appendChild(cssObj);
		
	
	
})(this);