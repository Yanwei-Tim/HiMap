/**
 * Created by linan3 on 2016-6-3.
 */
define([], function() {
    
	
	
	var HiRectangle  = function(points, color, weight, opacity, fillcolor){
    	this.points = points;
    	this.color = color;
		this.weight = weight;
    	this.opacity = opacity;
    	this.fillcolor = fillcolor;
		this.rectangle = null;
		this.init(points, color, weight, opacity, fillcolor);
    };
	
	HiRectangle.prototype.init = function(points, color, weight, opacity, fillcolor){};
	
	HiRectangle.prototype.addListener = function(action, func){
		this.rectangle.addListener(action,func);
	};
		
	HiRectangle.prototype.getZIndex = function(){
		return this.rectangle.getZIndex();
	}
	
	HiRectangle.prototype.openInfoWindowHtml = function(strHTML){
		this.rectangle.openInfoWindowHtml(strHTML);
	}
	
	HiRectangle.prototype.setZIndex = function(iIndex){
		this.rectangle.setZIndex(iIndex);
	}
	
	return HiRectangle;
	
	
});