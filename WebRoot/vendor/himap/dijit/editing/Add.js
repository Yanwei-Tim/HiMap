/**
 * Created by liuxiaobing on 2016-1-5.
 */
define(["himap"], function(HiMap) {
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

});