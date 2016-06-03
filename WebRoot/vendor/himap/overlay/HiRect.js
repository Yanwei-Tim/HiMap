/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
    
	
	var HiRect = function(width,height){
		this.width = width;
		this.height = height;
		this.rect = null;
		this.init(width,height);
	};
	
	HiRect.prototype.init = function(width,height){}
	
	HiRect.prototype.approxEquals  = function(anotherRect){
		this.rect.approxEquals (anotherRect);
	}
	
	HiRect.prototype.equals  = function(anotherRect){
		this.rect.equals (anotherRect);
	}
	
	
	return HiRect;
	
	
	/*
    return function(width,height){
    	this.width = width;
    	this.height = height;
    };
	*/

});