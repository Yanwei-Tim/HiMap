/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
    
    var HiTitle =  function(name,fontSize,pos,font,color,bgColor){
		
		
		this.name = name;
    	this.fontSize = fontSize;
    	this.pos = pos;
    	this.font = font;
    	this.color = color;
    	this.bgColor = bgColor;
    	
    	this.title = null;
    	this.point = null;
    	
		this.init(name,fontSize,pos,font,color,bgColor);
    	
    };
    HiTitle.prototype.init = function(name,fontSize,pos,font,color,bgColor){};
    HiTitle.prototype.setParam = function(paramname,paramvalue){};
    
	
    /**
     * 设置图标显示位置
     * @param {HiPoint|String} point 位置对象
     * @return {HiTitle}
     */
   	HiTitle.prototype.setPoint = function(point){
		
		
   	};
   	
   	/**
     * 获取其位置，类型为HiPoint
     * @return {HiPoint}
     */
   	HiTitle.prototype.getPoint = function(){
   	};
    
    return HiTitle;

});