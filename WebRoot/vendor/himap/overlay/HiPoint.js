/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
    
    var HiPoint = function(x,y){
		this.x = x;
		this.y = y;
		this.point = null;
		this.init(x,y);
	};
	
	//构造函数，在实现类中重写
	HiPoint.prototype.init = function(x,y){
	};
	
	/**
	 * 判断2点是否大概相等
	 * @param hiPoint
	 * @return {Boolean}
	 */
	HiPoint.prototype.approxEquals = function(hiPoint){
	};
	
	/**
	 * 判断2点是否相等
	 * @param hiPoint
	 * @return {Boolean}
	 */
	HiPoint.prototype.equals= function(hiPoint){
	};
	
	return HiPoint;

});