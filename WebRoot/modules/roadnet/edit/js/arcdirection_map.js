define(["vendor/himap/x/WMSTileLayer"],function (WMSTileLayer){
	
	function showlinkWMS(){
	    var url = geoserverURL+"/sde/wms?REQUEST=GetMap&VERSION=1.1.0&FORMAT=image/png&SERVICE=WMS&LAYERS=sde:ROUTE_ROADLINK";
		var facilegendfunc=new WMSTileLayer('tilewms',url);
		facilegendfunc.show();
	}
	
	function showRoadlink(strcoords,direction){
		var points = strcoords.split(",");
		var pline;
		if(direction == "0"){
			pline = new Polyline(strcoords,"GREEN",3,1,1);
		}else if(direction =="1"){
			pline = new Polyline(strcoords,"GREEN",3,1,-1);
		}else{
			pline = new Polyline(strcoords,"GREEN",3,1);
		}
		_MapApp.addOverlay(pline);
		_MapApp.centerAndZoom(new Point(points[0],points[1]),_MapApp.getZoomLevel());
		//_MapApp.centerAtMBR(pline.getMBR());
		return pline;
	}

	return {
		showlinkWMS : showlinkWMS,
		showRoadlink : showRoadlink
	}
});