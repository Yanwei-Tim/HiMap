/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
    
	var HiMarker = function (point,icon,title){
		this.point = point;
		this.icon = icon;
		this.title = title;
		this.marker = null;
		this.init(point,icon,title);
	};
	
	HiMarker.prototype.init = function(){point,icon,title};
	
	//显示信息筐
	HiMarker.prototype.openInfoWindowHtml= function (htmlStr){
		this.marker.openInfoWindowHtml(htmlStr);
	};

	//加入事件，其中action为字符型,可以是如下:
	//'click'：点击
	//'dblclick'：双击
	//'mouseover'：鼠标在上面移动
	//'mouseout'：鼠标移出
	HiMarker.prototype.addListener= function (action,fuct){
	};

    //获取当前的图层序列
    HiMarker.prototype.getZIndex= function (){
	};

    //设置图层系列
    HiMarker.prototype.setZIndex= function (int){
	};

    //显示标题
    HiMarker.prototype.showTitle= function (){
	};

    //隐藏标题
    HiMarker.prototype.hideTitle= function (){
		this.marker.hideTitle();
	};

    //设置图标显示位置
    HiMarker.prototype.setPoint= function (pPoint){
	};

    //获取其位置，类型为Point
    HiMarker.prototype.getPoint= function (){
	}
    
    return HiMarker;

});