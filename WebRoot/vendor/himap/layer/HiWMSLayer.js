/**
 * Created by liuxiaobing on 2016-1-5.
 * WMS图层类
**/
define([himappath+"tool/tools","jquery"], function(Tools,$) {
   
   /**
	 *  @typedef {Object} WMSParam
	 *  @property {String} layername  图层名称
	 *  @property {String} [url]  wms服务地址
	 *  @property {String} [cql_filter] 过滤条件
	 *  @property {String} [styles] 样式
	 *  @property {Number} [srs] 坐标系
	 *  @property {Number} [refreshtime] 刷新时间，单位毫秒
	 **************************************************
	 * @param {WMSParam} params 参数对象，可选的字段参考AddVectorLayerParam定义
	**/ 
    var WMSLayer = function(params){
    	this.params = params;
    	this.layer = null;
    	this._MapApp = null;
    	this.clicklistener = null;
    	this.init();
    	if(Tools.checkParam(this.params.refreshtime,"number")){
    		this.setRefreshTime(this.params.refreshtime);
    	}
    };
    WMSLayer.prototype.init = function(){
    };
    
    WMSLayer.prototype.show = function(_MapApp){
    };
    
    WMSLayer.prototype.close = function(){
    };
    
    WMSLayer.prototype.setRefreshTime = function(time){
    };
    
    
    WMSLayer.prototype.addClickListener = function(callback){
    	var _MapApp = this._MapApp;
    	this.clicklistener = function(){
    		var  e =  window.event;
    		var mousepos = Tools.getMousePosition(e,_MapApp.mapdiv);
    		var crdpos = _MapApp.containerCoord2Map(mousepos.x,mousepos.y);
    		callback.call(this,crdpos);
    	}
    	//绑定事件
		$(this._MapApp.mapdiv).bind("click",this.clicklistener);
    };
    
    WMSLayer.prototype.removeClickListener = function(){
    	//取消绑定事件
		$(this._MapApp.mapdiv).unbind("click",this.clicklistener);
    };
    
    return WMSLayer;

});