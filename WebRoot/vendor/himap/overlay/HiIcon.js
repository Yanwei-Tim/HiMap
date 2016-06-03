/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
    
    var HiIcon = function (image,width,height,leftOffset,topOffset){
		
		
		//图片名称
		this.image = image;
		//图片宽度
		this.width = width;
		//图片高度
		this.height = height;
		//图片X方向偏移量
		this.leftOffset = leftOffset;
		//图片Y方向偏移量
		this.topOffset = topOffset;
		
		this.icon = null;
		this.init(image,width,height,leftOffset,topOffset);
		
	};
	
	//构造函数，在实现类中重写
	HiIcon.prototype.init = function(image,width,height,leftOffset,topOffset){};
	HiIcon.prototype.setParam = function(paramname,paramvalue){};
	
	return HiIcon;

});