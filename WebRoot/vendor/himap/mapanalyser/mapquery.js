/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([himappath+"tool/tools"], function(Tools) {

	var mapQuery = function () {

        /**
         * 点周边查询
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *distance 周边距离 单位米
         *callback 回调函数
         */
        this.queryByPoint = function (strCoords, devicetype, distance, callback) {
			this.queryDevice(strCoords,devicetype,"queryByPoint",distance,callback);
		};

        /**
         * 线周边查询
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *distance 周边距离 单位米
         *callback 回调函数
         */
        this.queryByLine = function (strCoords, devicetype, distance, callback) {
			this.queryDevice(strCoords,devicetype,"queryByLine",distance,callback);
		};

        /**
         * 线周边查询,并按到起点的顺序排序
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *distance 周边距离 单位米
         *callback 回调函数
         */
        this.queryByLineOrderByStart = function (strCoords, devicetype, distance, callback) {
			this.queryDevice(strCoords,devicetype,"queryByLineOrderByStart",distance,callback);
		};

        /**
         * 矩形内部查询
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *callback 回调函数
         */
        this.queryByRect = function (strCoords, devicetype, callback) {
			this.queryDevice(strCoords,devicetype,"queryByRect",null,callback);
		};

        /**
         * 多边形内部查询
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *callback 回调函数
         */
        this.queryByPolygon = function (strCoords, devicetype, callback) {
			this.queryDevice(strCoords,devicetype,"queryByPolygon",null,callback);
		};

        /**
         * 圆形内部查询
         *strCoords 坐标点
         *devicetype 要查询的设备类型,逗号分隔,如: "01,13,19"
         *callback 回调函数
         */
        this.queryByCircle = function (strCoords, devicetype, callback) {
			this.queryDevice(strCoords,devicetype,"queryByCircle",null,callback);
		};


        /**
         *设备查询
         *strCoords    坐标点
         *devicetype   设备类型
         *querytype   "queryByPoint" 点周边查询,  "queryByLine" 线周边查询,  "queryByRect" 矩形内部查询,
         *            "queryByPolygon" 多边形内部查询, "queryByCircle" 圆形内部查询,
		 *            "queryByLineOrderByStart",线周边查询，按到起点距离排序
         *distance    搜索距离，内部查询该字段留空
         *callback    回调函数，返回搜索到的设备
         */
		this.queryDevice = function(strCoords,devicetype,querytype,distance,callback){
        	if(strCoords.split(",").length<2){
				alert("参数不正确");
				return;
			}
			if(distance == null){
				distance = "";
			}
			var url =  HiMapConfig.HOSTNAME+'query/queryEquip?querytype='+querytype+'&distance='+distance+'&strCoords='+strCoords+"&devicetype="+devicetype;
			Tools.sendAjax(url,function(data){
				callback.call(this,data);
			});
		}

        /**
         *路段查询
         *strCoords    坐标点
         *querytype   "queryByPoint" 点周边查询,  "queryByLine" 线周边查询,  "queryByRect" 矩形内部查询,
         *            "queryByPolygon" 多边形内部查询, "queryByCircle" 圆形内部查询
         *distance    搜索距离，内部查询该字段留空
         *callback    回调函数，返回搜索到的路段
         */
        this.queryRoad = function (strCoords, querytype, distance, callback) {
        	if(strCoords.split(",").length<2){
				alert("参数不正确");
				return;
			}
			if(distance == null){
				distance = "";
			}
			var url =  HiMapConfig.HOSTNAME+'query/queryRoad?querytype='+querytype+'&distance='+distance+'&strCoords='+strCoords;
			Tools.sendAjax(url,function(data){
				callback.call(this,data);
			})
        };
        
    };
    
    return mapQuery;

});
