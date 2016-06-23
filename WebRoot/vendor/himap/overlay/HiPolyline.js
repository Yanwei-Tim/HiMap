/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
	
    var HiPolyline = function(points, color, weight, opacity,arrow){
    	this.points = points;
    	this.color = color;
    	this.opacity = opacity;
    	this.arrow = arrow;
		this.polyline = null;
		this.init(points, color, weight, opacity,arrow);
    };
    
	
	HiPolyline.prototype.init = function(points, color, weight, opacity , arrow){};
	
    HiPolyline.prototype.addListener = function(action, func){};
	
	HiPolyline.prototype.getCoordSequence = function(){};
	
	HiPolyline.prototype.getGeometryType = function(){};
	
	HiPolyline.prototype.getLength  = function(){};
		
	HiPolyline.prototype.getMBR = function(){};
	
	HiPolyline.prototype.getLineStyle = function(){};
	
	HiPolyline.prototype.getZIndex = function(){};
	
	HiPolyline.prototype.openInfoWindowHtml = function(strHTML){};
	
	HiPolyline.prototype.setLineStyle = function(lineStyle){};
	
	HiPolyline.prototype.setZIndex = function(iIndex){};
	
	
	
    return HiPolyline;

});