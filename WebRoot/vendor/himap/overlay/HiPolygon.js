/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function(Hipoint) {
    
	
	function trans2Points(a) {
	    var p = a.split(",");
	    var len = p.length / 2;
	    var points = new Array();
	    for (var iIndex = 0; iIndex < len; iIndex++) {
	        var pPoint = {x:parseFloat(p[2 * iIndex]), y:parseFloat(p[2 * iIndex + 1])};
	        points.push(pPoint);
	    }
	    return points;
	};
	
	var HiPolygon = function(points, color, weight, opacity, fillcolor){
    	this.points = points;
    	this.pointarr = trans2Points(this.points);
    	this.color = color;
		this.weight = weight;
    	this.opacity = opacity;
    	this.fillcolor = fillcolor;
		this.polygon = null;
		this.init(points, color, weight, opacity, fillcolor);
    };
	
	HiPolygon.prototype.init = function(points, color, weight, opacity, fillcolor){};
	
    HiPolygon.prototype.addListener = function(action, func){};
	
	HiPolygon.prototype.getArea = function(){};
	
	HiPolygon.prototype.getGeometryType = function(){};
	
	HiPolygon.prototype.getLength = function(){};
	
	HiPolygon.prototype.getMBR = function(){};
	
	HiPolygon.prototype.getZIndex = function(){};
	
	HiPolygon.prototype.openInfoWindowHtml = function(strHTML){};
	
	HiPolygon.prototype.setZIndex = function(iIndex){};
	
	//多边形的几何中心 质心
	HiPolygon.prototype.centroid = function () {
		var x = 0,
			y = 0,
			area = 0,
			i,
			j,
			f,
			point1,
			point2;

		for (i = 0, j = this.pointarr.length - 1; i < this.pointarr.length; j = i, i++) {
			point1 = this.pointarr[i];
			point2 = this.pointarr[j];
			f = point1.x * point2.y - point2.x * point1.y;
			x += (point1.x + point2.x) * f;
			y += (point1.y + point2.y) * f;
			area += point1.x * point2.y;
			area -= point1.y * point2.x;
		}
		area /= 2;

		f = area * 6;
		return x/f+","+y/f;
		//return new HiPoint(x / f, y / f);
	};
	
	
    return HiPolygon;

});