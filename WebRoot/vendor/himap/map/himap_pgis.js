/**
 * Created by liuxiaobing on 2016-1-5.
 */
define(["jquery","map/Config","map/IHiMap","tool/tools","overlay/HiIcon",
		"overlay/HiMarker","overlay/HiMBR","overlay/HiOverlay",
		"overlay/HiPoint","overlay/HiPolygon","overlay/HiPolyline",
		"overlay/HiRect","overlay/HiTitle","../handlebar/handlebars","overlay/HiCircle","overlay/HiRectangle"], 
		function($,CONFIG,HiMap,Tools,HiIcon,HiMarker,HiMBR,HiOverlay,
				 HiPoint,HiPolygon,HiPolyline,HiRect,HiTitle,Handlebars,HiCircle,HiRectangle) {
    
    var checkParam = Tools.checkParam;
    
    Handlebars.registerHelper("shotparam",function(param,options){
    	var length = options.hash.shotlength;
    	if(param.length>length){
    		param = param.substring(0,length)+"...";
    	}
    	return param;
    });
    
    HiMap.prototype.init = function(mapdiv,mapInitParams){
    	this.mapdiv = mapdiv;
		this.mapInitParams = mapInitParams;
        
		this.map = new EzMap(mapdiv);
		this.map.hideCopyright();
        this.map.hideMapControl();
        this.map.hideMapServer();  
        
        //重定义窗口样式
        ti = HiMapConfig.HOSTNAME+"vendor/himap/icons/pgisimg/iw_nw.png";
        Wh = HiMapConfig.HOSTNAME+"vendor/himap/icons/pgisimg/iw_n.png";
        ji = HiMapConfig.HOSTNAME+"vendor/himap/icons/pgisimg/iw_ne.png";
        ng = HiMapConfig.HOSTNAME+"vendor/himap/icons/pgisimg/iw_se.png";
        vi = HiMapConfig.HOSTNAME+"vendor/himap/icons/pgisimg/iw_sw.png";
        Di = HiMapConfig.HOSTNAME+"vendor/himap/icons/pgisimg/close.png";   
        this.map.map.infoWindow = new InfoWind(this.map.map.eventHandler("onInfoCloseClick"), this.map.map.div, 5000, 2000);  
        
        //重定义窗口的关闭事件，只有左键点击才关闭窗口
		InfoWind.prototype.onCloseMouseDown = function (b) {
		    S(b);
		    if (this.oncloseclick && b.button == "1") { //只有左键点击才关闭窗口
		        this.oncloseclick(b)
		    }
		};
    }

	HiMap.prototype.zoomIn = function(){
		this.map.zoomIn();
	};
	
	//拉框放大	
	HiMap.prototype.zoomInExt = function(){
		this.map.zoomInExt();
	};
	
    //缩小	
    HiMap.prototype.zoomOut = function(){
		this.map.zoomOut();
	};
	
    //拉框缩小	
    HiMap.prototype.zoomOutExt = function(){
		this.map.zoomOutExt();
	};
	
    //参数为空的情况下设置平移状态,如果存在参数x,y,则相应向X,Y方向进行移动		
    HiMap.prototype.pan = function(x,y){
		this.map.pan(x,y);
	};
	
    //测距离		
    HiMap.prototype.measureLength = function(callback){
		this.map.measureLength(callback);
	};
    //测面积		
    HiMap.prototype.measureArea = function(callback){
		this.map.measureArea(callback);
	};
	
    //全图显示.				
    HiMap.prototype.fullExtent = function(){
		this.map.fullExtent();
	};
	
    //对中			
    HiMap.prototype.gotoCenter = function(){
		this.map.gotoCenter();
	};
	
    //打印			
    HiMap.prototype.print = function(){
		this.map.print();
	};
	
    //清除		
    HiMap.prototype.clear = function(){
		this.map.clear();
	};
	
    //地图对中到给定的点	
    HiMap.prototype.centerAtLatLng = function(x,y){
		this.map.centerAtLatLng(x,y);
	};
	
    //对中到给定的坐标，如果该点在当前视图上，则进行平移到该点为地图中心.		
    HiMap.prototype.recenterOrPanToLatLng = function(latLng){
	    var pPoint = null;
	      	
	    if (latLng instanceof Point) {
	        pPoint = latLng;
	    } else if (arguments.length == 1 && typeof arguments[0] == "string") {
	        pPoint = new Point(latLng);
	    }
	    this.map.recenterOrPanToLatLng(pPoint);
	    pPoint = null;
	};
	
     //缩放到给定的级别		
     HiMap.prototype.zoomTo = function(zoomLevel){
     	this.map.zoomTo(zoomLevel);
     };
	
    //对指定的范围进行地图对中			
    HiMap.prototype.centerAtMBR = function(dInMinX,dInMinY,dInMaxX,dInMaxY){
		if (arguments.length == 1 && dInMinX instanceof MBR) {
			var pMBR = dInMinX;
			this.map.centerAtMBR(pMBR.minX, pMBR.minY, pMBR.maxX, pMBR.maxY);
		}else{
			this.map.centerAtMBR(dInMinX, dInMinY, dInMaxX, dInMaxY);
		}
	};
	
    /**									
     * 地图定位，同 moveTo
     * @param {(String|HiPoint)} strCoords 地图中心点
     * @param {Number} [zoomlevel]	地图显示级别
     * @return {IHiMap}
     */
    HiMap.prototype.centerAndZoom  = function(latLng, zoomLevel){
		var tempPoint = null;
	      	// typeof bIsInScreen == "object"
	      	// instanceof Point   
	    if (latLng instanceof HiPoint) {
	        tempPoint = latLng;
	    } else if (arguments.length == 2 && typeof arguments[0] == "string") {
	        tempPoint = new Point(latLng);
	    }
		this.map.centerAndZoom(tempPoint, zoomLevel);
	    tempPoint = null;
		return this;
	};
	
	/**		
     * 地图定位，同 centerAndZoom
     * @param {(String|HiPoint)} strCoords 地图中心点
     * @param {Number} [zoomlevel]	地图显示级别
     * @return {IHiMap}
     */
    HiMap.prototype.moveTo = function (strCoords,zoomlevel){
		this.centerAndZoom(strCoords,zoomlevel);
		return this;
	};
	
    //在指定的位置显示信息		
    HiMap.prototype.openInfoWindow = function(pPoint,html){
		this.map.openInfoWindow(pPoint,html);
	};
	
    //返回地图中心的坐标，类型为Point	
    HiMap.prototype.getCenterLatLng = function(){
		return this.map.getCenterLatLng();
	};
    //返回当前视窗的经纬度边框.类型:HiMBR				*******************attention**************************
    HiMap.prototype.getBoundsLatLng = function(){
		var mbr = this.map.getBoundsLatLng();
		return new HiMBR(mbr.minX,mbr.minY,mbr.maxX,mbr.maxX);
		//return this.map.getBoundsLatLng();
	};

    //返回地图的当前级别，返回类型为int		
    HiMap.prototype.getZoomLevel = function(){
		return this.map.getZoomLevel();
	};
	
    //返回地图的最大级别，返回类型为int		
    HiMap.prototype.getMaxLevel = function(){
		return this.map.getMaxLevel();
	};
	
    //获取指定的范围的级别，返回类型为int	
    HiMap.prototype.getLevelOfMBR = function(dInMinX,dInMinY,dInMaxX,dInMaxY){
		if (arguments.length == 1 && dInMinX instanceof MBR) {
			var pMBR = dInMinX;
			return this.map.getLevelOfMBR(pMBR.minX, pMBR.minY, pMBR.maxX, pMBR.maxY);
		}else{
			return this.map.getLevelOfMBR(dInMinX,dInMinY,dInMaxX,dInMaxY);
		}
	};
	
    //获取当前绘制模式,字符串	
    HiMap.prototype.getDragMode = function(){
		return this.map.getDragMode();
	};
	
    /**		
     * 改变操作模式
     * @param {String} drawmode 操作模式 可用的有：
     " measure":测量 "pan":平移模式 “drawPoint”：获取坐标点 “drawCircle”：画圆 “drawRect”：画矩形 “drawPolyline”：画线 “drawPolygon”：画多边型 
     * @param {Function} [callback]	回调函数
     */
    HiMap.prototype.changeDragMode = function(drawmode,callback){
		this.map.changeDragMode(drawmode,null,null,callback);
	};
	
    /**
     * 在当前地图上加入给定的对象			
     * @param {HiOverlay} overlay 对象
     * @return {IHiMap}
     */
    HiMap.prototype.addOverlay = function (overlay){
		this.map.addOverlay(overlay);
		return this;
	};
	
    //在地图上删除给定的对象		
    HiMap.prototype.removeOverlay = function (overlay){
		this.map.removeOverlay(overlay);
	};
	
    //在地图上清除所有的对象.		
    HiMap.prototype.clearOverlays = function (){
		this.map.clearOverlays();
	};
	
    //返回信息叠加类，iOverLay对象的数组
    HiMap.prototype.getOverlays = function (){
		return this.map.getOverlays();
	};
	
    //获取当前编辑的信息对象。iOverLay对象类型
    HiMap.prototype.getCurrentEditor = function (){
		return this.map.getCurrentEditor();
	};
	
    //增加地图状态变化时执行的操作，func为函数		
    HiMap.prototype.addMapChangeListener = function (func){
		this.map.addMapChangeListener(func);
	};
	
    //删除地图状态变化时执行的操作，func为函数
    HiMap.prototype.removeMapChangeListener = function (func){
		this.map.removeMapChangeListener(func);
	};
	      
    /**							
     * 清空地图
     * @return {IHiMap}
     */
    HiMap.prototype.clearMap = function (){
		this.map.clear();
		return this;
	};
	
    /**
     * 设置地图中心点
     * @param {(String|HiPoint)} strCoords
     * @return {IHiMap}
     */
    HiMap.prototype.setCenter = function (strCoords) {
		this.recenterOrPanToLatLng(strCoords);
	};
	
    /**
     * 画点						
     * @param {function(String)} [callback] 回调函数
     * @return {IHiMap}
     */
    HiMap.prototype.drawPoint = function (callback) {
		this.map.changeDragMode("drawPoint",null,null,callback);
		return this;
	};
	
    /**
     * 画矩形					
     * @param {function(String)} [callback] 回调函数
     * @return {IHiMap}
     */
    HiMap.prototype.drawRect = function (callback) {
		this.map.changeDragMode("drawRect",null,null,callback);
		return this;
	};
	
    /**
     * 画圆						
     * @param {function(String)} [callback] 回调函数
     * @return {IHiMap}
     */
    HiMap.prototype.drawCircle = function (callback) {
		this.map.changeDragMode("drawCircle",null,null,callback);
		return this;
	};
	
    /**
     * 画线						
     * @param {function(String)} [callback] 回调函数
     * @return {IHiMap}
     */
    HiMap.prototype.drawPolyline = function (callback) {
		this.map.changeDragMode("drawPolyline",null,null,callback);
		return this;
	};
	
    /**							
     * 画多边形
     * @param {function(String)} [callback] 回调函数
     * @return {IHiMap}
     */
    HiMap.prototype.drawPolygon = function (callback) {
		this.map.changeDragMode("drawPolygon",null,null,callback);
		return this;
	};
		
    /**
     *在地图上叠加一个设备图标
     *  @typedef {Object} ShowDeviceParam
     *  @property {String} deviceid 设备编号
     *  @property {String} devicetype 设备类型
     *  @property {String} iconurl 设备图标
     *  @property {Boolean} [centable] 是否居中展示,默认false
     *************************************************
     * @param {ShowDeviceParam|String} params 参数对象，可选的字段参考ShowDeviceParam定义
     * @return H 返回叠加到地图上的设备对象
     */
    HiMap.prototype.showDevice = function (device) {
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
    		deviceid = device.deviceid;
    	}
    	if(needajax){
    		Tools.sendAjax(HiMapConfig.HOSTNAME+"query/getEquipmentInfo?deviceid="+deviceid,function(result){
    			equipmentinfo = result;
    			device = $.extend(result.currRecord,device);
    		});
    	}
			
		//计算图标
		if(!checkParam(device.iconurl,"string")){
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
			device.iconurl = HiMapConfig.HOSTNAME+"vendor/himap/icons/device/"+imgpath+".png";
		}
    	
		var strcoords = device.longitude+','+device.latitude;
		var monitor = this.showMonitor({strcoords:strcoords,title:device.devicename,imgurl:device.iconurl,centable:device.centable});
		monitor.clicklistener = function(){
			if(equipmentinfo == null){
				Tools.sendAjax(HiMapConfig.HOSTNAME+"query/getEquipmentInfo?deviceid="+deviceid,function(result){
	    			equipmentinfo = result;
	    		});
			}
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
    HiMap.prototype.removeDevice = function (deviceMonitor) {};

    /**
     * 在地图上叠加自定义图标
     *  @typedef {Object} ShowMonitorParam
     *  @property {String} strcoords 坐标点
     *  @property {String} title 标题
     *  @property {String} imgurl 图标路径
     *  @property {Number} [width] 图标宽度，默认24
     *  @property {Number} [height] 图标高度，默认24
     *  @property {String} [infowindow] 弹出信息框的内容，默认为空,无信息时不弹出
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
		
		//params.infowindow = checkParam(params.infowindow,"string") || "";
		
		if(null == params.centable||typeof params.centable != "boolean"){
			params.centable = false;
		}
		
		params.titlebgcolor = checkParam(params.titlebgcolor,"string") || "white";
		
		if(null == params.showtitle||typeof params.showtitle != "boolean"){
			params.showtitle = false;
		}
		
		params.titlecolor = checkParam(params.titlecolor,"string") || "black";
		
		
		var pPoint = params.strcoords.split(",");
        var  x = parseFloat(pPoint[0]);
        var  y = parseFloat(pPoint[1])
		var tempPoint = new HiPoint(x,y);
		
		
	
		var tempIcon= new HiIcon();
		tempIcon.setParam("image",params.imgurl);
		tempIcon.setParam("width",params.width);
		tempIcon.setParam("height",params.height);
	
	
		var tempTitle = new HiTitle(params.title);
		tempIcon.setParam("color",params.titlecolor);
		tempIcon.setParam("bgColor",params.titlebgcolor);
		
		if(params.centable == true)
		{
			this.recenterOrPanToLatLng(params.strcoords);
		}
		
		var tempMarker = new HiMarker(tempPoint,tempIcon,tempTitle);
		
		if(params.showtitle == false){
			tempMarker.hideTitle();
			tempMarker.addListener("mouseover",function(){tempMarker.showTitle()});
			tempMarker.addListener("mouseout",function(){tempMarker.hideTitle()});
		}else{
			tempMarker.showTitle();
		}
		
		if(checkParam(params.infowindow,"string") == params.infowindow){
			tempMarker.addListener("click",function(){tempMarker.openInfoWindowHtml(params.infowindow)});
		}
		
		this.addOverlay(tempMarker.marker);//***注意***这里是HiMarker***
		
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
    * @property {String} strCoords 坐标点集合
    * @property {String} infohtml 点击弹出信息框的内容
    * @property {String} color 线的颜色
    * @property {Int} weight 线的宽度
    * @property {Float} opacity 透明度
    * @property {Int} arrow 线的方向 0：无方向（默认）；1：为正方向；-1：为负方向
    * @property {String} linestyle 线形 "none","dash","dashdot","dot","longdash","longdashdot","shortdash","shortdashdot","shortdashdotdot","longdashdotdot","shortdot"
    * @property centable 是否居中，默认居中
    **************************************************
    * @param {showPolylineParam} params 参数对象，可选的字段参考showPolylineParam定义
    */
	HiMap.prototype.showPolyline = function (params) {
		
		if(!checkParam(params,"object")) return;
		
		if(!checkParam(params.strCoords,"string")) return;
		
		//if(!checkParam(params.infohtml,"string")) return;
		
		if(!checkParam(params.color,"string")) return;
		
		//因为如果参数为0时，同样会return掉，故未使用(!checkParam(params.color,"string"))方法判断
		if(typeof checkParam(params.weight,"number") != "number") return;
		
		if(typeof checkParam(params.opacity,"number") != "number") return;
	
		//if(typeof checkParam(params.arrow,"number") != "number")return;
		params.arrow = checkParam(params.arrow,"number") || 0;
		
		params.linestyle = checkParam(params.linestyle,"string") || "none";
		
		if(null == params.centable||typeof params.centable != "boolean"){
			params.centable = true;
		}
	
		var tempPolyline =  new HiPolyline(params.strCoords,params.color, params.weight, params.opacity, params.arrow);
		
		tempPolyline.setLineStyle(params.linestyle);
		
		if(checkParam(params.infohtml,"string") == params.infohtml){
			tempPolyline.addListener("click",function(){tempPolyline.openInfoWindowHtml(params.infohtml)});
		}
		
		if(params.centable == true){
			this.centerAtMBR(tempPolyline.getMBR());
		}
		
		this.addOverlay(tempPolyline.polyline);
		
		return tempPolyline;
		
	};
	
	/**
     * 在地图上显示显示矩形
  	 * @typedef {Object} showRectParam
     * @property {String} strCoords 坐标点集合
     * @property {String} infohtml 点击弹出信息框的内容
     * @property {String} color 边框颜色
     * @property {Int} weight 边框宽度
     * @property {Float} opacity 透明度
     * @property {String} fillcolor 填充颜色
     * @property centable 是否居中，默认居中
     **************************************************
     * @param {showRectParam} params 参数对象，可选的字段参考showRectParam定义
	       */
	HiMap.prototype.showRect = function (params) {
		
		if(!checkParam(params,"object")) return;
		
		if(!checkParam(params.strCoords,"string")) return;
	
		if(!checkParam(params.color,"string")) return;
		
		if(typeof checkParam(params.weight,"number") != "number") return;
	
		if(typeof checkParam(params.opacity,"number") != "number") return;
			
		if(!checkParam(params.fillcolor,"string")) return;
		
		if(null == params.centable||typeof params.centable != "boolean"){
			params.centable = true;
		}
		
		var tempRectangle =  new HiRectangle(params.strCoords,params.color, params.weight, params.opacity, params.fillcolor);
		
		if(checkParam(params.infohtml,"string") == params.infohtml){
			tempRectangle.addListener("click",function(){tempRectangle.openInfoWindowHtml(params.infohtml)});
		}
		
		if(params.centable == true){
			this.centerAtMBR(tempRectangle.rectangle.getMBR());//-------------------attention**************************
		}
		
		this.addOverlay(tempRectangle.rectangle);
		
		return tempRectangle;
		
		
	};
	
	
 	/**
     * 在地图上显示显示多边形
  	 * @typedef {Object} showPolygonParam
     * @property {String} strCoords 坐标点集合
     * @property {String} infohtml 点击弹出信息框的内容
     * @property {String} color 边框颜色
     * @property {Int} weight 边框宽度
     * @property {Float} opacity 透明度
     * @property {String} fillcolor 填充颜色
     * @property centable 是否居中，默认居中
     **************************************************
     * @param {showPolygonParam} params 参数对象，可选的字段参考showPolygonParam定义
     */
	HiMap.prototype.showPolygon = function (params) {
		
		if(!checkParam(params,"object")) return;
		
		if(!checkParam(params.strCoords,"string")) return;
		
		if(!checkParam(params.color,"string")) return;
		
		if(typeof checkParam(params.weight,"number") != "number") return;
		
		if(typeof checkParam(params.opacity,"number") != "number") return;
		
		if(!checkParam(params.fillcolor,"string")) return;
		
		if(null == params.centable||typeof params.centable != "boolean"){
			params.centable = true;
		}
		
		var tempPolygon = new HiPolygon(params.strCoords,params.color, params.weight, params.opacity, params.fillcolor);
		
		if(checkParam(params.infohtml,"string") == params.infohtml){
			tempPolygon.addListener("click",function(){tempPolygon.openInfoWindowHtml(params.infohtml)});
		}
		
		if(params.centable == true){
			this.centerAtMBR(tempPolygon.getMBR());
		}
		
		this.addOverlay(tempPolygon.polygon);
		
		return tempPolygon;
		
	};
	
    /**				
     * 波纹效果
     *strCoords 中心点
     *radius 半径
     */
    HiMap.prototype.showWave = function (strCoords, radius) {
		
		var aradius = radius||500;
		var pPoints = strCoords+","+this.changeMeterToDegree(strCoords,aradius);
		var pPoints1 =  strCoords+","+this.changeMeterToDegree(strCoords,aradius);
		var pCircle = new Circle(pPoints, "", 2, 0.5, "white");
		var pCircle1 = new Circle(pPoints1, "", 2, 0.5, "white");
		this.map.addOverlay(pCircle);
		this.map.addOverlay(pCircle1);
		pCircle.setExtendStatus(1,50,1,4);
		pCircle.setInterval(10);
		pCircle.play();
	
		pCircle1.setExtendStatus(1,50,1,4);
		pCircle1.setInterval(10);					
		setTimeout(function(){pCircle1.play();},400);
		var pme = this;			//***注意***闭包***闭包	就是 能够读取 其他函数内部变量 的函数；
	
		setTimeout(function(){pme.removeOverlay(pCircle);},1000);
		setTimeout(function(){pme.removeOverlay(pCircle1);},1100);
	};
	
	 /**
     * 在地图上显示显示多边形
 	 * @typedef {Object} showCircleParam
     * @property {String} strCoords 由 X 坐标、Y 坐标、半径组成坐标序列， 中间用","隔开，如"x1,y1,r"
     * @property {String} infohtml 点击弹出信息框的内容
     * @property {String} color 边框颜色
     * @property {Int} weight 边框宽度
     * @property {Float} opacity 透明度
     * @property {String} fillcolor 填充颜色
     * @property centable 是否居中，默认居中
     **************************************************
     * @param {showCircle} params 参数对象，可选的字段参考showCircle定义
     */
	HiMap.prototype.showCircle = function (params) {
		
		if(!checkParam(params,"object")) return;
		
		if(!checkParam(params.strCoords,"string")) return;
		
		//if(!checkParam(params.infohtml,"string")) return;
		
		if(!checkParam(params.color,"string")) return;
		
		if(typeof checkParam(params.weight,"number") != "number") return;
		
		if(typeof checkParam(params.opacity,"number") != "number") return;
		
		if(!checkParam(params.fillcolor,"string")) return;
					
		if(null == params.centable||typeof params.centable != "boolean"){
			params.centable = true;
		}
		
		var tempCircle = new HiCircle(params.strCoords,params.color, params.weight, params.opacity, params.fillcolor);
		
		if(checkParam(params.infohtml,"string") == params.infohtml){
			tempCircle.addListener("click",function(){tempCircle.openInfoWindowHtml(params.infohtml)});
		}
		
		if(params.centable == true){
			this.recenterOrPanToLatLng(tempCircle.getCenter());
		}
		
		this.addOverlay(tempCircle.circle);
		return tempCircle;
		
	};
	
    //判断两个坐标点之间的距离 单位米	
    HiMap.prototype.getDistanceInLL = function (str1, str2) {
		var point1 = new Point(str1.split(",")[0],str1.split(",")[1]);
		var point2 = new Point(str2.split(",")[0],str2.split(",")[1]);
		return GetDistanceInLL(point1,point2);
	};
	
    //将米转换成经纬度			
    HiMap.prototype.changeMeterToDegree = function (strCoords, distance) {
		var point = new Point(strCoords.split(",")[0],strCoords.split(",")[1]);
		var degree = this.map.getDegree(point,distance);
		return degree;
	};
	
    /**地图打印方法
     *urlCSS 页眉页脚路径
     *strTitle 页眉文字内容
     *strBottom 页脚文字内容
     *
     */
    HiMap.prototype.printmap = function (urlCSS, strTitle, strBottom) {
		this.map.print(urlCSS, strTitle, strBottom);
	};

    
	HiPoint.prototype.init = function(x,y){
		this.point = new Point(x,y);
	};
	/**
	 * 判断2点是否大概相等
	 * @param hiPoint
	 * @return {Boolean}
	 */
	HiPoint.prototype.approxEquals = function(hiPoint){
		this.point.approxEquals(hiPoint.point);
	};

	/**
	 * 判断2点是否相等
	 * @param hiPoint
	 * @return {Boolean}
	 */
	HiPoint.prototype.equals= function(hiPoint){
		this.point.equals(hiPoint.point);
	};
//problem
	HiIcon.prototype.init = function(image,width,height,leftOffset,topOffset){
		this.icon = new Icon();
		
		//图片名称
		if(typeof image == "string"){
			this.icon.image =image;
		}
		
		//图片宽度
		if(!isNaN(width)){
			this.icon.width = width;
		}
		
		//图片高度
		if(!isNaN(height)){
			this.icon.height = height;
		}
		
		if(!isNaN(leftOffset)){
			this.icon.leftOffset = leftOffset;
		}
		
		if(!isNaN(topOffset)){
			this.icon.topOffset = topOffset;
		}
	}
	HiIcon.prototype.setParam = function(paramname,paramvalue){
		this[paramname] = paramvalue;
		this.icon[paramname] = paramvalue;
	}

	HiTitle.prototype.init = function(name,fontSize,pos,font,color,bgColor){
		this.title = new Title(name,fontSize,pos,font,color,bgColor);
		if(typeof name == "string"){
			this.title.name = name;
		}
		
		if(!isNaN(fontSize)){
			this.title.fontSize = fontSize;
		}
		
		if(!isNaN(pos)){
			this.title.pos = pos;
		}
		
		if(typeof color == "string"){
			this.title.color = color;
		}
		
		if(typeof bgColor == "string"){
			this.title.bgColor = bgColor;
		}
		
	}
	
	HiTitle.prototype.setParam = function(paramname,paramvalue){
		this[paramname] = paramvalue;
		this.icon[paramname] = paramvalue;
	}
	
	//设置图标显示位置
	HiTitle.prototype.setPoint = function(pPoint){
		this.point = pPoint;
		this.title.setPoint(pPoint.point);
	}
	
	//获取其位置，类型为HiPoint
	HiTitle.prototype.getPoint = function(){
		return this.point;
	}
	
	HiMarker.prototype.init = function(point,icon,title){
		this.marker = new Marker(point.point,icon.icon,title.title);
	}
	//显示信息筐
	HiMarker.prototype.openInfoWindowHtml= function (htmlStr){
		this.marker.openInfoWindowHtml(htmlStr);
	};

	//加入事件，其中action为字符型,可以是如下:
	//'click'：点击
	//'dblclick'：双击
	//'mouseover'：鼠标在上面移动
	//'mouseout'：鼠标移出
	HiMarker.prototype.addListener= function (action,fuct){
		this.marker.addListener(action,fuct);	
	};

    //获取当前的图层序列
    HiMarker.prototype.getZIndex= function (){
		return this.marker.getZIndex();
	};

    //设置图层系列
    HiMarker.prototype.setZIndex= function (int){
		this.marker.setZIndex();
	};

    //显示标题
    HiMarker.prototype.showTitle= function (){
		this.marker.showTitle();
	};

    //隐藏标题
    HiMarker.prototype.hideTitle= function (){
		this.marker.hideTitle();
	};

    //设置图标显示位置
    HiMarker.prototype.setPoint= function (pPoint){
		this.marker.setPoint(pPoint.point);
	};

    //获取其位置，类型为Point
    HiMarker.prototype.getPoint= function (){
		return this.point;
	}
	
	HiMBR.prototype.init = function(minX,minY,maxX,maxY){
		this.mbr = new MBR(minX,minY,maxX,maxY);
	}
	
	//获取MBR的中心点;Point类型
	HiMBR.prototype.centerPoint = function(){
		return this.mbr.centerPoint();
	};
	
	//获取X方向的跨度
	HiMBR.prototype.getSpanX = function(){
		return this.mbr.getSpanX();
	};
	//获取Y方向的跨度
	HiMBR.prototype.getSpanY = function(){
		return this.mbr.getSpanY();
	};
	//E为小数:0~10
	//MBR中心扩大其边框
	HiMBR.prototype.scale = function(e){
		this.mbr.scale(e);
	};
	
	//是否包含pMBR，返回类型：boolean
	HiMBR.prototype.containsBounds = function(pMBR){
		return this.mbr.containsBounds(pMBR);
	};
	
	//是否包含点，返回类型：boolean
	HiMBR.prototype.containsPoint = function(point){
		return this.mbr.containsPoint(point);
	};
	
	//拓展边界，参数可以是Point或MBR类型，返回类型：无
	HiMBR.prototype.extend = function(pMBR){
		this.mbr.extend(pMBR);
	};
	
	//返回指定的2个MBR对象的相交部分的MBR，返回类型MBR
	HiMBR.prototype.Intersection = function(pMBR1,pMBR2){
		return this.mbr.Intersection(pMBR1,pMBR2);
	};
	
	//返回指定的2个MBR对象的并集部分的MBR，返回类型MBR
	HiMBR.prototype.union = function(pMBR1,pMBR2){
		return this.mbr.union(pMBR1,pMBR2);
	};
	
	//获取其中心点，返回类型为:Point
	HiMBR.prototype.getCenterPoint = function(){
		return this.mbr.getCenterPoint();
	};
	
	HiPolyline.prototype.init= function(points, color, weight, opacity,arrow){
		this.polyline = new Polyline(points, color, weight, opacity,arrow);
	}
	
	HiPolygon.prototype.init = function(points, color, weight, opacity, fillcolor){
		this.polygon = new Polygon(points, color, weight, opacity, fillcolor);
	}
	
	HiCircle.prototype.init = function(points, color, weight, opacity, fillcolor){
		this.circle = new Circle(points, color, weight, opacity, fillcolor);
	};
	
	HiRectangle.prototype.init = function(points, color, weight, opacity, fillcolor){
		this.rectangle = new Rectangle(points, color, weight, opacity, fillcolor);
	};
	
	
	
	
    return HiMap;

});