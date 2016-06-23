/**
 * Created by liuxiaobing on 2016-1-5.
 */
define(["map/Config","map/IHiMap","tool/tools","overlay/HiIcon",
		"overlay/HiMarker","overlay/HiMBR","overlay/HiOverlay",
		"overlay/HiPoint","overlay/HiPolygon","overlay/HiPolyline",
		"overlay/HiRect","overlay/HiTitle","overlay/HiCircle",
		"overlay/HiRectangle","layer/HiWMSLayer"], 
		function(CONFIG,HiMap,Tools,HiIcon,
				 HiMarker,HiMBR,HiOverlay,
				 HiPoint,HiPolygon,HiPolyline,
				 HiRect,HiTitle,HiCircle,
				 HiRectangle,HiWMSLayer) {
    
    var checkParam = Tools.checkParam;
    
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
     * @param {(String|HiPoint)} strcoords 地图中心点
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
     * @param {(String|HiPoint)} strcoords 地图中心点
     * @param {Number} [zoomlevel]	地图显示级别
     * @return {IHiMap}
     */
    HiMap.prototype.moveTo = function (strcoords,zoomlevel){
		this.centerAndZoom(strcoords,zoomlevel);
		return this;
	};
	
    //在指定的位置显示信息		
    HiMap.prototype.openInfoWindow = function(pPoint,html){
    	if(typeof(pPoint) == "string"){
    		pPoint = new Point(pPoint);
    	}
		this.map.openInfoWindow(pPoint,html);
	};
	
    //返回地图中心的坐标，类型为Point	
    HiMap.prototype.getCenterLatLng = function(){
		return this.map.getCenterLatLng();
	};
    //返回当前视窗的经纬度边框.类型:HiMBR				
    HiMap.prototype.getBoundsLatLng = function(){
		var mbr = this.map.getBoundsLatLng();
		return new HiMBR(mbr.minX,mbr.minY,mbr.maxX,mbr.maxY);
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
    HiMap.prototype.changeDragMode = function(drawmode,x,y,callback){
		this.map.changeDragMode(drawmode,x,y,callback);
	};
	
	//屏幕坐标转地理坐标
	HiMap.prototype.containerCoord2Map = function(x,y){
		var _MapApp = this.map;
		var xpos;
		var ypos;
		var pCenterLatLng = _MapApp.getCenterLatLng();
		 if( typeof(_MapApp.containerCoord2Map) == "function"){
		 	var _MapApp = this.map;
			var pos = _MapApp.containerCoord2Map(new Point(x,y));
			xpos = pos.x;
			ypos = pos.y;
		}else if( typeof(_PixelsPerDegree) == "undefined"){
			xpos = pCenterLatLng.x + (x - _MapApp.map.viewSize.width / 2) * _MapApp.map.baseLayer.tileInfo.levelDetails[_MapApp.map.realZoomLevel].resolution;
        	ypos = pCenterLatLng.y - (y - _MapApp.map.viewSize.height / 2) * _MapApp.map.baseLayer.tileInfo.levelDetails[_MapApp.map.realZoomLevel].resolution;;
		}else{
			xpos = pCenterLatLng.x + (x - _MapApp.map.viewSize.width / 2) / _PixelsPerDegree[_MapApp.getZoomLevel()].x;
			ypos = pCenterLatLng.y - (y - _MapApp.map.viewSize.height / 2) / _PixelsPerDegree[_MapApp.getZoomLevel()].y;
		}
		return {x:xpos,y:ypos};
	}
	
	
    /**
     * 在当前地图上加入给定的对象			
     * @param {HiOverlay} overlay 对象
     * @return {IHiMap}
     */
    HiMap.prototype.addOverlay = function (overlay){
		this.map.addOverlay(overlay.overlay);
		return this;
	};
	
    //在地图上删除给定的对象		
    HiMap.prototype.removeOverlay = function (overlay){
    	try{
			this.map.removeOverlay(overlay.overlay);
    	}catch(e){
    	}
	};
	
    //在地图上清除所有的对象.		
    HiMap.prototype.clearOverlays = function (){
    	try{
			this.map.clearOverlays();
    	}catch(e){
    	}
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
     * @param {(String|HiPoint)} strcoords
     * @return {IHiMap}
     */
    HiMap.prototype.setCenter = function (strcoords) {
		this.recenterOrPanToLatLng(strcoords);
	};
	
    /**
     * 画点						
     * @param {function(String)} [callback] 回调函数
     * @return {IHiMap}
     */
    HiMap.prototype.drawPoint = function (callback) {
		var _MapApp =this.map;
		this.map.changeDragMode("drawPoint",null,null,function(pos){
				_MapApp.changeDragMode('');
				_MapApp.changeDragMode('pan');
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
		var _MapApp =this.map;
		this.map.changeDragMode("drawRect",null,null,function(pos){
				_MapApp.changeDragMode('');
				_MapApp.changeDragMode('pan');
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
		var _MapApp =this.map;
		this.map.changeDragMode("drawCircle",null,null,function(pos){
				_MapApp.changeDragMode('');
				_MapApp.changeDragMode('pan');
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
		var _MapApp =this.map;
    	this.map.map.vmlDashline = null;
		this.map.map.bDrawEnd = true;
		this.map.changeDragMode("drawPolyline",null,null,function(pos){
				_MapApp.changeDragMode('');
				_MapApp.changeDragMode('pan');
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
		var _MapApp =this.map;
		this.map.changeDragMode("drawPolygon",null,null,function(pos){
				_MapApp.changeDragMode('');
				_MapApp.changeDragMode('pan');
				callback.call(this,pos);
			});
		return this;
	};
	
    /**				
     * 波纹效果
     *strcoords 中心点
     *radius 半径
     */
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
	
//—————————————————————————————————HiIcon————————————————————————————————————————————-	
	/*
	 * 初始化图标
	 * @param image
	 * @param width
	 * @param height
	 * @param leftOffset
	 * @param topOffset
	 * 
	 */
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

	HiTitle.prototype.init = function(name,fontSize,pos,font,color,bgColor,borderColor,borderSize){
		this.title = new Title(name,fontSize,pos,font,color,bgColor,borderColor,borderSize);
	}
	
	HiTitle.prototype.setParam = function(paramname,paramvalue){
		this[paramname] = paramvalue;
		this.title[paramname] = paramvalue;
	}
	
	//设置图标显示位置
	HiTitle.prototype.setPoint = function(pPoint){
		this.point = pPoint;
		this.title.setPoint(pPoint.point);
		this.overlay = this.title;
	}
	
	//获取其位置，类型为HiPoint
	HiTitle.prototype.getPoint = function(){
		return this.point;
	}
	
	HiMarker.prototype.init = function(point,icon,title){
		this.overlay = new Marker(point.point,icon.icon,title.title);
	}
	//显示信息筐
	HiMarker.prototype.openInfoWindowHtml= function (htmlStr){
		this.overlay.openInfoWindowHtml(htmlStr);
	};

	//加入事件，其中action为字符型,可以是如下:
	//'click'：点击
	//'dblclick'：双击
	//'mouseover'：鼠标在上面移动
	//'mouseout'：鼠标移出
	HiMarker.prototype.addListener= function (action,func){
		this.overlay.addListener(action,func);	
	};

    //获取当前的图层序列
    HiMarker.prototype.getZIndex= function (){
		return this.overlay.getZIndex();
	};

    //设置图层系列
    HiMarker.prototype.setZIndex= function (int){
		this.overlay.setZIndex();
	};

    //显示标题
    HiMarker.prototype.showTitle= function (){
		this.overlay.showTitle();
	};

    //隐藏标题
    HiMarker.prototype.hideTitle= function (){
		this.overlay.hideTitle();
	};

    //设置图标显示位置
    HiMarker.prototype.setPoint= function (pPoint){
		this.overlay.setPoint(pPoint.point);
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
//—————————————————————————————————HiPolyline————————————————————————————————————————————-	
	HiPolyline.prototype.init= function(points, color, weight, opacity,arrow){
		this.overlay = new Polyline(points, color, weight, opacity,arrow);
	}
	
	 HiPolyline.prototype.addListener = function(action, func){
		this.overlay.addListener(action,func);
	};
	
	HiPolyline.prototype.getCoordSequence = function(){
		this.overlay.getCoordSequence();
	}
	
	HiPolyline.prototype.getGeometryType = function(){
		return this.polyline.getGeometryType();
	};
	
	HiPolyline.prototype.getLength  = function(){
		return this.overlay.getLength();
	}
		
	HiPolyline.prototype.getMBR = function(){
		return this.overlay.getMBR ();
	};
	
	HiPolyline.prototype.getLineStyle = function(){
		return this.overlay.getLineStyle();
	}
	
	HiPolyline.prototype.getZIndex = function(){
		return this.overlay.getZIndex ();
	};
	
	HiPolyline.prototype.openInfoWindowHtml = function(strHTML){
		this.overlay.openInfoWindowHtml (strHTML);
	};
		
	HiPolyline.prototype.setLineStyle = function(lineStyle){
		this.overlay.setLineStyle(lineStyle);
	}
	
	HiPolyline.prototype.setZIndex = function(iIndex){
		this.overlay.setZIndex(iIndex);
	};
	
//————————————————————————————————HiPolygon—————————————————————————————————————————————-
	HiPolygon.prototype.init = function(points, color, weight, opacity, fillcolor){
		this.overlay = new Polygon(points, color, weight, opacity, fillcolor);
	}
	
	HiPolygon.prototype.addListener = function(action, func){
		this.overlay.addListener(action,func);
	};
	
	HiPolygon.prototype.getArea = function(){
		return this.overlay.getArea();
	}
	
	HiPolygon.prototype.getGeometryType = function(){
		return this.overlay.getGeometryType();
	}
	
	HiPolygon.prototype.getLength = function(){
		return this.overlay.getLength();
	}
	
	HiPolygon.prototype.getMBR = function(){
		return this.overlay.getMBR();
	}
	
	HiPolygon.prototype.getZIndex = function(){
		return this.polygon.getZIndex();
	}
	
	HiPolygon.prototype.openInfoWindowHtml = function(strHTML){
		this.overlay.openInfoWindowHtml(strHTML);
	}
	
	HiPolygon.prototype.setZIndex = function(iIndex){
		this.overlay.setZIndex(iIndex);
	}
	
	
	
//———————————————————————————————HiCircle————————————————————————————————————————————-	
	HiCircle.prototype.init = function(points, color, weight, opacity, fillcolor){
		this.overlay = new Circle(points, color, weight, opacity, fillcolor);
	};
	
	HiCircle.prototype.getRadius= function(){
		return this.overlay.getRadius();
	};
	
	HiCircle.prototype.getCenter = function(){
		return this.overlay.getCenter();
	}
	
//——————————————————————————————HiRectangle————————————————————————————————————————————-	
	HiRectangle.prototype.init = function(points, color, weight, opacity, fillcolor){
		this.overlay = new Rectangle(points, color, weight, opacity, fillcolor);
	};
	
	HiRectangle.prototype.addListener = function(action, func){
		this.overlay.addListener(action,func);
	};
		
	HiRectangle.prototype.getZIndex = function(){
		return this.overlay.getZIndex();
	}
	
	HiRectangle.prototype.openInfoWindowHtml = function(strHTML){
		this.overlay.openInfoWindowHtml(strHTML);
	}
	
	HiRectangle.prototype.getMBR = function(){
		return this.points.split(",")[0]+","+this.points.split(",")[1]+","+this.points.split(",")[2]+","+this.points.split(",")[3];
	};
	
	HiRectangle.prototype.setZIndex = function(iIndex){
		this.overlay.setZIndex(iIndex);
	}
//——————————————————————————————HiRect————————————————————————————————————————————-	
	HiRect.prototype.init = function(width,height){
		this.overlay = new Rect(width, height);
	};
	
	HiRect.prototype.approxEquals  = function(anotherRect){
		this.overlay.approxEquals (anotherRect);
	}
	
	HiRect.prototype.equals  = function(anotherRect){
		this.overlay.equals (anotherRect);
	}
	
	HiWMSLayer.prototype.init = function(){
		var params = this.params;
		var pEndTime = new Date();
		var timestr = pEndTime.getFullYear()+""+pEndTime.getMonth()+""+pEndTime.getDate()+""+pEndTime.getHours()+""+pEndTime.getMinutes();
		var defaulturl = HiMapConfig.geoserverURL+"/sde/wms?REQUEST=GetMap&BBOX=EZBOX&WIDTH=EZWIDTH&HEIGHT=EZHEIGHT&VERSION=1.1.0&FORMAT=image/png&SERVICE=WMS&SRS=EPSG:4326&TRANSPARENT=true";
		params.url = this.params.url||defaulturl;
		params.realurl = this.params.url;
		if(checkParam(params.layername,"string")){
			params.realurl +="&LAYERS="+params.layername;
		}
		if(checkParam(params.styles,"string")){
			params.realurl +="&styles="+params.styles;
		}
		if(checkParam(params.cql_filter,"string")){
			params.realurl +="&cql_filter="+escape(params.cql_filter);
		}
		this.layer = new LegendFunc();
		this.layer.format=params.realurl;
	}
	HiWMSLayer.prototype.show = function(_MapApp){
		this._MapApp = _MapApp;
		this.layer.open(_MapApp.map);
	}
	HiWMSLayer.prototype.close = function(_MapApp){
		if(this.clicklistener!=null){
			this.removeClickListener();
		}
		this.layer.close();
	}
	HiWMSLayer.prototype.setRefreshTime = function(timer){
		this.layer.setRefreshTime(timer);
	}
	
    return HiMap;

});