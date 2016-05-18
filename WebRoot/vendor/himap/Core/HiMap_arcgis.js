


define(["esri/map", "esri/geometry/Point","esri/geometry/Polygon","esri/SpatialReference",
		"esri/layers/ArcGISTiledMapServiceLayer",
        "esri/symbols/PictureMarkerSymbol","esri/symbols/SimpleFillSymbol",
        "esri/symbols/SimpleLineSymbol",
        "esri/symbols/Font","esri/symbols/TextSymbol",
        "esri/graphic","esri/InfoTemplate","esri/toolbars/draw",
        "esri/geometry/Extent","esri/geometry/webMercatorUtils",
        "dojo/dom", "dojo/on", "dojo/domReady!"
], function (
            Map, Point,Polygon,SpatialReference,
            ArcGISTiledMapServiceLayer,
            PictureMarkerSymbol,SimpleFillSymbol,
            SimpleLineSymbol,
            Font,TextSymbol,
            Graphic,InfoTemplate,Draw,
            Extent,webMercatorUtils,
            dom, on
) {


	//××××××××××××××××××××××××××方法内部定义开始×××××××××××××××××××××××××××
	
	var noop = function(){};
	var map;
    var HiMap = function (mapdiv,mapInitParams) {
    	mapInitParams = mapInitParams||{logo:false};
		map = new Map(mapdiv,mapInitParams);
        var MyTiledMapServiceLayer = new ArcGISTiledMapServiceLayer(mapurl);
        map.addLayer(MyTiledMapServiceLayer);
        map.drawTool = new Draw(map, { showTooltips: false });
        initDrawTool();
        this.map = map;
        
        map.on("load", initListener);
        
		
    };
    
    function initDrawTool(){
    	dojo.connect(map.drawTool, "onDrawEnd", function (geometry) {
    		if(map.drawMode == "drawPoint"){
				if(map.spatialReference.isWebMercator()){ //如果是投影墨卡托坐标，转换为经纬度
		    		geometry = webMercatorUtils.webMercatorToGeographic(geometry);
		    	}
		    	map.drawMode = "pan";
				map.setMapCursor('auto');
				map.drawTool.callback.call(this,geometry.x+","+geometry.y);
    		}else if(map.drawMode == "drawRect"){
    			/*设置面的显示样式*/
				/*var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
				var graphic = new Graphic(geometry, symbol);
				map.graphics.add(graphic);*/
				if(map.spatialReference.isWebMercator()){ //如果是投影墨卡托坐标，转换为经纬度
		    		geometry = webMercatorUtils.webMercatorToGeographic(geometry);
		    	}
		    	map.drawMode = "pan";
				map.setMapCursor('auto');
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
		 	map.setMapCursor('hand');
		  	var attributes = e.graphic.attributes;
		  	if(attributes==null || attributes.marker == null){
		  		return;
		  	}else{
		  		attributes.marker.showTitle();
		  	}
		});
		
		map.graphics.on("mouse-out", function(e){
			map.setMapCursor('auto');
		  	var attributes = e.graphic.attributes;
		  	if(attributes==null || attributes.marker == null){
		  		return;
		  	}else{
		  		attributes.marker.hideTitle();
		  	}
		});
    }
    
    
	/**
	 * 地图定位
	 * @param {(String|HiPoint)} strCoords 地图中心点
	 * @param {Number} [zoomlevel]	地图显示级别
	 * @return {HiMap}
	 */
	HiMap.prototype.centerAndZoom  = function(latLng, zoomLevel){
		var point;
		if(latLng instanceof HiPoint){
			point = latLng.point;
		}else{
			point = new Point(latLng.split(","));
		}
		this.map.centerAndZoom(point,zoomLevel);
		return this;
	};
	
	/**
     * 画点
     * @param {function(String)} [callback] 回调函数
     * @return {HiMap}
     */
	HiMap.prototype.drawPoint = function(callback){
		doBefore();
		this.changeDragMode('drawPoint',
			function(pos){
				callback.call(this,pos);
			});
	}
	
	//画矩形
	HiMap.prototype.drawRect = function(callback){
		_MapApp.changeDragMode('drawRect',
			function(pos){
				_MapApp.changeDragMode('pan');
				callback.call(this,pos);
			});
	}
	
	/**
     * 改变操作模式
     * @param {String} drawmode 操作模式 可用的有：
     " measure":测量 "pan":平移模式 “drawPoint”：获取坐标点 “drawCircle”：画圆 “drawRect”：画矩形 “drawPolyline”：画线 “drawPolygon”：画多边型 
     * @param {function(String)} [callback]	回调函数
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
			this.map.drawTool.activate(Draw.POINT);
			this.map.setMapCursor('crosshair');
		}else if(drawmode == "drawRect"){
			this.map.drawMode = "drawRect";
			this.map.drawTool.activate(esri.toolbars.Draw.RECTANGLE);
			this.map.setMapCursor('crosshair');
		}
    };
    
    //返回地图的当前级别，返回类型为int
    HiMap.prototype.getZoomLevel = function(){
    	return this.map.getZoom();
    };
    
    /**
     * 清空地图
     * @return {IHiMap}
     */
    HiMap.prototype.clearMap = function(){
    	this.map.graphics.clear();
    };
    //在地图上清除所有的对象.
    HiMap.prototype.clearOverlays = HiMap.prototype.clearMap;
    HiMap.prototype.clear = HiMap.prototype.clearMap;
    
    /**
     * 在当前地图上加入给定的对象
     * @param {HiOverlay} overlay 
     * @return {IHiMap}
     */
    HiMap.prototype.addOverlay = function (overlay){
    	this.map.graphics.add(overlay.graphic);
		return overlay;
    };

    /**
     * 在当前地图上删除给定的对象
     * @param {HiOverlay} overlay 
     * @return {IHiMap}
     */
    HiMap.prototype.removeOverlay = function (overlay){
    	this.map.graphics.remove(overlay.graphic);
    	/*if(null!=overlay.titleGraphic){
			this.map.graphics.add(overlay.titleGraphic);
		}*/
		return this;
    };
    
    //增加地图状态变化时执行的操作，func为函数
    HiMap.prototype.addMapChangeListener = function (func){
    	this.map.on("pan-end",func);
    	this.map.on("zoom-end",func);
    	return this;
    };
    
    /**
     *在地图上叠加一个设备图标
     *  @typedef {Object} ShowDeviceParam
     *  @property {String} deviceid 设备编号
     *  @property {String} devicetype 设备类型
     *  @property {Boolean} [centable] 是否居中展示,默认false
     *************************************************
     * @param {ShowDeviceParam} params 参数对象，可选的字段参考ShowDeviceParam定义
     * @return HiDeviceMarker 返回叠加到地图上的设备对象
     */
    HiMap.prototype.showDevice = function (params) {
    	
    };
    
    /**显示自定义点
	*strCoords 点坐标
	*title 标题 
	*imgurl 图标地址
	*width 图标宽度
	*height 图标高度
	*infowindow 弹出信息窗的内容
	*centable 是否居中定位
	*titlebgcolor	标题背景色
	*showtitle 是否始终展示标题
	*titlecolor	标题字体颜色
	*/
    HiMap.prototype.showMonitor = function(strcoords,title,imgurl,width,height,infowindow,centable,titlebgcolor,showtitle,titlecolor){
    	if(strcoords==null || strcoords==""|| strcoords.split(",").length!=2 || strcoords==","){
			return;
		}
		var point = new HiPoint(strcoords.split(",")[0],strcoords.split(",")[1]);
		
		var tbgcolor = '#FFFFFF';
		if(typeof(titlebgcolor)=="string") {
			tbgcolor = titlebgcolor;
		}
		if(titlecolor == null){
			titlecolor = "#000000";
		}
		var pTitle = new HiTitle(title, 13, 7, "Microsoft YaHei", titlecolor,tbgcolor,'#FFFFFF', 1, "true");
		var pIcon = new HiIcon();
		pIcon.width = width || 24; 
		pIcon.height = height || 24;
		pIcon.image = imgurl;
		var newmarker = new HiMarker(point, pIcon, pTitle);
		//newmarker.titleDiv.style.borderTopWidth = '5px';
		//newmarker.titleDiv.style.borderBottomWidth = '5px';
		
		newmarker.hideTitle();
		if(title==null || title==""){
		}else if(showtitle) {
            newmarker.showTitle();
        }else{
	    	newmarker.addListener("mouseover", function() {
				newmarker.showTitle();
			});
			newmarker.addListener("mouseout", function() {
				newmarker.hideTitle();
			});
		}
		if(infowindow!=null && infowindow!=""){
			newmarker.addListener("click", function() {
			   // _MapApp.map.infoWindow.offscreenContainer.style.zIndex = 5001;
			    // _MapApp.map.infoWindow.offscreenArea.style.zIndex = 5001;
				newmarker.openInfoWindowHtml(infowindow);
			   // _MapApp.map.infoWindow.contentArea.style.backgroundColor = "red";
				//_MapApp.map.infoWindow.offscreenContainer.style.zIndex = 5001;
				// _MapApp.map.infoWindow.offscreenArea.style.zIndex = 5001;
				
				
			});
		}
		
		this.addOverlay(newmarker);
		if(centable!=false && centable!="false"){
			_MapApp.centerAndZoom(point,_MapApp.getZoomLevel());
		}
		return newmarker;
    }
    
    	/**显示矩形
	*strCoords 坐标点
	*infohtml 点击弹出信息框的内容
	*color 边框颜色
	*weight 边框宽度
	*opacity 透明度
	*fillcolor 填充颜色
	*centable 是否居中，默认居中
	*/
	HiMap.prototype.showRect = function(strCoords, infohtml,color, weight, opacity, fillcolor,centable){
		color = color||"blue";
		weight = weight||2;
		opacity = opacity||0.5;
		fillcolor = fillcolor||"red";
		var pRect = new HiRectangle(strCoords,color,weight,opacity,fillcolor);
		
		this.addOverlay(pRect);// 将多义线对象添加到地图中
		
		return pRect;
	}
    
    //在指定的位置显示信息
    HiMap.prototype.openInfoWindow = function(pPoint,html){
    	var infoWindow = this.map.map.infoWindow;
		infoWindow.setTitle("信息窗口");
		infoWindow.setContent(html);
		infoWindow.show(this.map.map.toScreen(pPoint), this.map.map.getInfoWindowAnchor(this.map.map.toScreen(pPoint)));
    };
    
    //返回当前视窗的经纬度边框.类型:MBR
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
    
    var HiMBR = function(minX,minY,maxX,maxY){
    
    	this.extent = new Extent(minX,minY,maxX,maxY,new SpatialReference({ wkid: 4326 }));
    	
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
		//获取MBR的中心点;Point类型
		this.centerPoint = noop;
		//获取X方向的跨度
		this.getSpanX = noop;
		//获取Y方向的跨度
		this.getSpanY = noop;
		//E为小数:0~10
		//MBR中心扩大其边框
		this.scale = function(e){};
		
		//是否包含pMBR，返回类型：boolean
		this.containsBounds = function(pMBR){};
		//是否包含点，返回类型：boolean
		this.containsPoint = function(point){
			if(point instanceof Point){
				return this.extent.contains(point.point);
			}else if(point instanceof HiPoint){
				return this.extent.contains(point.point);
			}
		};
		//拓展边界，参数可以是Point或MBR类型，返回类型：无
		this.extend = function(pMBR){};
		//返回指定的2个MBR对象的相交部分的MBR，返回类型MBR
		this.Intersection = function(pMBR1,pMBR2){};
		//返回指定的2个MBR对象的并集部分的MBR，返回类型MBR
		this.union = function(pMBR1,pMBR2){};
		//获取其中心点，返回类型为:Point
		this.getCenterPoint = function(){};
	}

    

	//叠加信息类的基类
    var HiOverLay = function (){

        this.id;
        this.paths = null;
        this.points = new Array();
        this.point = null;
        this.iLen = null;
        this.iPause = null;
        this.timeInterval = 1000;
        this.bIsRepeat = false;
        this.bIsPlay = false;
        this.iZIndex = 100;
        this.dispStatus = 1;
        this.startSeq = 0;
        this.endSeq = 0;
        this.dScale = 1;
        this.startScaleSeq = 0;
        this.endScaleSeq = 0;
        this.statusSet = new Array();
        this.dragObject = null;
        this.bIsSyRedraw = true;
        this.map = null;
        this.angle = 0;
        this.color = "red";
        this.opacity = 1;
        this.editable = false;
        this.bIsCenter = false;

        //设置其在图上的显示顺序，相当于设置其图层顺序
        this.setZIndex = function(iIndex){};

        //获得其在图上的显示顺序，整形
        this.getZIndex = function(){};

        //闪烁，出现和不出现之间交替3次
        this.flash = function(){};

        //触发onclick事件
        this.nclick = function(){};

        //功能:增加显示的状态
        //参数:
        //iStartS:开始周期
        //iEndS:结束周期
        //iStatus:状态(1:显示;2:隐藏;3:闪烁)
        this.addDispStatus  = function(iStartS,iEndS,iStatus){};


        //图元可以移动，Func为回调函数。可以调研该函数获取其坐标：_CurentOverLay.toString()
        this.startMove = function(func){};

        //功能:设置生长状态
        //参数:
        //iStartS:开始周期
        //iEndS:结束周期
        //dSScale:开始比例
        //dEScale:结束比例
        this.setExtendStatus  = function(iStartS,iEndS,dSScale,dEScale){};


        //功能:设置路径
        //参数:
        //iStartS:开始周期
        //iEndS:结束周期
        //strPoints:轨迹,如:"116.3,39.4,116.5,39.4"
        this.setPath  = function(iStartS,iEndS,strPoints){}


        //功能:显示某周期的状态
        //参数:
        //iSeq:周期
        this.showStatus  = function(iSeq){};


        //缩放
        this.scale = function(dscale){};

        //开始推演, bIsCenter:是否实时对中,默认为:false
        this.play = function(bIsCenter){};

        //停止推演
        this.stop = function(){};

        //可以编辑图形
        this.nableEdit = function(){};

        //不可以编辑图形
        this.disableEdit = function(){};

        //获取透明度
        this.getOpacity = function(){};

        //设置透明度
        this.etOpacity = function(arg){};

        //获取点坐标，Point类型
        this.getPoint = function(){};

        //设置信息定位点，Point类型
        this.etPoint = function(pPoint){};

        //angle:为旋转角度,container为对象，如果为空，默认为本身的容器对象
        this.rotate = function(angle,container){}

    };

    //点
    var HiPoint = function(x,y){
    	
    	if((x+"").split(",").length == 2){
    		y = (x+"").split(",")[1];
    		x = (x+"").split(",")[0];
    	}
    	this.point = new Point(x,y);
        this.x = x;
        this.y = y;

        /**
         * 判断2点是否大概相等
         * @param hiPoint
         * @return {Boolean}
         */
        this.approxEquals = function(hiPoint){};

        /**
         * 判断2点是否相等
         * @param hiPoint
         * @return {Boolean}
         */
        this.equals= function(hiPoint){};

    }

    var HiIcon = function (image,width,height,leftOffset,topOffset){
    

        //图片名称
        this.image = image;
    	

        //图片宽度
        this.width = height;

        //图片高度
        this.height = height;

        //图片X方向偏移量
        this.leftOffset = leftOffset;

        //图片Y方向偏移量
        this.topOffset = topOffset;
    }

    var HiTitle = function(name,fontSize,pos,font,color,bgColor){
		this.font = new Font();
		this.font.setFamily(font);
		this.font.setSize(fontSize);
		this.textSymbol = new TextSymbol(name,this.font,color);
	
		this.setOffset = function (x,y){
			this.textSymbol = this.textSymbol.setOffset(x,y);
		}

        //标题名称如:"北京"
        this.name = name;

        //字体大小:如:14
        this.fontSize = fontSize;

        this.pos = pos;

        //颜色,如:"red"
        this.color = color;

        this.bgColor = bgColor;


        //设置图标显示位置
        this.setPoint = function(pPoint){}

        //获取其位置，类型为Point
        this.getPoint = function(){}

    }
    
    /*points由："x1,y1,x2,y2"组成，可以是String类型； 
	 color表示颜色，支持格式是如"#0000ff"或“red”)；
	 weight表示线的宽度，它是整形的；
	 opacity表示线的透明度，浮点型，值的范围是0～1；
	 fillcolor为填充的颜色.
	*/
    var HiRectangle = function(points, color, weight, opacity,fillcolor){
    	var cord = points.split(",");
    	this.points = points;
    	this.singleRingPolygon = new Polygon([[cord[0], cord[1]],[cord[2], cord[3]],[cord[4], cord[5]],[cord[6], cord[7]],[cord[8], cord[9]]]);
		var symbol = new SimpleFillSymbol(SimpleFillSymbol.STYLE_SOLID, new SimpleLineSymbol(SimpleLineSymbol.STYLE_DASHDOT, new dojo.Color([255, 0, 0]), 2), new dojo.Color([255, 255, 0, 0.25]));
		this.graphic = new Graphic(this.singleRingPolygon, symbol);
		this.getMBR = function(){
			return cord[0]+","+cord[1]+","+cord[4]+","+cord[5];
		}
    }

    //Marker是在地图上显示单个带有图标的对象
    var HiMarker = function (point,icon,title){
        this.point = point;
        this.icon = icon;
        this.title = title;
        
        
        var pictureMarkerSymbol = new PictureMarkerSymbol(icon.image,icon.width,icon.height);
        var json = {title:this.title.name,content:" "}
        this.infoTemplate = new InfoTemplate(json);
        this.graphic = new Graphic(point.point,pictureMarkerSymbol,{"marker":this},this.infoTemplate);
        if(title instanceof HiTitle){
        	var titlepoint = new Point(point.x,point.y-(-0.00007));
			this.titleGraphic= new Graphic(titlepoint,title.textSymbol);
		}
        

        //显示信息筐
		this.openInfoWindowHtml= function (htmlStr){
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
		this.addListener= function (action,fuct){
			var layer = map.graphics;
			if(action == "click"){
				this.clickFunc = fuct;
			}else if(action == "dblclick"){
			}else if(action == "mouseover"){
			}else if(action == "mouseout"){
			}
		}

        //获取当前的图层序列
        this.etZIndex= function (){};

        //设置图层系列
        this.setZIndex= function (int){};

        //显示标题
        this.showTitle= function (){
        	map.graphics.add(this.titleGraphic);
        };

        //隐藏标题
        this.hideTitle= function (){
        	map.graphics.remove(this.titleGraphic);
        };

        //设置图标显示位置
        this.setPoint= function (pPoint){};

        //获取其位置，类型为Point
        this.getPoint= function (){}
    };
    
	//××××××××××××××××××××××××××方法内部定义结束×××××××××××××××××××××××××××
	
    //外部调用接口
    return {
    	HiMap : HiMap,
    	HiMBR : HiMBR,
    	HiOverLay : HiOverLay,
    	HiPoint : HiPoint,
    	HiIcon : HiIcon,
    	HiTitle : HiTitle,
    	HiMarker : HiMarker
    	
    }

});
	



