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
	
    HiPolyline.prototype.addListener = function(action, func){
		this.polyline.addListener(action,func);
	};
	
	HiPolyline.prototype.getCoordSequence = function(){
		this.polyline.getCoordSequence();
	}
	
	HiPolyline.prototype.getGeometryType = function(){
		return this.polyline.getGeometryType();
	};
	
	HiPolyline.prototype.getLength  = function(){
		return this.polyline.getLength();
	}
		
	HiPolyline.prototype.getMBR = function(){
		return this.polyline.getMBR ();
	};
	
	HiPolyline.prototype.getLineStyle = function(){
		return this.polyline.getLineStyle();
	}
	
	HiPolyline.prototype.getZIndex = function(){
		return this.polyline.getZIndex ();
	};
	
	HiPolyline.prototype.openInfoWindowHtml = function(strHTML){
		this.polyline.openInfoWindowHtml (strHTML);
	};
		
	HiPolyline.prototype.setLineStyle = function(lineStyle){
		this.polyline.setLineStyle(lineStyle);
	}
	
	HiPolyline.prototype.setZIndex = function(iIndex){
		this.polyline.setZIndex(iIndex);
	};
	
	
	
    return HiPolyline;

});