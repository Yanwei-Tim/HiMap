/**
 * Created by liuxiaobing on 2016-1-5.
 */
/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([
		"./IHiMap","./../overlay/HiPolygon","./../overlay/HiPolyline",
		"./../overlay/HiRectangle","./../overlay/HiCircle","./../overlay/HiIcon",
		"./../overlay/HiTitle","./../overlay/HiMarker","./../overlay/HiPoint","./../overlay/HiMBR",
		
		"esri/map","esri/toolbars/draw", "esri/geometry/Point","esri/geometry/Polygon",
		"esri/layers/ArcGISTiledMapServiceLayer",
        "esri/symbols/PictureMarkerSymbol","esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol","esri/SpatialReference","esri/symbols/CartographicLineSymbol", "esri/dijit/InfoWindowLite","esri/dijit/OverviewMap","esri/geometry/Polyline", "esri/geometry/Circle","esri/Color", "esri/symbols/SimpleMarkerSymbol",
        "esri/symbols/Font","esri/symbols/TextSymbol","esri/InfoWindowBase",
        "esri/graphic","esri/InfoTemplate","esri/domUtils",
        "esri/geometry/Extent","esri/geometry/webMercatorUtils","dojo/dom-construct",
        "dojo/dom", "dojo/on", "dojo/domReady!"], function(
			HiMap,HiPolygon,HiPolyline,HiRectangle,HiCircle,HiIcon,HiTitle,HiMarker,
			HiPoint,HiMBR,
			Map,Draw, Point,Polygon,
            ArcGISTiledMapServiceLayer,
            PictureMarkerSymbol,SimpleFillSymbol,
            SimpleLineSymbol,SpatialReference,CartographicLineSymbol,InfoWindowLite,OverviewMap,Polyline,Circle,Color,SimpleMarkerSymbol,
            Font,TextSymbol,InfoWindowBase,
            Graphic,InfoTemplate,domUtils,
            Extent,webMercatorUtils,
            domConstruct,dom, on) {
	//空方法
    function noop(){
    	alert("arcgis");
    }
	var map;
    var mapurl = "https://cache1.arcgisonline.cn/arcgis/rest/services/ChinaOnlineCommunity/MapServer";
	HiMap.prototype.init = function (mapdiv,mapInitParams) {
		//alert("dswwwwwwwfsa");
		mapInitParams = mapInitParams||{logo:false,extent:new esri.geometry.Extent(-95.271, 38.933, -95.228, 38.976,
          new esri.SpatialReference({wkid:4326}) )};
		  
		  
		this.map = new Map(mapdiv,mapInitParams);
		map = this.map;
        var MyTiledMapServiceLayer = new ArcGISTiledMapServiceLayer(mapurl);
        map.addLayer(MyTiledMapServiceLayer);
        
        map.drawTool = new Draw(map,{ showTooltips: false });
        initDrawTool();
       
        map.on("load", initListener);
	};
	
	function checkParam(param,ptype){
		if(ptype == "string" || ptype == "object"){
			if(null == param||typeof param != ptype){
				return false;
			}
		}else if(ptype == "number"){
			if(null == param || isNaN(param)){
				return false;
			}
		}else{
			if(null == param || param+"" == ""){
				return false;
			}
		}
		return param;
	}
	
	function initDrawTool(){
		map.drawMode = "pan";
		map.drawTool.on("draw-end", function (geometry) {
			if(map.drawMode == "drawPoint"){
				map.drawMode = "pan";
				map.setMapCursor('auto');
				if(map.spatialReference.isWebMercator()){ //如果是投影墨卡托坐标，转换为经纬度
						geometry = webMercatorUtils.webMercatorToGeographic(geometry.geometry);
				}
				map.drawTool.callback.call(this,geometry.x+","+geometry.y);
			}else if(map.drawMode == "drawRect"){
				/*设置面的显示样式*/
				/*var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
				var graphic = new Graphic(geometry, symbol);
				map.graphics.add(graphic);*/
				if(map.spatialReference.isWebMercator()){ //如果是投影墨卡托坐标，转换为经纬度
					geometry = webMercatorUtils.webMercatorToGeographic(geometry.geometry);
				}
				map.drawMode = "pan";
				map.setMapCursor('auto');
				map.drawTool.callback.call(this,geometry.rings[0].join(","));
			}else if(map.drawMode == "drawCircle"){
				map.drawMode = "pan";
				map.setMapCursor('auto');
				if(map.spatialReference.isWebMercator()){ //如果是投影墨卡托坐标，转换为经纬度
						geometry = webMercatorUtils.webMercatorToGeographic(geometry.geometry);
				}
				map.drawTool.callback.call(this,geometry.rings[0].join(","));
			}else if(map.drawMode == "drawPolyline"){
				map.drawMode = "pan";
				map.setMapCursor('auto');
				if(map.spatialReference.isWebMercator()){ //如果是投影墨卡托坐标，转换为经纬度
						geometry = webMercatorUtils.webMercatorToGeographic(geometry.geometry);
				}
				map.drawTool.callback.call(this,geometry.paths[0].join(","));
			}else if(map.drawMode == "drawPolygon"){
				map.drawMode = "pan";
				map.setMapCursor('auto');
				if(map.spatialReference.isWebMercator()){ //如果是投影墨卡托坐标，转换为经纬度
						geometry = webMercatorUtils.webMercatorToGeographic(geometry.geometry);
				}
				map.drawTool.callback.call(this,geometry.rings[0].join(","));
			}
		});
    }
      
    function initListener(){
    	
    	map.graphics.on("mouse-down", function(e){
		  var attributes = e.graphic.attributes;
		  if(attributes!=null && attributes.marker != null){
		  	attributes.marker.clickFunc.call();
		  }
		});
		map.graphics.on("mouse-up", function(e){
		  var attributes = e.graphic.attributes;
		  if(attributes!=null && attributes.marker != null){
		  	map.infoWindow.resize(attributes.marker.infowindowsize[0],attributes.marker.infowindowsize[1]);
		  }
		});
		 map.graphics.on("mouse-over", function(e){
		 	map.setMapCursor('pointer');
		  	var attributes = e.graphic.attributes;
		  	if(attributes==null || attributes.marker == null){
		  		return;
		  	}else{
				//if(attributes.marker.bIsshowtitle == false)
		  		attributes.marker.showTitle();
		  	}
		});
		
		map.graphics.on("mouse-out", function(e){
			map.setMapCursor('auto');
		  	var attributes = e.graphic.attributes;
		  	if(attributes==null || attributes.marker == null){
		  		return;
		  	}else{
				//if(attributes.marker.bIsshowtitle == false)
		  		attributes.marker.hideTitle();
		  	}
		});
    }
	
	//地图操作
    HiMap.prototype.zoomIn = function(){
		var curzoom = this.map.getZoom();
		var maxzoom = this.map.getMaxZoom();
		if ( curzoom < maxzoom ){
			curzoom += 1;
			this.map.setZoom(curzoom);
		}
	};

	//拉框放大			?????????????????????????没有
    HiMap.prototype.zoomInExt = noop;

	//缩小
    HiMap.prototype.zoomOut = function(){
		var curzoom = this.map.getZoom();
		var maxzoom = this.map.getMinZoom();
		if ( curzoom > maxzoom ){
			curzoom -= 1;
			this.map.setZoom(curzoom);
		}	
	};

	//拉框缩小
    HiMap.prototype.zoomOutExt = noop;
	
/*
        //参数为空的情况下设置平移状态,如果存在参数x,y,则相应向X,Y方向进行移动
        this.pan = function(x,y){};

        //测距离
        this.measureLength = noop;

        //测面积
        this.measureArea = noop;

        //全图显示.
        this.fullExtent = noop;
*/
	      
		  
		  
	//对中
    HiMap.prototype.gotoCenter = function(){
		this.map.centerAt([120.38013,36.08662]);
	}
	
	//打印
    //    this.print = noop;

	//清除
	
	HiMap.prototype.clear = HiMap.prototype.clearMap;
	
	
	//地图对中到给定的点
	HiMap.prototype.centerAtLatLng  = function(latLng){
		var point;
		if(latLng instanceof HiPoint){
			point = latLng.point;
		}else if (typeof(latLng) == "string"){
			point = new Point(latLng.split(","));
		}else{
			point = latLng;
		}
		this.map.centerAt(point);
		return this;
	};
			
    //对中到给定的坐标，如果该点在当前视图上，则进行平移到该点为地图中心.
	HiMap.prototype.recenterOrPanToLatLng = HiMap.prototype.centerAtLatLng;

	//缩放到给定的级别
	HiMap.prototype.zoomTo = function(zoomLevel){
		this.map.setZoom(zoomLevel);
	};
	
	//对指定的范围进行地图对中
    HiMap.prototype.centerAtMBR = function(dInMinX,dInMinY,dInMaxX,dInMaxY){
		var xmin,ymin,xmax,ymax;
		
		if (arguments.length == 1 && typeof arguments[0] == "string") {   
		   var newpoint = dInMinX.split(",");
		   xmin = parseFloat(newpoint[0]);
		   ymin = parseFloat(newpoint[1]);
		   xmax = parseFloat(newpoint[2]);
		   ymax = parseFloat(newpoint[3]);   
	    }else{
			xmin = dInMinX;
			ymin = dInMinY;
			xmax = dInMaxX;
			ymax = dInMaxY;
		}
		
		var extent = new Extent(xmin,ymin,xmax,ymax,new SpatialReference({ wkid: 4326 }));
		this.centerAtLatLng(extent.getCenter());
		
	};
	
	/**
	 * 地图定位，同 moveTo
	 * @param {(String|HiPoint)} strCoords 地图中心点
	 * @param {Number} [zoomlevel]	地图显示级别
	 * @return {IHiMap}
	 */
	HiMap.prototype.centerAndZoom  = function(latLng, zoomLevel){
		var point;
		if(latLng instanceof HiPoint){
			point = latLng.point;
		}else if (typeof(latLng) == "string"){
			point = new Point(latLng.split(","));
		}else{
			point = latLng;
		}
		
		this.map.centerAndZoom(point,zoomLevel);
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
		
		var infoWindow = new InfoWindowLite(null, domConstruct.create("div"));
        infoWindow.startup();
        this.map.infoWindow.setTitle("信息窗口");
		this.map.infoWindow.setContent(html);
        
		if(!this.map.loaded){
   			var map = this.map;
   			map.on("load",function(){
				map.infoWindow.show(map.toScreen(new Point(pPoint.split(","))),infoWindow.ANCHOR_UPPERLEFT);
   			});
   		}else{
   			this.map.infoWindow.show(this.map.toScreen(new Point(pPoint.split(","))),infoWindow.ANCHOR_UPPERLEFT);
   		}
        
	};
	
	
	/*
        //返回地图中心的坐标，类型为Point
        this.getCenterLatLng = noop;
	*/
	
	
	//返回当前视窗的经纬度边框.类型:HiMBR
    HiMap.prototype.getBoundsLatLng = function(){
    	var extent = this.map.extent;
    	var mbr;
	   	if(extent.spatialReference.isWebMercator()){ //如果是投影墨卡托坐标，转换为经纬度
    		var lt = webMercatorUtils.xyToLngLat(extent.xmin, extent.ymin);
    		var rb = webMercatorUtils.xyToLngLat(extent.xmax, extent.ymax);
    		mbr = new HiMBR(lt[0],lt[1],rb[0],rb[1]);
    	}else{
			mbr = new HiMBR(extent.xmin,extent.ymin,extent.xmax,extent.ymax);
    	}
    	
    	return mbr;
    };

	//返回地图的当前级别，返回类型为int
    HiMap.prototype.getZoomLevel = function(){
		return this.map.getZoom();
	};

	//返回地图的最大级别，返回类型为int   
    HiMap.prototype.getMaxLevel = function(){
		return this.map.getMaxZoom();
	};
		
/*
        //获取指定的范围的级别，返回类型为int
        this.getLevelOfMBR = function(dInMinX,dInMinY,dInMaxX,dInMaxY){};
*/

	//获取当前绘制模式,字符串
    HiMap.prototype.getDragMode = function(){
		return this.map.drawMode;
	};

	/**
	 * 改变操作模式
	 * @param {String} drawmode 操作模式 可用的有：
	 " measure":测量 "pan":平移模式 “drawPoint”：获取坐标点 “drawCircle”：画圆 “drawRect”：画矩形 “drawPolyline”：画线 “drawPolygon”：画多边型 
	 * @param {Function} [callback]	回调函数
	 */
    HiMap.prototype.changeDragMode = function(drawmode,callback){
			
		this.map.drawTool.callback = function(data){
    		this.map.drawTool.deactivate();
    		callback.call(this,data);
    	};
		
    	if(drawmode=="pan"){
			this.map.drawTool.deactivate();
			this.map.drawMode = "pan";
			this.map.setMapCursor('auto');
			return;
		}else if(drawmode == "drawPoint"){
			this.map.drawMode = "drawPoint";
			this.map.drawTool.activate("point");
			this.map.setMapCursor('crosshair');
		}else if(drawmode == "drawRect"){
			this.map.drawMode = "drawRect";
			this.map.drawTool.activate(Draw.RECTANGLE);
			this.map.setMapCursor('crosshair');
		}else if(drawmode == "drawCircle"){
			this.map.drawMode = "drawCircle";
			this.map.drawTool.activate(Draw.CIRCLE);
			this.map.setMapCursor('crosshair');
		}else if(drawmode == "drawPolyline"){
			this.map.drawMode = "drawPolyline";
			this.map.drawTool.activate(Draw.POLYLINE);
			this.map.setMapCursor('crosshair');
		}else if(drawmode == "drawPolygon"){
			this.map.drawMode = "drawPolygon";
			this.map.drawTool.activate(Draw.POLYGON);
			this.map.setMapCursor('crosshair');
		}
	};

	
			//屏幕坐标转地理坐标		
	HiMap.prototype.containerCoord2Map = function(x,y){
		
	}
	
	
	/**
	 * 在当前地图上加入给定的对象
	 * @param {HiOverlay} overlay 对象
	 * @return {IHiMap}
	 */
    HiMap.prototype.addOverlay = function (overlay){
   		if(!this.map.loaded){
   			var map = this.map;
   			map.on("load",function(){
   				map.graphics.add(overlay.graphic);
   			});
   		}else{
   			this.map.graphics.add(overlay.graphic);
   		}
		return this;
	};
	
	 
		//在地图上删除给定的对象
    HiMap.prototype.removeOverlay = function (overlay){
		if(!this.map.loaded){
   			var map = this.map;
   			map.on("load",function(){
   				map.graphics.remove(overlay.graphic);
   			});
   		}else{
   			this.map.graphics.remove(overlay.graphic);
   		}
		
	};
	

	//在地图上清除所有的对象.
    HiMap.prototype.clearOverlays = HiMap.prototype.clearMap;

		//返回信息叠加类，iOverLay对象的数组
    HiMap.prototype.getOverlays = noop;

        //获取当前编辑的信息对象。iOverLay对象类型
    HiMap.prototype.getCurrentEditor =noop;

        //增加地图状态变化时执行的操作，func为函数
    HiMap.prototype.addMapChangeListener = function (func){};

        //删除地图状态变化时执行的操作，func为函数
    HiMap.prototype.removeMapChangeListener = function (func){};
        
		
	/**							
     * 清空地图
     * @return {IHiMap}
     */
	HiMap.prototype.clearMap = function(){
		this.map.graphics.clear();
		return this;
	};
	
	/**
	 * 设置地图中心点
	 * @param {(String|HiPoint)} strCoords
	 * @return {IHiMap}
	 */
	this.setCenter = function (strCoords) {
		this.recenterOrPanToLatLng(strcoords);
		return this;
	};

	
	/**
	 * 画点
	 * @param {function(String)} [callback] 回调函数
	 * @return {IHiMap}
	 */
    HiMap.prototype.drawPoint = function (callback) {
		this.changeDragMode('drawPoint',
		function(pos){
			callback.call(this,pos);
		});
		return this;
	};

	/**
	 * 画矩形
	 * @param {function(String)} [callback] 回调函数
	 * @return {IHiMap}
	 */
    HiMap.prototype.drawRect = function (callback) {
		this.changeDragMode('drawRect',
		function(pos){
			callback.call(this,pos);
		});
		return this;
	};

	/**
	 * 画圆
	 * @param {function(String)} [callback] 回调函数
	 * @return {IHiMap}
	 */
    HiMap.prototype.drawCircle = function (callback) {
		this.changeDragMode("drawCircle",
		function(pos){
			callback.call(this,pos);
		});
		return this;
	};

	/**
	 * 画线
	 * @param {function(String)} [callback] 回调函数
	 * @return {IHiMap}
	 */
    HiMap.prototype.drawPolyline = function (callback) {
		this.changeDragMode('drawPolyline',
		function(pos){
			callback.call(this,pos);
		});
		return this;
	};

	/**
	 * 画多边形
	 * @param {function(String)} [callback] 回调函数
	 * @return {IHiMap}
	 */
    HiMap.prototype.drawPolygon = function (callback) {
		this.changeDragMode('drawPolygon',
		function(pos){
			callback.call(this,pos);
		});
		return this;
	};
		
/*
        /**
         *在地图上叠加一个设备图标
         *  @typedef {Object} ShowDeviceParam
         *  @property {String} deviceid 设备编号
         *  @property {String} devicetype 设备类型
         *  @property {Boolean} [centable] 是否居中展示,默认false
         *************************************************
         * @param {ShowDeviceParam} params 参数对象，可选的字段参考ShowDeviceParam定义
         * @return HiDeviceMarker 返回叠加到地图上的设备对象
         *
        this.showDevice = function (params) {};

        /**
         * 删除一个叠加到地图上的设备图标
         * @param {(HiDeviceMarker|String)} deviceMonitor 叠加到地图上的设备对象，或者一个具体的设备编号
         * @return {IHiMap}
         *
        this.removeDevice = function (deviceMonitor) {};
*/



	/*	
	HiMap.prototype.showWave = function (strcoords, radius) {
		
		var aradius = radius||500;
		var pPoints = strcoords+","+this.changeMeterToDegree(strcoords,aradius);
		var pPoints1 =  strcoords+","+this.changeMeterToDegree(strcoords,aradius);
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
	
	 
	
    //判断两个坐标点之间的距离 单位米	
    HiMap.prototype.getDistanceInLL = function (str1, str2) {
		var point1 = new Point(str1.split(",")[0],str1.split(",")[1]);
		var point2 = new Point(str2.split(",")[0],str2.split(",")[1]);
		return GetDistanceInLL(point1,point2);
	};
	
    //将米转换成经纬度			
    HiMap.prototype.changeMeterToDegree = function (strcoords, distance) {
		var point = new Point(strcoords.split(",")[0],strcoords.split(",")[1]);
		var degree = this.map.getDegree(point,distance);
		return degree;
	};	
	*/


        /**
         * 波纹效果
         *strCoords 中心点
         *radius 半径
         */
    HiMap.prototype.showWave = function (strCoords, radius) {
		
		
	};


//——————————————————————————————————HiMBR—————————————————HiPoint.prototype.———————————————————————	 
	 
	HiMBR.prototype.init= function(minX,minY,maxX,maxY){
    
    	this.extent = new Extent(minX,minY,maxX,maxY,new SpatialReference({ wkid: 4326 }));
    }	
		
		//获取MBR的中心点;Point类型
	HiMBR.prototype.centerPoint = noop;
		//获取X方向的跨度
	HiMBR.prototype.getSpanX = noop;
		//获取Y方向的跨度
	HiMBR.prototype.getSpanY = noop;
		//E为小数:0~10
		//MBR中心扩大其边框
	HiMBR.prototype.scale = function(e){};
		
		//是否包含pMBR，返回类型：boolean
	HiMBR.prototype.containsBounds = function(pMBR){};
		//是否包含点，返回类型：boolean
	HiMBR.prototype.containsPoint = function(point){
		if(point instanceof Point){
			return this.extent.contains(point.point);
		}else if(point instanceof HiPoint){
			return this.extent.contains(point.point);
		}
	};
		//拓展边界，参数可以是Point或MBR类型，返回类型：无
	HiMBR.prototype.extend = function(pMBR){};
		//返回指定的2个MBR对象的相交部分的MBR，返回类型MBR
	HiMBR.prototype.Intersection = function(pMBR1,pMBR2){};
		//返回指定的2个MBR对象的并集部分的MBR，返回类型MBR
	HiMBR.prototype.union = function(pMBR1,pMBR2){};
		//获取其中心点，返回类型为:Point
	HiMBR.prototype.getCenterPoint = function(){
		return this.extent.getCenter();
	};
	
	 
	 
	 
//——————————————————————————————————HiPoint————————————————————————————————————————	 
	HiPoint.prototype.init = function(x,y){
    	
    	if((x+"").split(",").length == 2){
    		y = (x+"").split(",")[1];
    		x = (x+"").split(",")[0];
    	}
    	this.point = new Point(x,y);
        this.x = x;
        this.y = y;
	}
	/**
	* 判断2点是否大概相等
	* @param hiPoint
	* @return {Boolean}
	*/
    HiPoint.prototype.approxEquals = function(hiPoint){};

	/**
	* 判断2点是否相等
	* @param hiPoint
	* @return {Boolean}
	*/
	HiPoint.prototype.equals= function(hiPoint){};
//——————————————————————————————————HiIcon————————————————————————————————————————	
	
	HiIcon.prototype.init = function (image,width,height,leftOffset,topOffset){
		
	}
	
	HiIcon.prototype.setParam = function(paramname,paramvalue){
		this[paramname] = paramvalue;
		
	}

//——————————————————————————————————HiTitle————————————————————————————————————————	
	
	HiTitle.prototype.init = function(name,fontSize,pos,font,color,bgColor){
		
        //设置图标显示位置
        this.setPoint = function(pPoint){}

        //获取其位置，类型为Point
        this.getPoint = function(){}
		
		this.font = new Font();
		this.font.setFamily(font);
		this.font.setSize(fontSize);
		this.textSymbol = new TextSymbol(this.name,this.font,this.color);
	
		this.setOffset = function (x,y){
			this.textSymbol = this.textSymbol.setOffset(x,y);
		}
    }
	
	HiTitle.prototype.setParam = function(paramname,paramvalue){
		this[paramname] = paramvalue;
		this.title[paramname] = paramvalue;
	}
	
//——————————————————————————————————HiMarker————————————————————————————————————————	
	HiMarker.prototype.init = function (point,icon,title){
        this.point = point;
        this.icon = icon;
        this.title = title;
      
        var pictureMarkerSymbol = new PictureMarkerSymbol(icon.image,icon.width,icon.height);
        var json = {title:this.title.name,content:" "}
        this.infoTemplate = new InfoTemplate(json);
        this.graphic = new Graphic(point.point,pictureMarkerSymbol,{"marker":this},this.infoTemplate);
        if(title instanceof HiTitle){
        	var titlepoint = new Point(point.x,point.y-(-icon.height/50000));
			this.titleGraphic= new Graphic(titlepoint,title.textSymbol);
		}
    };    
	//显示信息筐
	HiMarker.prototype.openInfoWindowHtml= function (htmlStr){
		var json = {title:this.title.name,content:htmlStr}
		this.infoTemplate = new InfoTemplate(json);
		this.graphic.setInfoTemplate(this.infoTemplate);
		this.infowindowsize = [415,210];
	}

	//加入事件，其中action为字符型,可以是如下: 
	//'click'：点击
	//'dblclick'：双击
	//'mouseover'：鼠标在上面移动
	//'mouseout'：鼠标移出
	HiMarker.prototype.addListener= function (action,fuct){
		var layer = map.graphics;
		if(action == "click"){
			this.clickFunc = fuct;
		}else if(action == "dblclick"){
		}else if(action == "mouseover"){
		}else if(action == "mouseout"){
		}
	}

        //获取当前的图层序列
    HiMarker.prototype.etZIndex= function (){};

        //设置图层系列
    HiMarker.prototype.setZIndex= function (int){};

        //显示标题
    HiMarker.prototype.showTitle= function (){
		if(!map.loaded){
   			map.on("load",function(){
   				map.graphics.add(this.titleGraphic);
   			});
   		}else{
   			map.graphics.add(this.titleGraphic);
   		}
		
		//map.graphics.add(this.titleGraphic);
	};

        //隐藏标题
    HiMarker.prototype.hideTitle= function (){
		if(!map.loaded){
			map.on("load",function(){
			map.graphics.remove(this.titleGraphic);
   			});
   		}else{
   			map.graphics.remove(this.titleGraphic);
   		}
		
		
		//map.graphics.remove(this.titleGraphic);
	};

        //设置图标显示位置
    HiMarker.prototype.setPoint= function (pPoint){};

        //获取其位置，类型为Point
    HiMarker.prototype.getPoint= function (){}
    
	
	//—————————————————————————————————HiPolyline————————————————————————————————————————————-	HiPolygon.prototype.init
	HiPolyline.prototype.init = function(points, color, weight, opacity,arrow){
		
		var newpoint =  points.split(",");
		var x = parseFloat(newpoint[0]);
		var y = parseFloat(newpoint[1]);
		
		this.polyline = new Polyline([[x,y]],new SpatialReference({ wkid:4326 }));
		
		for(var i = 1 ;i < newpoint.length/2;i++ ){
			var tempx = parseFloat(newpoint[i*2]);
			var tempy = parseFloat(newpoint[i*2+1]);
			this.polyline.insertPoint(0, i, new Point(tempx,tempy));
			this.polyline = this.polyline.setPoint(0, i, new Point(tempx,tempy));
		}
		this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), weight);
		
	
		
		this.graphic = new Graphic(this.polyline, this.lineSymbol,{"marker":this});
		//this.polyline = new Polyline(points, color, weight, opacity,arrow);
	
	}
	
	HiPolyline.prototype.addListener = function(action, func){
		var layer = map.graphics;
			if(action == "click"){
				this.clickFunc = func;
			}else if(action == "dblclick"){
			}else if(action == "mouseover"){
			}else if(action == "mouseout"){
			}
	};
	
	HiPolyline.prototype.getCoordSequence = function(){
		
	}
	
	HiPolyline.prototype.getGeometryType = function(){
		
	};
	
	HiPolyline.prototype.getLength  = function(){
		
	}
		
	HiPolyline.prototype.getMBR = function(){
		return this.polyline.getExtent().xmin+','+this.polyline.getExtent().ymin+','+this.polyline.getExtent().xmax+','+this.polyline.getExtent().ymax;
	};
	
	HiPolyline.prototype.getLineStyle = function(){
		
	}
	
	HiPolyline.prototype.getZIndex = function(){
		
	};
	
	HiPolyline.prototype.openInfoWindowHtml = function(strHTML){
		this.infoTemplate = new InfoTemplate({title:"信息窗口",content:strHTML});
       	this.graphic.setInfoTemplate(this.infoTemplate);
		this.infowindowsize = [415,210];
	};
		
	HiPolyline.prototype.setLineStyle = function(lineStyle){
		switch(lineStyle){
			case "none":
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(this.color), this.weight);
			break
			case "dash":
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASH, new Color(this.color), this.weight);
			break
			case "dashdot":
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new Color(this.color), this.weight);
			break
			case "dot":
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_DOT, new Color(this.color), this.weight);
			break
			case "longdash":
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASH, new Color(this.color), this.weight);
			break
			case "longdashdot":
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASH, new Color(this.color), this.weight);
			break
			case "shortdash":
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_LONGDASH, new Color(this.color), this.weight);
			break
			case "shortdashdot":
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOT, new Color(this.color), this.weight);
			break
			case "shortdashdotdot":
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDASHDOTDOT, new Color(this.color), this.weight);
			break
			case "shortdot":
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SHORTDOT, new Color(this.color), this.weight);
			break
			default:
				this.lineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(this.color), this.weight);
			}
			
			this.graphic.setSymbol(this.lineSymbol);
		
	}
	
	HiPolyline.prototype.setZIndex = function(iIndex){
		
	};
	
	
	//————————————————————————————————HiPolygon—————————————————————————————————————————————-
	HiPolygon.prototype.init = function(points, color, weight, opacity, fillcolor){
		
		var newpoint =  points.split(",");
		var x = parseFloat(newpoint[0]);
		var y = parseFloat(newpoint[1]);
		
		this.polygon = new Polygon([[x,y]],new SpatialReference({ wkid:4326 }));

		
		for(var i = 1 ;i < newpoint.length/2;i++ ){
			var tempx = parseFloat(newpoint[i*2]);
			var tempy = parseFloat(newpoint[i*2+1]);
			this.polygon.insertPoint(0, i, new Point(tempx,tempy));
			this.polygon = this.polygon.setPoint(0, i, new Point(tempx,tempy));
		}
		
		this.outlineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(this.color), this.weight);
		
		this.polygonsymbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, this.outlineSymbol, new Color(this.fillcolor));
		
		this.graphic = new Graphic(this.polygon, this.polygonsymbol,{"marker":this});
		
		
		//this.polygon = new Polygon(points, color, weight, opacity, fillcolor);
	}
	
	HiPolygon.prototype.addListener = function(action, func){
		var layer = map.graphics;
			if(action == "click"){
				this.clickFunc = func;
			}else if(action == "dblclick"){
			}else if(action == "mouseover"){
			}else if(action == "mouseout"){
			}
	};
	
	HiPolygon.prototype.getArea = function(){
		
	}
	
	HiPolygon.prototype.getGeometryType = function(){
		
	}
	
	HiPolygon.prototype.getLength = function(){
		
	}
	
	HiPolygon.prototype.getMBR = function(){		
		return this.polygon.getExtent().xmin+','+this.polygon.getExtent().ymin+','+this.polygon.getExtent().xmax+','+this.polygon.getExtent().ymax;
	}
	
	HiPolygon.prototype.getZIndex = function(){
		
	}
	
	HiPolygon.prototype.openInfoWindowHtml = function(strHTML){
		this.infoTemplate = new InfoTemplate({title:"信息窗口",content:strHTML});
       	this.graphic.setInfoTemplate(this.infoTemplate);
		this.infowindowsize = [415,210];
	}
	
	HiPolygon.prototype.setZIndex = function(iIndex){
		
	}
   //——————————————————————————————HiRectangle————————————————————————————————————————————-	

	HiRectangle.prototype.init = function(points, color, weight, opacity,fillcolor){
    	var cord = points.split(",");
    	
		var minx = parseFloat(cord[0]);
		var miny = parseFloat(cord[1]);
		var maxx = parseFloat(cord[2]);
		var maxy = parseFloat(cord[3]);
		
		
		this.extent = new Extent(minx,miny,maxx,maxy);
		
		var outlineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), weight);
		
		var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, outlineSymbol, new Color(fillcolor));
		
		this.graphic = new Graphic(this.extent, symbol,{"marker":this});
		
    }
	
	HiRectangle.prototype.getMBR = function(){
		return this.points.split(",")[0]+","+this.points.split(",")[1]+","+this.points.split(",")[2]+","+this.points.split(",")[3];
	}
	
	HiRectangle.prototype.addListener = function(action, func){
		var layer = map.graphics;
			if(action == "click"){
				this.clickFunc = func;
			}else if(action == "dblclick"){
			}else if(action == "mouseover"){
			}else if(action == "mouseout"){
			}
	};
		
	HiRectangle.prototype.getZIndex = function(){
		
	}
	
	HiRectangle.prototype.openInfoWindowHtml = function(strHTML){
		//var json = {title:"信息窗口",content:htmlStr};
       	this.infoTemplate = new InfoTemplate({title:"信息窗口",content:strHTML});
       	this.graphic.setInfoTemplate(this.infoTemplate);
    	this.infowindowsize = [415,210];
	}
	
	HiRectangle.prototype.setZIndex = function(iIndex){
		
	}
   
	//———————————————————————————————HiCircle————————————————————————————————————————————-	
	HiCircle.prototype.init = function(points, color, weight, opacity, fillcolor){
		
		
		var x = parseFloat(points.split(",")[0]);
		var y = parseFloat(points.split(",")[1]);
		var radius = parseFloat(points.split(",")[2])*1000;
		
		this.circle = new Circle({
				center: [x,y],
				radius: radius
			});

		var outlineSymbol = new SimpleLineSymbol(SimpleLineSymbol.STYLE_SOLID, new Color(color), weight);
		
		var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, outlineSymbol, new Color(fillcolor));
		
		this.graphic = new Graphic(this.circle, symbol,{"marker":this});
		
		
		
	};
	
	HiCircle.prototype.getRadius= function(){
		return this.points.split(",")[2];
	};
	
	HiCircle.prototype.getCenter = function(){
		return this.points.split(",")[0]+','+this.points.split(",")[1];
	}
	
	HiCircle.prototype.addListener = function(action, func){
		var layer = map.graphics;
			if(action == "click"){
				this.clickFunc = func;
			}else if(action == "dblclick"){
			}else if(action == "mouseover"){
			}else if(action == "mouseout"){
			}
		
	};
	
	HiCircle.prototype.openInfoWindowHtml = function(strHTML){
		//var json = {title:"信息窗口",content:htmlStr};
		this.infoTemplate = new InfoTemplate({title:"信息窗口",content:strHTML});
		this.graphic.setInfoTemplate(this.infoTemplate);
		this.infowindowsize = [415,210];
   	};
   
   
	
	return HiMap
	

});