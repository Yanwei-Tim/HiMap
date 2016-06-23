/**
 * Created by linan3 on 2016-6-3.
 */
define([], function() {
    
	
	var HiCircle= function(points, color, weight, opacity, fillcolor){
    	this.points = points;
    	this.color = color;
		this.weight = weight;
    	this.opacity = opacity;
    	this.fillcolor = fillcolor;
		this.circle = null;
		this.init(points, color, weight, opacity, fillcolor);
    };
	
	HiCircle.prototype.init = function(points, color, weight, opacity, fillcolor){};
	
    HiCircle.prototype.getRadius= function(){};
	
	HiCircle.prototype.getCenter = function(){};
	
	HiCircle.prototype.addListener = function(action, func){};
	
	HiCircle.prototype.openInfoWindowHtml = function(strHTML){};
	
    return HiCircle;

});