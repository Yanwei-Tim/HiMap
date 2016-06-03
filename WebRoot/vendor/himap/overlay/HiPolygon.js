/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
    
	
	
	var HiPolygon = function(points, color, weight, opacity, fillcolor){
    	this.points = points;
    	this.color = color;
		this.weight = weight;
    	this.opacity = opacity;
    	this.fillcolor = fillcolor;
		this.polygon = null;
		this.init(points, color, weight, opacity, fillcolor);
    };
	
	HiPolygon.prototype.init = function(points, color, weight, opacity, fillcolor){};
	
    HiPolygon.prototype.addListener = function(action, func){
		this.polygon.addListener(action,func);
	};
	
	HiPolygon.prototype.getArea = function(){
		return this.polygon.getArea();
	}
	
	HiPolygon.prototype.getGeometryType = function(){
		return this.polygon.getGeometryType();
	}
	
	HiPolygon.prototype.getLength = function(){
		return this.polygon.getLength();
	}
	
	HiPolygon.prototype.getMBR = function(){
		return this.polygon.getMBR();
	}
	
	HiPolygon.prototype.getZIndex = function(){
		return this.polygon.getZIndex();
	}
	
	HiPolygon.prototype.openInfoWindowHtml = function(strHTML){
		this.polygon.openInfoWindowHtml(strHTML);
	}
	
	HiPolygon.prototype.setZIndex = function(iIndex){
		this.polygon.setZIndex(iIndex);
	}
	
	
    return HiPolygon;

});