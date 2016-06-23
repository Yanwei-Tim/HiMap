/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
	
	/**
	*自定义矢量图层
	*  @typedef {Object} AddVectorLayerParam
    *  @property {String} lid 图层编号
    *  @property {Array} data 数据,字段:  id title strcoords coordtype markerinfo infohtml imgurl,width,height
    *  @property {String} [imgurl] 图标路径
    *  @property {Number} [width] 图标宽度，默认24
    *  @property {Number} [height] 图标高度，默认24
    *  @property {Number} [tplurl] 模版路径
    *  @property {Number} [tplid]  模版编号
    *  @property {Number} [coordtype] 默认地理形态(1 点 2线 3圆 4矩形 5多边形)
    **************************************************
    * @param {AddVectorLayerParam} params 参数对象，可选的字段参考AddVectorLayerParam定义
    * @return {VectorLayer} 返回叠加到地图上的自定义图标集合	
	**/
    var VectorLayer = function(params){
    	this.markers = [];
		
		this.addMarker = function(marker){
			this.markers.push(marker);
		}
    }
    return VectorLayer;

});