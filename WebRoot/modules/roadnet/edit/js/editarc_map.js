define(["vendor/himap/x/WMSTileLayer"],function (WMSTileLayer){
	
	function showarcWMS(){
		var pEndTime = new Date();
		var timestr = pEndTime.getFullYear()+""+pEndTime.getMonth()+""+pEndTime.getDate()+""+pEndTime.getHours()+""+pEndTime.getMinutes();
	    var url = geoserverURL+"/sde/wms?REQUEST=GetMap&VERSION=1.1.0&FORMAT=image/png&SERVICE=WMS&LAYERS=sde:ROUTE_ARC&time="+timestr;
		facilegendfunc=new WMSTileLayer('tilewms',url);
		facilegendfunc.show();
	}
	function closeWMS(){
		facilegendfunc.close();
	}
	function drawLine(callback){
		_MapApp.changeDragMode('drawPolyline',null,null,
			function(pos){
				_MapApp.changeDragMode('');
				_MapApp.changeDragMode('pan');
				window.parent.isincrossmap = false;
				callback.call(this,pos);
			});
	}
	function getMousePos(x,y){
		var pCenterLatLng = _MapApp.getCenterLatLng();
		//屏幕坐标转地理坐标
		 if( typeof(_MapApp.containerCoord2Map) == "function"){
			var pos = _MapApp.containerCoord2Map(new Point(x,y));
			xpos = pos.x;
			ypos = pos.y;
		}else if( typeof(_PixelsPerDegree) == "undefined"){
			xpos = pCenterLatLng.x + (x - _MapApp.map.viewSize.width / 2) * _MapApp.map.baseLayer.tileInfo.levelDetails[_MapApp.map.realZoomLevel].resolution;
        	ypos = pCenterLatLng.y - (y - _MapApp.map.viewSize.height / 2) * _MapApp.map.baseLayer.tileInfo.levelDetails[_MapApp.map.realZoomLevel].resolution;;
		}else{
			xpos = pCenterLatLng.x + (x - getMap().viewSize.width / 2) / _PixelsPerDegree[_MapApp.getZoomLevel()].x;
			ypos = pCenterLatLng.y - (y - getMap().viewSize.height / 2) / _PixelsPerDegree[_MapApp.getZoomLevel()].y;
		}
		return {lon:xpos,lat:ypos};
	}

	return {
		showarcWMS : showarcWMS,
		closeWMS : closeWMS,
		drawLine : drawLine,
		getMousePos : getMousePos
	}
});