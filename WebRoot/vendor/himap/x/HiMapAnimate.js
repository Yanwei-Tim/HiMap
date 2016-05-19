define(['jquery'],function ($){
	
	//××××××××××××××××××××××××××方法内部定义开始×××××××××××××××××××××××××××
	var resolutions = [0.703125, 0.3515625, 0.17578125, 0.087890625, 0.0439453125, 0.02197265625, 0.010986328125, 0.0054931640625, 0.00274658203125, 0.001373291015625, 6.866455078125E-4, 3.4332275390625E-4, 1.71661376953125E-4, 8.58306884765625E-5, 4.291534423828125E-5, 2.1457672119140625E-5, 1.0728836059570312E-5, 5.364418029785156E-6, 2.682209014892578E-6, 1.341104507446289E-6, 6.705522537231445E-7, 3.3527612686157227E-7];

	//瓦片化专题图接口
	var WMSTileLayer = function(name,url,params,options){
		var basename = "tilewms";
		//默认wms参数
		var baseparams = {
			layers: '',
			srs:'EPSG:4326',
			transparent: true,
			cql_filter:''
		}
		//默认图层参数
		var baseoptions ={
			transitionEffect: "resize" ,
            singleTile: false,
            isBaseLayer: false
		}
		this.name = name || basename;
		this.params = $.extend(baseparams,params);
		this.options = $.extend(baseoptions,options);
		this.url = url;
		if(this.params.layers!=''){
			this.url +="&LAYERS="+this.params.layers;
		}
		if(this.params.srs!=''){
			this.url +="&SRS="+this.params.srs;
		}
		if(this.params.cql_filter!=''){
			this.url +="&cql_filter"+escape(this.params.cql_filter);
		}
		this.url += "&TRANSPARENT=true";
		
		this.divs = [];
		this.tilesBox = this.getTilesBox();

		var instance = this;
		this.lisfunc = function(){instance.reDraw()};
		_MapApp.addMapChangeListener(this.lisfunc);
		this.currLevel = _MapApp.getZoomLevel();
	}
	
	WMSTileLayer.prototype.show = function(){
		if(typeof(_MapApp)=='undefined'){
			return;
		}
		var ppd = getPixesPerDegree();

		var padding_top = _MapApp.map.div.style.top.replace("px","")-0;
		var padding_left = _MapApp.map.div.style.left.replace("px","")-0;
		//console.log("dddd");
		for(var i=0;i<this.tilesBox.length;i++){
			var bbox = this.tilesBox[i];
			
			var isinbox = false;
			var m = 0;
			for(m = 0; m<this.divs.length; m++){
				if(this.divs[m].bbox == bbox){
					isinbox = true;
					break;
				}
			}
			
			var buffer = 0.0005;
			var nodes = getNodesByBBox(bbox);
			var left = (nodes.startpoint.x-_MapApp.getBoundsLatLng().minX)*ppd.x-padding_left-ppd.x*buffer;
			var top = (_MapApp.getBoundsLatLng().maxY-nodes.startpoint.y  )*ppd.y-padding_top-ppd.y*buffer;
			if(isinbox){
				this.divs[m].style.top = top+"px";
				this.divs[m].style.left = left+"px";
				continue;
			}
			var div = document.createElement("img");
			div.bbox = bbox;
			var points = bbox.split(",");
			bboxb = (points[0]-buffer) +"," + (points[1]-buffer) +"," +(points[2]-(-buffer)) +"," +(points[3]-(-buffer));
			div.src = this.url +"&BBOX="+bboxb +"&WIDTH="+parseInt(256+ppd.x*buffer*2)+"&height="+parseInt(256+ppd.y*buffer*2);
			
			div.style.width = (256+ppd.x*buffer*2)+"px";
        	div.style.height = (256+ppd.y*buffer*2)+"px";
        	div.style.left = left+"px";

        	div.style.top = top+"px";
			div.style.position = "absolute";
			div.style.zIndex = 10;
			_MapApp.map.div.appendChild(div);
			//console.log(div.src);
			this.divs.push(div);
		}
	}
	
	function getTileUrls(div,url){
		
	}
	
	WMSTileLayer.prototype.close = function(){
		for(var m = 0; m<this.divs.length; m++){
			$(this.divs[m]).remove();
		}
		this.tilesBox = [];
		var lisfunc= this.lisfunc;
		_MapApp.removeMapChangeListener(lisfunc);
	}

	WMSTileLayer.prototype.getTilesBox = function(zoomlevel){
		var result = new Array();
		var ppd = getPixesPerDegree();

		/*var level = Math.log(ppd.x)/Math.log(2);
		ppd.x = ppd.y = 1/resolutions[level];*/
		//alert(ppd.x);
		var tilelon = 256/ppd.x;
		var tilelat = 256/ppd.y;

		var mbr = _MapApp.getBoundsLatLng();
		var leftlon = -180;
		var leftlat = 90;
		while(leftlon<180){
			if(leftlon+tilelon>mbr.minX){
				break;
			}
			leftlon+=tilelon;
		}
		while(leftlat>-90){
			if(leftlat-tilelat<mbr.maxY){
				break;
			}
			leftlat-=tilelat;
		}
		while(leftlon<mbr.maxX){
			var ilat = leftlat;
			while(ilat>mbr.minY){
				result.push(leftlon+","+(ilat-tilelat)+","+(leftlon+tilelon)+","+(ilat));
				ilat-=tilelat;
			}
			leftlon+=tilelon;
		}
		

		return result;
	}
	WMSTileLayer.prototype.reDraw = function(){
		if(this.reDrawTimeout!=null){
			window.clearTimeout(this.reDrawTimeout);
		}
		var instance = this;
		this.reDrawTimeout = setTimeout(function(){
			if(_MapApp.getZoomLevel()!=instance.currLevel){
				instance.currLevel = _MapApp.getZoomLevel();
				for(var m = 0; m<instance.divs.length; m++){
					$(instance.divs[m]).remove();
				}
				instance.divs = [];
			}else{
				var mbr = _MapApp.getBoundsLatLng();
				var newdivs = [];
				for(var m = 0; m<instance.divs.length; m++){
					var bbox = getNodesByBBox(instance.divs[m].bbox);
					if(bbox.startpoint.x>=mbr.maxX || bbox.endpoint.x<=mbr.minX || bbox.endpoint.y>=mbr.maxY || bbox.startpoint.y<=mbr.minY){
						$(instance.divs[m]).remove();
					}else{
						newdivs.push(instance.divs[m]);
					}
				}
				instance.divs = newdivs;
			}
			instance.tilesBox = instance.getTilesBox();
			instance.show();
		},200);
		
	}
	
	function getPixesPerDegree(){
		var ppd = {};
		if( typeof(_PixelsPerDegree) == "undefined"){
			ppd.x =_MapApp.map.baseLayer.tileInfo.levelDetails[_MapApp.map.realZoomLevel].resolution;
        	ppd.y = _MapApp.map.baseLayer.tileInfo.levelDetails[_MapApp.map.realZoomLevel].resolution;
		}else{
			ppd.x = _PixelsPerDegree[_MapApp.getZoomLevel()].x;
			ppd.y = _PixelsPerDegree[_MapApp.getZoomLevel()].y;
		}
		return ppd;
	}
	
	function getNodesByBBox(bbox){
		var result = {};
		var points = bbox.split(",");
		if(points.length!=4){
			return null;
		}
		var startpoint = {},endpoint = {};
		startpoint.x = points[0];
		startpoint.y = points[3];
		endpoint.x = points[2];
		endpoint.y = points[1];
		result.startpoint = startpoint;
		result.endpoint = endpoint;
		return result;
		
	}
	
	//××××××××××××××××××××××××××方法内部定义结束×××××××××××××××××××××××××××
	
	//外部调用接口
	return WMSTileLayer 
	
});