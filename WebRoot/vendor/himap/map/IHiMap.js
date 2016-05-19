/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
	//空方法
    function noop(){}
    
	var HiMap = function (mapdiv,mapInitParams) {
		this.mapdiv = mapdiv;
		this.mapInitParams = mapInitParams;
        this.map = null;
        this.mapurl = "";
        this.centerpoint = "";
        this.mapmaxlevel = "";
        this.initlevel = "";
        this.geoserverURL = "";

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

  

        /**地图打印方法
         *urlCSS 是否添加页眉页脚
         *strTitle 页眉文字内容
         *strBottom 页脚文字内容
         *
         */
        this.printmap = function (urlCSS, strTitle, strBottom) {};


  
    };
    
    return HiMap;

});