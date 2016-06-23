var basepath = "../";
var himappath = "";
var rootpath = "../../";
var domReadypath = basepath +"require/domReady";
if(HiMapConfig.MAPTYPE == "arcgis"){
	basepath = "vendor/";
	himappath = "himap/";
	rootpath = "rootpath/";
	domReadypath = "dojo/domReady";
}else{
	require.config({
		paths: {
			jquery:basepath +"jquery/jquery-1.10.2.min"
		}
	});
}

var himapapi = himappath +"map/himap_"+window["HiMapConfig"].MAPTYPE;

var currRecord ,currRecordList ;


require([himapapi,"jquery",himappath+"map/Config",himappath+"tool/tools",himappath+"overlay/HiIcon",
		himappath+"overlay/HiMarker",himappath+"overlay/HiMBR",himappath+"overlay/HiOverlay",
		himappath+"overlay/HiPoint",himappath+"overlay/HiPolygon",himappath+"overlay/HiPolyline",
		himappath+"overlay/HiRect",himappath+"overlay/HiTitle",himappath+"overlay/HiCircle",
		himappath+"overlay/HiRectangle",himappath+"layer/HiVectorLayer",himappath+"layer/HiWMSLayer",
		basepath+"handlebar/handlebars",basepath+"jsMap/JsMap",himappath+"mapanalyser/mapquery",domReadypath+"!"],
		function(HiMap,$,CONFIG,Tools,HiIcon,
				 HiMarker,HiMBR,HiOverlay,
				 HiPoint,HiPolygon,HiPolyline,
				 HiRect,HiTitle,HiCircle,
				 HiRectangle,HiVectorLayer,HiWMSLayer,
				 Handlebars,JsMap,MapQuery){
	var config = window["HiMapConfig"];
	window["HiMap"] = HiMap;
	window["HiIcon"] = HiIcon;
	window["HiMarker"] = HiMarker;
	window["HiOverlay"] = HiOverlay;
	window["HiPoint"] = HiPoint;
	window["HiPolygon"] = HiPolygon;
	window["HiPolyline"] = HiPolyline;
	window["HiRect"] = HiRect;
	window["HiTitle"] = HiTitle;
	window["HiCircle"] = HiCircle;
	window["HiRectangle"] = HiRectangle;
	window["HiVectorLayer"] = HiVectorLayer;
	window["HiWMSLayer"] = HiWMSLayer;
	window["MapQuery"] = MapQuery;
	
	var checkParam = Tools.checkParam;
    Handlebars.registerHelper("shotparam",function(param,options){
    	param = param||"--";
    	var length = options.hash.shotlength;
    	if(param.length>length){
    		param = param.substring(0,length)+"...";
    	}
    	return param;
    });
    HiMap.prototype.Tools = Tools;
    HiMap.prototype.JsMap = JsMap;
    HiMap.prototype.MapQuery = new MapQuery();
    
    //系统缓存数据
    var vectorLayerMap = new JsMap(); //当前显示在地图上的矢量图层
    
    /**
     *在地图上叠加一个设备图标
     *  @typedef {Object} ShowDeviceParam
     *  @property {String} deviceid 设备编号
     *  @property {String} [devicetype] 设备类型
     *  @property {String} [pointid] 安装点编号
     *  @property {String} [imgurl] 设备图标
     *  @property {Number} [width] 图标宽度，默认24
     *  @property {Number} [height] 图标高度，默认24
     *  @property {Boolean} [centable] 是否居中展示,默认false
     *************************************************
     * @param {ShowDeviceParam|String} params 参数对象，可选的字段参考ShowDeviceParam定义
     * @return H 返回叠加到地图上的设备对象
     */
    HiMap.prototype.showDevice = function (device) {
    	if(!checkParam(device,"")){return null};
    	//计算设备数据
    	var needajax = false;
    	var deviceid = "";
    	var equipmentinfo = null;
    	var basethis = this;
    	if(typeof(device) == "string"){
    		needajax = true;
    		deviceid = device;
    	}else if(typeof(device) == "object"){
    		if(!checkParam(device.devicetype,"") || !checkParam(device.longitude,"") || !checkParam(device.latitude,"")){
    			needajax = true;
    		}
    		deviceid = device.deviceid||"";
    		device.pointid = device.pointid||"";
    		device.devicetype = device.devicetype||"";
    		if(deviceid == "" &&(device.pointid == "" || device.devicetype == "")){
    			return null;
    		}
    		device.width = device.width||18;
    		device.height = device.height||18;
    		
    	}
    	if(needajax){
    		Tools.sendAjax(HiMapConfig.HOSTNAME+"query/getEquipmentInfo?deviceid="+deviceid+"&pointid="+device.pointid+"&devicetype="+device.devicetype,function(result){
    			equipmentinfo = result;
    			device = $.extend(device,result.currRecord);
    		});
    	}
    	if(equipmentinfo.currRecord == null){
 			return null;
 		}
			
		//计算图标
		if(!checkParam(device.imgurl,"string")){
			var config = CONFIG.devicetypes[device.devicetype];
			var iconparams = config.icon.split("_");
			var imgpath ="";
			for(var i = 0;i < iconparams.length; i++){
				var paramname = iconparams[i];
				var paramvalues = [];
				var bIsExist = false;	
				
				if(paramname.indexOf("(")>0){
					paramvalues = paramname.substring(paramname.indexOf("(")+1,paramname.indexOf(")")).split(",");
					paramname = paramname.substring(0,paramname.indexOf("("));
					for (var j = 0 ; j < paramvalues.length ; j++ ){
						if(device[paramname] ==	paramvalues[j]){		//如果在括号中,改为TRUE
							bIsExist = true;
							break;
						}
					}
					if(!bIsExist){
						device[paramname] = paramvalues[0];	//	默认
					}
					imgpath +=device[paramname]+ "_" ;
				}else {
					if(typeof(device[paramname]) == "undefined" ||device[paramname] == ''){
						continue;
					}
					imgpath +=device[paramname]+ "_" ;
				}
			}
			imgpath = imgpath.substring(0,imgpath.length-1);
			imgpath = imgpath.replace(/_null/g,"");
			if(imgpath.indexOf("10_")>=0 && imgpath.length>4){ //带方向的诱导图标设置为24 硬编码
				device.width = device.height = 24;
			}
			device.imgurl = HiMapConfig.HOSTNAME+"vendor/himap/icons/device/"+imgpath+".png";
		}
    	
		var strcoords = device.longitude+','+device.latitude;
		var monitor = this.showMonitor({strcoords:strcoords,title:device.devicename,imgurl:device.imgurl,width:device.width,height:device.height,centable:device.centable});
		
		//添加点击事件
		monitor.clicklistener = function(){
			if(equipmentinfo == null){
				Tools.sendAjax(HiMapConfig.HOSTNAME+"query/getEquipmentInfo?deviceid="+deviceid+"&pointid="+device.pointid+"&devicetype="+device.devicetype,function(result){
	    			equipmentinfo = result;
	    		});
			}
			currRecord = equipmentinfo.currRecord;
	    	currRecordList = equipmentinfo.recordList;
			if($("#equip_"+device.devicetype).html() == undefined){
				Tools.sendAjax(HiMapConfig.HOSTNAME+"vendor/himap/templates/equip_"+device.devicetype+".html",function(result){
					$(basethis.mapdiv).append(result);
	    		},false,"text");
			}
			var template = Handlebars.compile( $("#equip_"+device.devicetype).html());
	    	monitor.openInfoWindowHtml(template(equipmentinfo));
			
		};
		monitor.addListener("click",monitor.clicklistener);
		monitor.data = device;
		return monitor;
	};
	/**
     * 删除一个叠加到地图上的设备图标
     * @param {(HiDeviceMarker|String)} deviceMonitor 叠加到地图上的设备对象，或者一个具体的设备编号
     * @return {IHiMap}
     */
    HiMap.prototype.removeDevice = function (deviceMonitor) {
    	if(typeof(deviceMonitor == "Object")){
    		this.removeMonitor(deviceMonitor);
    	}
    };

    /**
     * 在地图上叠加自定义图标
     *  @typedef {Object} ShowMonitorParam
     *  @property {String} strcoords 坐标点
     *  @property {String} title 标题
     *  @property {String} imgurl 图标路径
     *  @property {Number} [width] 图标宽度，默认24
     *  @property {Number} [height] 图标高度，默认24
     *  @property {String} [infohtml] 弹出信息框的内容，默认为空,无信息时不弹出
     *  @property {Boolean} [centable] 是否居中展示,默认false
     *  @property {String} [titlebgcolor] 标题背景色,默认白色
     *  @property {Boolean} [showtitle] 是否始终展示标题，默认false，当鼠标移上时展示标题
     *  @property {String} [titlecolor] 标题颜色,默认黑色
     **************************************************
     * @param {ShowMonitorParam} params 参数对象，可选的字段参考ShowDeviceParam定义
     * @return {HiMarker} 返回叠加到地图上的自定义图标对象	
     */
    HiMap.prototype.showMonitor = function(params) {
		
	    if(!checkParam(params,"object")) return;
		if(!checkParam(params.strcoords,"string")) return;
		if(!checkParam(params.title,"string")) return;
		if(!checkParam(params.imgurl,"string")) return;
		params.width = checkParam(params.width,"number") || 24;
		params.height = checkParam(params.height,"number") || 24;
		if(null == params.centable||typeof params.centable != "boolean"){
			params.centable = false;
		}
		params.titlebgcolor = checkParam(params.titlebgcolor,"string") || '#FFFFFF';
		if(null == params.showtitle||typeof params.showtitle != "boolean"){
			params.showtitle = false;
		}
		params.titlecolor = checkParam(params.titlecolor,"string") || '#000000';
		
		var pPoint = params.strcoords.split(",");
        var  x = parseFloat(pPoint[0]);
        var  y = parseFloat(pPoint[1])
		var tempPoint = new HiPoint(x,y);
	
		var tempIcon= new HiIcon();
		tempIcon.setParam("image",params.imgurl);
		tempIcon.setParam("width",params.width);
		tempIcon.setParam("height",params.height);
	
		var tempTitle = new HiTitle(params.title,14,7, 'Microsoft YaHei',params.titlecolor,params.titlebgcolor,'#FFFFFF',1);

		
		if(params.centable == true)
		{
			this.recenterOrPanToLatLng(params.strcoords);
		}
		
		var tempMarker = new HiMarker(tempPoint,tempIcon,tempTitle);
				
		if(params.showtitle == false){
			tempMarker.hideTitle();
			tempMarker.mouseoverlistener = function(){tempMarker.showTitle()};
			tempMarker.mouseoutlistener = function(){tempMarker.hideTitle()};
			tempMarker.addListener("mouseover",tempMarker.mouseoverlistener);
			tempMarker.addListener("mouseout",tempMarker.mouseoutlistener);
		}else{
			tempMarker.showTitle();
		}
		
		tempMarker.clicklistener = function(){tempMarker.openInfoWindowHtml(params.infohtml)};
		if(checkParam(params.infohtml,"string") == params.infohtml){
			tempMarker.addListener("click",tempMarker.clicklistener);
		}
		
		this.addOverlay(tempMarker);//***注意***这里是HiMarker***
		
		return tempMarker;
	
	};
	
	
	
    /**							
     * 删除自定义图标
     * @param {HiMarker} marker
     * @return {IHiMap}
     */
    HiMap.prototype.removeMonitor = function (marker) {
		if(typeof marker.marker !=  "undefined"){
			this.map.removeOverlay(marker.marker);
		}
	};
	
	/**
	*添加自定义矢量图层
	*  @typedef {Object} AddVectorLayerParam
    *  @property {String} lid 图层编号
    *  @property {Array} data 数据,字段:  id title strcoords coordtype markerinfo infohtml imgurl,width,height
    *  @property {String} [imgurl] 图标路径
    *  @property {Number} [width] 图标宽度，默认24
    *  @property {Number} [height] 图标高度，默认24
    *  @property {Number} [tplurl] 模版路径
    *  @property {Number} [tplid]  模版编号
    *  @property {Number} [coordtype] 默认地理形态(1 点 2线 3圆 4矩形 5多边形)
    **************************************************
    * @param {AddVectorLayerParam} params 参数对象，可选的字段参考AddVectorLayerParam定义
    * @return {VectorLayer} 返回叠加到地图上的自定义图标集合	
	**/
	HiMap.prototype.addVectorLayer = function(params){
		try{
			var basethis = this;
			
			var layer = vectorLayerMap.get(params.lid);
			if(layer == null){
				layer = new HiVectorLayer(params);
				vectorLayerMap.put(params.lid,layer);
			}
			params.coordtype = checkParam(params.coordtype,"string") || "1";
			params.width = checkParam(params.width,"number") || "24";
			params.height = checkParam(params.height,"number") || "24";
			
			var tempdata = params.data.concat();
			//循环数据，在地图上展示
			Tools.largeArrayProcess(tempdata,function(markers){
				for(var i=0;i<markers.length;i++){
					var marker = markers[i];
					var coordtype = checkParam(marker.coordtype,"number")?marker.coordtype:params.coordtype;
					if(!checkParam(marker.infohtml,"string") && checkParam(params.tplurl,"string")){
						//根据模版编译弹窗信息
						if($("#tpl_"+params.tplid).html() == undefined){
							Tools.sendAjax(params.tplurl,function(result){
								$(basethis.mapdiv).append(result);
				    		},false,"text");
						}
						var template = Handlebars.compile( $("#tpl_"+params.tplid).html());
				    	marker.infohtml = template(marker);
					}
					if(coordtype == "1"){  //显示marker
						marker.imgurl = checkParam(marker.imgurl,"string")?marker.imgurl:params.imgurl;
						if(marker.imgurl.substring(0,1) == ":"){
							marker.imgurl = HiMapConfig.HOSTNAME+'vendor/himap/icons/layericons/'+marker.imgurl.substring(1);
						}
						marker.width = checkParam(marker.width,"number")?marker.width:params.width;
						marker.height = checkParam(marker.height,"number")?marker.height:params.height;
						marker.ioverlay = _MapApp.showMonitor(marker);
					}else if(marker.coordtype == "2"){ //显示line
						marker.ioverlay = _MapApp.showPolyline(marker);
					}else if(marker.coordtype == "3"){ //显示圆
						marker.ioverlay = _MapApp.showCircle(marker);
					}else if(marker.coordtype == "4"){ //矩形
						marker.ioverlay = _MapApp.showRect(marker);
					}else if(marker.coordtype == "5"){ //显示多边形
						marker.ioverlay = _MapApp.showPolygon(marker);
					}
					layer.addMarker(marker);
				}
			},50);
		}catch(e){
			alert("addVectorLayer接口出错: "+e.message);
		}
	}
	
	HiMap.prototype.removeVectorLayer = function(lid){
		try{
			var layer = vectorLayerMap.get(lid);
			if(layer != null){
				var markers = layer.markers;
				for(var i=0;i<markers.length;i++){
					if(null!=markers[i].ioverlay)
						_MapApp.removeOverlay(markers[i].ioverlay);
				}
				vectorLayerMap.remove(lid);
				layer = null;
			}
		}catch(e){
			alert("removeVectorLayer接口出错: "+e.message);
		}
	}
	/**
	*添加自定义WMS图层
	*  @typedef {Object} AddWMSLayerParam
    *  @property {String} layername  图层名称
    *  @property {String} [url]  wms服务地址
    *  @property {Array}  [cql_filter] 过滤条件
    *  @property {String} [styles]  样式名称
    *  @property {Number} [srs]  坐标系
    *  @property {Number} [refreshtime] 刷新时间 单位毫秒
    **************************************************
    * @param {AddWMSLayerParam} params 参数对象，可选的字段参考AddWMSLayerParam定义
    * @return {HiWMSLayer} 返回叠加到地图上的自定义WMS
	**/
	HiMap.prototype.addWMSLayer = function(params){
		try{
			var layer = new HiWMSLayer(params);
			layer.show(this);
			return layer;
		}catch(e){
			alert("addWMSLayer接口出错: "+e.message);
		}
	}
	
	HiMap.prototype.removeWMSLayer = function(layer){
		layer.close();
	}
	
	/**根据xml展示自定义点,xml格式：
      *<marker id='...'>                    id 为marker 的唯一标识
      *    <title>..</title>                标题
      *    <x>...</x>                       经度			
      *    <y>...</y>                       纬度
      *    <templateid>..</templateid>      模板编号，决定marker的图标和弹出信息窗的内容，在IHiMapConfig.js 文件中定义
	  *    <centable></centable>            是否居中显示，值为true或false。默认为false
      *   <showtitle></showtitle>           是否始终展示标题
      *    <markerinfo>
      *        <...>                        自定义的内容
      *    </markerinfo>
      *</marker>
      */
  	HiMap.prototype.showMonitorByXML = function (strxml) {
		var xmlDoc=null;
		//判断浏览器的类型
		//支持IE浏览器 
		if(!window.DOMParser && window.ActiveXObject){   //window.DOMParser 判断是否是非ie浏览器
			var xmlDomVersions = ['MSXML.2.DOMDocument.6.0','MSXML.2.DOMDocument.3.0','Microsoft.XMLDOM'];
			for(var i=0;i<xmlDomVersions.length;i++){
				try{
					xmlDoc = new ActiveXObject(xmlDomVersions[i]);
					xmlDoc.async = false;
					xmlDoc.loadXML(strxml); //loadXML方法载入xml字符串
					break;
				}catch(e){
				}
			}
		}
		//支持Mozilla浏览器
		else if(window.DOMParser && document.implementation && document.implementation.createDocument){
			try{
				/* DOMParser 对象解析 XML 文本并返回一个 XML Document 对象。
				 * 要使用 DOMParser，使用不带参数的构造函数来实例化它，然后调用其 parseFromString() 方法
				 * parseFromString(text, contentType) 参数text:要解析的 XML 标记 参数contentType文本的内容类型
				 * 可能是 "text/xml" 、"application/xml" 或 "application/xhtml+xml" 中的一个。注意，不支持 "text/html"。
				 */
				domParser = new  DOMParser();
				xmlDoc = domParser.parseFromString(strxml, 'text/xml');
			}catch(e){
			}
		}
		xmlDoc.getElementsByTagName("marker")[0].childNodes[0].getAttribute("id");
		xmlDoc.getElementsByTagName("title")[0].childNodes[0].nodeValue;
		xmlDoc.getElementsByTagName("x")[0].childNodes[0].nodeValue;
		xmlDoc.getElementsByTagName("y")[0].childNodes[0].nodeValue;
		xmlDoc.getElementsByTagName("templateid")[0].childNodes[0].nodeValue;
		xmlDoc.getElementsByTagName("centable")[0].childNodes[0].nodeValue;
		xmlDoc.getElementsByTagName("showtitle")[0].childNodes[0].nodeValue;
		xmlDoc.getElementsByTagName("markerinfo")[0].childNodes[0].nodeValue;
		
		
	};
	
	
	/**
    * 在地图上显示一条线			
    * @typedef {Object} showPolylineParam
    * @property {String} strcoords 坐标点集合
    * @property {String} [infohtml] 点击弹出信息框的内容
    * @property {String} [color] 线的颜色
    * @property {Int} [weight] 线的宽度
    * @property {Float} [opacity] 透明度
    * @property {Int} [arrow] 线的方向 0：无方向（默认）；1：为正方向；-1：为负方向
    * @property {String} [linestyle] 线形 "none"（默认）,"dash","dashdot","dot","longdash","longdashdot","shortdash","shortdashdot","shortdashdotdot","longdashdotdot","shortdot"
    * @property {boolean} [centable] 是否居中，默认不居中
    **************************************************
    * @param {showPolylineParam} params 参数对象，可选的字段参考showPolylineParam定义
    */
	HiMap.prototype.showPolyline = function (params) {
		
		if(!checkParam(params,"object")) return;
		if(!checkParam(params.strcoords,"string")) return;
		params.color = checkParam(params.color,"string")||"gray";
		params.weight = checkParam(params.weight,"number")||3;
		params.opacity = checkParam(params.opacity,"number")||1;
		
		params.arrow = checkParam(params.arrow,"number") || 0;
		params.linestyle = checkParam(params.linestyle,"string") || "none";
		if(null == params.centable||typeof params.centable != "boolean"){
			params.centable = false;
		}
	
		var tempPolyline =  new HiPolyline(params.strcoords,params.color, params.weight, params.opacity, params.arrow);
		
		tempPolyline.setLineStyle(params.linestyle);
		
		if(checkParam(params.infohtml,"string") == params.infohtml){
			tempPolyline.addListener("click",function(){tempPolyline.openInfoWindowHtml(params.infohtml)});
		}
		
		if(params.centable == true){
			this.centerAtMBR(tempPolyline.getMBR());
		}
		
		this.addOverlay(tempPolyline);
		
		return tempPolyline;
		
	};
	
	/**
     * 在地图上显示显示矩形
  	 * @typedef {Object} showRectParam
     * @property {String} strcoords 坐标点集合
     * @property {String} [infohtml] 点击弹出信息框的内容,如果没有则点击没效果
     * @property {String} [color] 边框颜色
     * @property {Int} [weight] 边框宽度
     * @property {Float} [opacity] 透明度
     * @property {String} [fillcolor] 填充颜色
     * @property {boolean} [centable] 是否居中，默认不居中
     **************************************************
     * @param {showRectParam} params 参数对象，可选的字段参考showRectParam定义
	 */
	HiMap.prototype.showRect = function (params) {
		
		if(!checkParam(params,"object")) return;
		if(!checkParam(params.strcoords,"string")) return;
		params.color = checkParam(params.color,"string")||"#0000ff";
		params.weight = checkParam(params.weight,"number")||5;
		params.opacity = checkParam(params.color,"number")||0.45;
		params.fillcolor = checkParam(params.fillcolor,"string")||"red";
		if(null == params.centable||typeof params.centable != "boolean"){
			params.centable = false;
		}
		
		var tempRectangle =  new HiRectangle(params.strcoords,params.color, params.weight, params.opacity, params.fillcolor);
		
		if(checkParam(params.infohtml,"string") == params.infohtml){
			tempRectangle.addListener("click",function(){tempRectangle.openInfoWindowHtml(params.infohtml)});
		}
		
		if(params.centable == true){
			this.centerAtMBR(tempRectangle.getMBR());//-------------------attention**************************
		}
		
		this.addOverlay(tempRectangle);
		
		return tempRectangle;
		
		
	};
	
	
 	/**
     * 在地图上显示显示多边形
  	 * @typedef {Object} showPolygonParam
     * @property {String} strcoords 坐标点集合
     * @property {String} [infohtml] 点击弹出信息框的内容,如果没有则点击没效果
     * @property {String} [color] 边框颜色
     * @property {Int} [weight] 边框宽度
     * @property {Float} [opacity] 透明度
     * @property {String} [fillcolor] 填充颜色
     * @property {boolean} [centable] 是否居中，默认不居中
     **************************************************
     * @param {showPolygonParam} params 参数对象，可选的字段参考showPolygonParam定义
     */
	HiMap.prototype.showPolygon = function (params) {
		
		if(!checkParam(params,"object")) return;
		if(!checkParam(params.strcoords,"string")) return;
		params.color = checkParam(params.color,"string")||"#0000ff";
		params.weight = checkParam(params.weight,"number")||5;
		params.opacity = checkParam(params.color,"number")||0.45;
		params.fillcolor = checkParam(params.fillcolor,"string")||"red";
		if(null == params.centable||typeof params.centable != "boolean"){
			params.centable = false;
		}
		
		var tempPolygon = new HiPolygon(params.strcoords,params.color, params.weight, params.opacity, params.fillcolor);
		
		if(checkParam(params.infohtml,"string") == params.infohtml){
			tempPolygon.addListener("click",function(){tempPolygon.openInfoWindowHtml(params.infohtml)});
		}
		
		if(params.centable == true){
			this.centerAtMBR(tempPolygon.getMBR());
		}
		
		this.addOverlay(tempPolygon);
		
		return tempPolygon;
		
	};
	
	/**
     * 在地图上显示显示圆
 	 * @typedef {Object} showCircleParam
     * @property {String} strcoords 由 X 坐标、Y 坐标、半径组成坐标序列， 中间用","隔开，如"x1,y1,r"
     * @property {String} [infohtml] 点击弹出信息框的内容,如果没有则点击没效果
     * @property {String} [color] 边框颜色
     * @property {Int} [weight] 边框宽度
     * @property {Float} [opacity] 透明度
     * @property {String} [fillcolor] 填充颜色
     * @property {boolean} [centable] 是否居中，默认不居中
     **************************************************
     * @param {showCircleParam} params 参数对象，可选的字段参考showCircleParam定义
     */
	HiMap.prototype.showCircle = function (params) {
		
		if(!checkParam(params,"object")) return;
		if(!checkParam(params.strcoords,"string")) return;
		params.color = checkParam(params.color,"string")||"#0000ff";
		params.weight = checkParam(params.weight,"number")||5;
		params.opacity = checkParam(params.color,"number")||0.45;
		params.fillcolor = checkParam(params.fillcolor,"string")||"red";
		if(null == params.centable||typeof params.centable != "boolean"){
			params.centable = false;
		}
		
		var tempCircle = new HiCircle(params.strcoords,params.color, params.weight, params.opacity, params.fillcolor);
		
		if(checkParam(params.infohtml,"string") == params.infohtml){
			tempCircle.addListener("click",function(){tempCircle.openInfoWindowHtml(params.infohtml)});
		}
		
		if(params.centable == true){
			this.recenterOrPanToLatLng(tempCircle.getCenter());
		}
		
		this.addOverlay(tempCircle);
		return tempCircle;
		
	};
	
	/**
     * 在地图上显示显示标题
 	 * @typedef {Object} showTitleParam
     * @property {String} name 标题
     * @property {String} strcoords 标题坐标
     * @property {String} [fontSize] 字号
     * @property {String} [pos] 位置
     * @property {Int} [font] 字体
     * @property {Float} [color] 颜色
     * @property {String} [bgcolor] 填充颜色
     * @property {boolean} [bordercolor] 边框颜色 
     * @property {boolean} [borderSize] 边框大小
     **************************************************
     * @param {showTitleParam} params 参数对象，可选的字段参考showTitleParam定义
     */
	HiMap.prototype.showTitle = function (params) {
		if(!checkParam(params,"object")) return;
		if(!checkParam(params.name,"string")) return;
		if(!checkParam(params.strcoords,"")) return;
		
		params.fontSize = checkParam(params.fontSize,"number")||12;
		params.pos = checkParam(params.pos,"number")||7;
		params.font = checkParam(params.font,"string")||"宋体";
		params.color = checkParam(params.color,"string")||"WHITE";
		params.bgcolor = checkParam(params.bgcolor,"string")||"#015190";
		params.bordercolor = checkParam(params.bordercolor,"string")||"red";
		params.borderSize = checkParam(params.borderSize,"number")||1;
		
		var tempTitle = new HiTitle(params.name,params.fontSize,params.pos,params.font,params.color,params.bgcolor,params.bordercolor,params.borderSize);
		if(typeof(params.strcoords) == "string"){
			tempTitle.setPoint(new HiPoint(params.strcoords.split(",")[0],params.strcoords.split(",")[1]));
		}else{
			tempTitle.setPoint(params.strcoords);
		}
		_MapApp.addOverlay(tempTitle);
		return tempTitle;
		
	};
	
	
    
	
	if(null!=config.MAPREADY){
		try{
			eval(config.MAPREADY+"()");
		}catch(a){
			alert("回调函数执行出错:"+a.message);
		}
	}
	
});

//加载模块js对应的文件
function loadmodule(modulepath,modulename,callback){
	modulepath = modulepath.replace("mapmgr/jsp/js/interact/",rootpath+"modules/index/js/");
	require([modulepath+'/'+modulename],function(module){
		window[modulename] = module;
      	window.parent.window[modulename] = module;
      	if(typeof(callback)!='undefined'){
 			callback.call(module);
      	}
	});
}


  


  
