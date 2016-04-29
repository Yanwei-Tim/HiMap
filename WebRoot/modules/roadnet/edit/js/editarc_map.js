define(["vendor/himap/x/WMSTileLayer"],function (WMSTileLayer){
	
	function showarcWMS(){
	    var url = geoserverURL+"/sde/wms?REQUEST=GetMap&VERSION=1.1.0&FORMAT=image/png&SERVICE=WMS&LAYERS=sde:ROUTE_ARC";
		var facilegendfunc=new WMSTileLayer('tilewms',url);
		facilegendfunc.show();
	}
	
	function drawLine(callback){
		_MapApp.changeDragMode('drawPolyline',null,null,
			function(pos){
				_MapApp.changeDragMode('');
				_MapApp.changeDragMode('pan');
				callback.call(this,pos);
			});
	}
	

	return {
		showarcWMS : showarcWMS
	}
});