/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
    
    function noop(){}
    
    var HiMBR = function(minX,minY,maxX,maxY){
		this.minX = minX;
		this.minY = minY;
		this.maxX = maxX;
		this.maxY = maxY;
		this.mbr = null;
		this.init();
	};
	
	//构造函数，在实现类中重写
	HiMBR.prototype.init = noop;
	
	//获取MBR的中心点;Point类型
	HiMBR.prototype.centerPoint = noop;
	
	//获取X方向的跨度
	HiMBR.prototype.getSpanX = noop;
	
	//获取Y方向的跨度
	HiMBR.prototype.getSpanY = noop;
	
	//E为小数:0~10
	//MBR中心扩大其边框
	HiMBR.prototype.scale = function(e){
		alert("dede");
	};
	
	//是否包含pMBR，返回类型：boolean
	HiMBR.prototype.containsBounds = function(pMBR){
	};
	
	//是否包含点，返回类型：boolean
	HiMBR.prototype.containsPoint = function(point){
	};
	
	//拓展边界，参数可以是Point或MBR类型，返回类型：无
	HiMBR.prototype.extend = function(pMBR){
	};
	
	//返回指定的2个MBR对象的相交部分的MBR，返回类型MBR
	HiMBR.prototype.Intersection = function(pMBR1,pMBR2){
	};
	
	//返回指定的2个MBR对象的并集部分的MBR，返回类型MBR
	HiMBR.prototype.union = function(pMBR1,pMBR2){
	};
	
	//获取其中心点，返回类型为:Point
	HiMBR.prototype.getCenterPoint = noop;
	
	
	return HiMBR;

});