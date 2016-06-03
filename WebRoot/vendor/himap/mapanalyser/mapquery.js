/**
 * Created by liuxiaobing on 2016-1-5.
 */
define(["tool/tools"], function(Tools) {
	//空方法
    function noop(){
    }

	var mapQuery = function () {

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
    };
    
    return mapQuery;

});