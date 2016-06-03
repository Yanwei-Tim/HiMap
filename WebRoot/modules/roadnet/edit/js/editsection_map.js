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
	
	function showroad(strCoord){
        if(strCoord == null){
            return;
        }
        var newpLine = new Polyline(strCoord,"#00FF00",3,1,0);// 构造一个多义线对象
        _MapApp.addOverlay(newpLine);// 将多义线对象添加到地图中
    }

	return {
		showarcWMS : showarcWMS,
		closeWMS : closeWMS,
		drawLine : drawLine,
		getMousePos : getMousePos,
		showroad : showroad
	}
});