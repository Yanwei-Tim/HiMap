/**
 * Created by liuxiaobing on 2016-1-5.
 */
define(['himapurl/dijit/dt/DataTool'], function(DataTool) {

	return function(){
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
        *             "queryByPolygon" 多边形内部查询, "queryByCircle" 圆形内部查询
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
	}
       
       

});