(function () {

    //空方法
    function noop(){}



    var IHiMap = function (mapdiv,mapInitParams) {
		this.mapdiv = mapdiv;
		this.mapInitParams = mapInitParams;
        this.map = null;

        /*************************************PGIS 接口部分******************************************/
        /**地图控件**/
        this.addControl = noop;

        this.showMapControl = noop;

        //隐藏地图操作控件
        this.hideMapControl = noop;

        //显示版权信息
        this.showCopyright = noop;

        //隐藏版权信息
        this.hideCopyright = noop;

        //显示比例尺信息
        this.showMapScale = noop;

        //隐藏比例尺信息
        this.hideMapScale = noop;

        /**鹰眼操作**/
        this.addOverView = function(HiOverView){};

        //显示鹰眼
        this.showOverView = noop;

        // 隐藏鹰眼
        this.hideOverView = noop;

        //鹰眼显示和不显示之间来回切换
        this.reverseOverView = noop;

        /**地图操作**/
        this.zoomIn = noop;

        //拉框放大
        this.zoomInExt = noop;

        //缩小
        this.zoomOut = noop;

        //拉框缩小
        this.zoomOutExt = noop;

        //参数为空的情况下设置平移状态,如果存在参数x,y,则相应向X,Y方向进行移动
        this.pan = function(x,y){};

        //测距离
        this.measureLength = noop;

        //测面积
        this.measureArea = noop;

        //全图显示.
        this.fullExtent = noop;

        //对中
        this.gotoCenter = noop;

        //打印
        this.print = noop;

        //清除
        this.clear = noop;

        //地图对中到给定的点
        this.centerAtLatLng = function(centerPoint){};

        //对中到给定的坐标，如果该点在当前视图上，则进行平移到该点为地图中心.
        this.recenterOrPanToLatLng = function(latLng){};

        //缩放到给定的级别
        this.zoomTo = function(zoomLevel){};

        //对指定的范围进行地图对中
        this.centerAtMBR = function(dInMinX,dInMinY,dInMaxX,dInMaxY){};

        /**
         * 地图定位，同 moveTo
         * @param {(String|HiPoint)} strCoords 地图中心点
         * @param {Number} [zoomlevel]	地图显示级别
         * @return {IHiMap}
         */
        this.centerAndZoom  = function(latLng, zoomLevel){	};

        //在指定的位置显示信息
        this.openInfoWindow = function(pPoint,html){};

        //返回地图中心的坐标，类型为Point
        this.getCenterLatLng = noop;

        //返回当前视窗的经纬度边框.类型:HiMBR
        this.getBoundsLatLng = noop;

        //返回地图的当前级别，返回类型为int
        this.getZoomLevel = noop;

        //返回地图的最大级别，返回类型为int
        this.getMaxLevel = noop;

        //获取指定的范围的级别，返回类型为int
        this.getLevelOfMBR = function(dInMinX,dInMinY,dInMaxX,dInMaxY){};

        //获取当前绘制模式,字符串
        this.getDragMode = noop;

        /**
         * 改变操作模式
         * @param {String} drawmode 操作模式 可用的有：
         " measure":测量 "pan":平移模式 “drawPoint”：获取坐标点 “drawCircle”：画圆 “drawRect”：画矩形 “drawPolyline”：画线 “drawPolygon”：画多边型 
         * @param {Function} [callback]	回调函数
         */
        this.changeDragMode = function(drawmode,callback){};

        /**
         * 在当前地图上加入给定的对象
         * @param {HiOverlay} overlay 对象
         * @return {IHiMap}
         */
        this.addOverlay = function (overlay){ };

        //在地图上删除给定的对象
        this.removeOverlay = function (overlay){};

        //在地图上清除所有的对象.
        this.clearOverlays = noop;

        //返回信息叠加类，iOverLay对象的数组
        this.getOverlays = noop;

        //获取当前编辑的信息对象。iOverLay对象类型
        this.getCurrentEditor =noop;

        //增加地图状态变化时执行的操作，func为函数
        this.addMapChangeListener = function (func){};

        //删除地图状态变化时执行的操作，func为函数
        this.removeMapChangeListener = function (func){};

        /*************************************自定义接口部分******************************************/
        /**
         * 清空地图
         * @return {IHiMap}
         */
        this.clearMap = noop;

        /**
         * 地图定位，同 centerAndZoom
         * @param {(String|HiPoint)} strCoords 地图中心点
         * @param {Number} [zoomlevel]	地图显示级别
         * @return {IHiMap}
         */
        this.moveTo = function (strCoords,zoomlevel){
			return this.centerAndZoom();
		};

        /**
         * 设置地图中心点
         * @param {(String|HiPoint)} strCoords
         * @return {IHiMap}
         */
        this.setCenter = function (strCoords) {};

        /**
         * 画点
         * @param {function(String)} [callback] 回调函数
         * @return {IHiMap}
         */
        this.drawPoint = function (callback) {};

        /**
         * 画矩形
         * @param {function(String)} [callback] 回调函数
         * @return {IHiMap}
         */
        this.drawRect = function (callback) {};

        /**
         * 画圆
         * @param {function(String)} [callback] 回调函数
         * @return {IHiMap}
         */
        this.drawCircle = function (callback) {};

        /**
         * 画线
         * @param {function(String)} [callback] 回调函数
         * @return {IHiMap}
         */
        this.drawPolyline = function (callback) {};

        /**
         * 画多边形
         * @param {function(String)} [callback] 回调函数
         * @return {IHiMap}
         */
        this.drawPolygon = function (callback) {};

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
        this.showDevice = function (params) {};

        /**
         * 删除一个叠加到地图上的设备图标
         * @param {(HiDeviceMarker|String)} deviceMonitor 叠加到地图上的设备对象，或者一个具体的设备编号
         * @return {IHiMap}
         */
        this.removeDevice = function (deviceMonitor) {};

        /**
         * 在地图上叠加自定义图标
         *  @typedef {Object} ShowMonitorParam
         *  @property {String} strcoords 坐标点
         *  @property {String} title 标题
         *  @property {String} imgurl 图标路径
         *  @property {Number} [width] 图标宽度，默认24
         *  @property {Number} [height] 图标高度，默认24
         *  @property {String} [infowindow] 弹出信息框的内容，默认为空
         *  @property {Boolean} [centable] 是否居中展示,默认false
         *  @property {String} [titlebgcolor] 标题背景色,默认白色
         *  @property {Boolean} [showtitle] 是否始终展示标题，默认false，当鼠标移上时展示标题
         *  @property {String} [titlecolor] 标题颜色,默认黑色
         **************************************************
         * @param {ShowMonitorParam} params 参数对象，可选的字段参考ShowDeviceParam定义
         * @return {HiMarker} 返回叠加到地图上的自定义图标对象
         */
        this.showMonitor = function (params) {};

        /**
         * 删除自定义图标
         * @param {HiMarker} marker
         * @return {IHiMap}
         */
        this.removeMonitor = function (marker) {};

        /**根据xml展示自定义点,xml格式：
         *<marker id='...'>                    id 为marker 的唯一标识
         *    <title>..</title>                标题
         *    <x>...</x>                        经度
         *    <y>...</y>                        纬度
         *    <templateid>..</templateid>        模板编号，决定marker的图标和弹出信息窗的内容，在IHiMapConfig.js 文件中定义
         *    <centable></centable>            是否居中显示，值为true或false。默认为false
         *   <showtitle></showtitle>            是否始终展示标题
         *    <markerinfo>
         *        <...>                        自定义的内容
         *    </markerinfo>
         *</marker>
         */
        this.showMonitorByXML = function (strxml) {};


        //同时显示多个地图元素
        this.showMuliObj = function (markers, callback) {

        };

        //删除多个地图元素,根据模板名称
        this.removeMuliObj = function (templateid) {

        };

        //同时显示多个设备,按需加载，只展示视野范围内的设备
        this.showMultDevice = function (markerArr, callback, id) {};


        /**
         * 显示一条线
         *strCoords 坐标点集合
         *infohtml 点击弹出信息框的内容
         *color 线的颜色
         *weight 线的宽度
         *opacity 透明度
         *arrow 线的方向 0：无方向（默认）；1：为正方向；-1：为负方向
         *linestyle 线形 "none","dash","dashdot","dot","longdash","longdashdot","shortdash","shortdashdot","shortdashdotdot","longdashdotdot","shortdot"
         *centable 是否居中，默认居中
         */
        this.showPolyline = function (strCoords, infohtml, color, weight, opacity, arrow, linestyle, centable) {};


        /**
         * 显示矩形
         *strCoords 坐标点
         *infohtml 点击弹出信息框的内容
         *color 边框颜色
         *weight 边框宽度
         *opacity 透明度
         *fillcolor 填充颜色
         *centable 是否居中，默认居中
         */
        this.showRect = function (strCoords, infohtml, color, weight, opacity, fillcolor, centable) {};

        /**
         * 显示多边形
         *strCoords 坐标点集合
         *infohtml 点击弹出信息框的内容
         *color 边框颜色
         *weight 边框宽度
         *opacity 透明度
         *fillcolor 填充颜色
         *centable 是否居中，默认居中 true
         */
        this.showPolygon = function (strCoords, infohtml, color, weight, opacity, fillcolor, centable) {};


        /**
         * 波纹效果
         *strCoords 中心点
         *radius 半径
         */
        this.showWave = function (strCoords, radius) {};

        /**
         * 显示圆
         *strCoords 坐标点集合
         *infohtml 点击弹出信息框的内容
         *color 边框颜色
         *weight 边框宽度
         *opacity 透明度
         *fillcolor 填充颜色
         *centable 是否居中，默认居中 true
         */
        this.showCircle = function (strCoords, infohtml, color, weight, opacity, fillcolor, centable) {};


        /************信息查询接口**************/

            //点查询
        this.queryPoint = function (strCoords, callback) {};

        /**
         * 点周边查询
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *distance 周边距离 单位米
         *callback 回调函数
         */
        this.queryByPoint = function (strCoords, devicetype, distance, callback) {};

        /**
         * 线周边查询
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *distance 周边距离 单位米
         *callback 回调函数
         */
        this.queryByLine = function (strCoords, devicetype, distance, callback) {};

        /**
         * 线周边查询,并按到起点的顺序排序
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *distance 周边距离 单位米
         *callback 回调函数
         */
        this.queryByLineOrderByStart = function (strCoords, devicetype, distance, callback) {};

        /**
         * 矩形内部查询
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *callback 回调函数
         */
        this.queryByRect = function (strCoords, devicetype, callback) {};

        /**
         * 多边形内部查询
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *callback 回调函数
         */
        this.queryByPolygon = function (strCoords, devicetype, callback) {};

        /**
         * 圆形内部查询
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *callback 回调函数
         */
        this.queryByCircle = function (strCoords, devicetype, callback) {};

        /**
         * 按照给定的sql语句进行查询
         *sql 查询语句中的参数，"#"分割
         *callback 回调函数
         */
        this.queryBySQL = function (sql, callback) {};


        /**
         *路段查询
         *strCoords    坐标点
         *querytype    "queryByPoint" 点周边查询,  "queryByLine" 线周边查询,  "queryByRect" 矩形内部查询,
         *            "queryByPolygon" 多边形内部查询, "queryByCircle" 圆形内部查询
         *distance    搜索距离，内部查询该字段留空
         *callback    回调函数，返回搜索到的路段
         */

        this.queryRoad = function (strCoords, querytype, distance, callback) {};



        /**画点查询
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *distance 查询距离
         *callback 回调函数
         */
        this.queryByDrawPoint = function (devicetype, distance, callback) {
            this.drawPoint(function (strCoords) {
                this.queryByPoint(strCoords, devicetype, distance, callback);
            });
        };
        //画线查询
        this.queryByDrawLine = function (devicetype, distance, callback) {
            this.drawPolyline(function (strCoords) {
                this.queryByLine(strCoords, devicetype, distance, callback);
            });
        };
        //画多边形查询
        this.queryByDrawRect = function (devicetype, distance, callback) {
            this.drawPolyline(function (strCoords) {
                this.queryByRect(strCoords, devicetype, distance, callback);
            });
        };
        //拉框查询
        this.queryByDrawPolygon = function (devicetype, distance, callback) {
            this.drawPolyline(function (strCoords) {
                this.queryByPolygon(strCoords, devicetype, distance, callback);
            });
        };
        //画圆查询
        this.queryByDrawCircle = function (devicetype, distance, callback) {
            this.drawPolyline(function (strCoords) {
                this.queryByCircle(strCoords, devicetype, distance, callback);
            });
        };

        //查询所有的GPS设备
        this.queryAllGPS = function (callback) {


        };

        //判断两个坐标点之间的距离 单位米
        this.getDistanceInLL = function (str1, str2) {

        };

        //将米转换成经纬度
        this.changeMeterToDegree = function (strCoords, distance) {

        };

        /**轨迹回放
         *ioverlay 轨迹回放的图层
         *strCoords 轨迹,如:"116.3,39.4,116.5,39.4"
         *start 开始节点
         *end 结束节点
         *devicetype 设备类型
         */
        this.startPlay = function (ioverlay, strCoords, startindex, endindex, timeInterval) {


        };

        /**暂停轨迹回放
         *ioverlay 轨迹回放的图层
         */
        this.stopPlay = function (ioverlay) {

        };
        /**继续轨迹回放
         *ioverlay 轨迹回放的图层
         */
        this.resetPlay = function (ioverlay) {

        };

        /**调整轨迹回放速度
         *ioverlay 轨迹回放的图层
         *interval 轨迹回放的速度
         */
        this.resetTimeInterval = function (ioverlay, interval) {

        };


        /**轨迹回放过程中跳转到指定位置
         *ioverlay 轨迹回放的图层
         */
        this.jumpTo = function (ioverlay, index) {};

        /**清除地图上的轨迹回放
         *ioverlay 轨迹回放的图层
         */
        this.clearPlay = function (ioverlay) {};

        /**地图打印方法
         *urlCSS 是否添加页眉页脚
         *strTitle 页眉文字内容
         *strBottom 页脚文字内容
         *
         */
        this.printmap = function (urlCSS, strTitle, strBottom) {};


        /********************信息编辑接口**************/
        this.addPoint = function (deviceid, callback) {

        };
        this.addLine = function (deviceid, callback) {

        };

        this.addPoly = function (deviceid, callback) {

        };

        this.editPoint = function (deviceid, callback) {

        };
        this.editLine = function (deviceid, callback) {

        };

        this.editPoly = function (deviceid, callback) {

        };

        this.delPoint = function (deviceid, callback) {

        };
        this.delLine = function (deviceid, callback) {

        };

        this.delPoly = function (deviceid, callback) {

        };
    };



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

        //标题名称如:"北京"
        this.name = name;

        //字体大小:如:14
        this.fontSize = fontSize;

        this.pos = pos;

        //字体,如:"宋体"
        this.font = font;

        //颜色,如:"red"
        this.color = color;

        this.bgColor = bgColor;

        //设置图标显示位置
        this.setPoint = function(pPoint){}

        //获取其位置，类型为Point
        this.getPoint = function(){}

    }

    //Marker是在地图上显示单个带有图标的对象
    var HiMarker = function (point,icon,title){
        this.base = iOverLay;
        this.base();

        this.point = point;
        this.icon = icon;
        this.title = title;

        //显示信息筐
        this.openInfoWindowHtml= function (htmlStr){
        };

        //加入事件，其中action为字符型,可以是如下:
        //'click'：点击
        //'dblclick'：双击
        //'mouseover'：鼠标在上面移动
        //'mouseout'：鼠标移出
        this.addListener= function (action,fuct){
        };

        //获取当前的图层序列
        this.etZIndex= function (){};

        //设置图层系列
        this.setZIndex= function (int){};

        //显示标题
        this.showTilte= function (){};

        //隐藏标题
        this.hideTitle= function (){};

        //设置图标显示位置
        this.setPoint= function (pPoint){};

        //获取其位置，类型为Point
        this.getPoint= function (){}
    };
    
    /*points由："x1,y1,x2,y2"组成，可以是String类型； 
	 color表示颜色，支持格式是如"#0000ff"或“red”)；
	 weight表示线的宽度，它是整形的；
	 opacity表示线的透明度，浮点型，值的范围是0～1；
	 fillcolor为填充的颜色.
	*/
    var HiRectangle = function(points, color, weight, opacity,fillcolor){
    }
    
	var HiMBR = function(minX,minY,maxX,maxY){
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
		this.containsPoint = function(point){};
		//拓展边界，参数可以是Point或MBR类型，返回类型：无
		this.extend = function(pMBR){};
		//返回指定的2个MBR对象的相交部分的MBR，返回类型MBR
		this.Intersection = function(pMBR1,pMBR2){};
		//返回指定的2个MBR对象的并集部分的MBR，返回类型MBR
		this.union = function(pMBR1,pMBR2){};
		//获取其中心点，返回类型为:Point
		this.getCenterPoint = function(){};
	}

    this.IHiMap = IHiMap;
    var EzMap = IHiMap;

    if (typeof exports !== 'undefined') {
        exports.IHiMap = IHiMap;
    }
})();





