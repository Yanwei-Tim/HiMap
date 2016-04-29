define(["vendor/himap/x/WMSTileLayer"],function (WMSTileLayer){
	var facilegendfunc;
	function showWMS(){
	    /*var url = geoserverURL+"/sde/wms?REQUEST=GetMap&VERSION=1.1.0&FORMAT=image/png&SERVICE=WMS&LAYERS=sde:ROUTE_ARC";
		var facilegendfunc2=new WMSTileLayer('tilewms',url);
		facilegendfunc2.show();*/
		
		var url = geoserverURL+"/sde/wms?REQUEST=GetMap&VERSION=1.1.0&FORMAT=image/png&SERVICE=WMS&LAYERS=sde:ROUTE_NODE";
		facilegendfunc=new WMSTileLayer('tilewms',url);
		facilegendfunc.show();
	}
	function closeWMS(){
		facilegendfunc.close();
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
	
	function centerAndZoom(strcoords,zoomlevel){
		_MapApp.centerAndZoom(new Point(strcoords.split(",")[0],strcoords.split(",")[1]), zoomlevel);
	}
	
	function showjoinpoints(jpArr){
		for(var i=0;i<jpArr.length;i++){
			var jp = jpArr[i];
			var point = new Point(jp.STRCOORDS.split(",")[0],jp.STRCOORDS.split(",")[1]);
			var pTitle = new Title(jp.POINTID, 13, 7, "Microsoft YaHei");
			var pIcon = new Icon();
			pIcon.width =  24; 
			pIcon.height = 24;
			pIcon.image = "../../modules/roadnet/edit/images/joinpoint.png";
			var newmarker = new Marker(point, pIcon, pTitle);
			newmarker.hideTitle();
			newmarker.attr = jp;
			newmarker.image = "../../modules/roadnet/edit/images/joinpoint.png";
			_MapApp.addOverlay(newmarker);
			addjpclicklistener(newmarker);
		}
		
	}
	
	function shownearjoinpoints(jpArr){
		for(var i=0;i<jpArr.length;i++){
			var jp = jpArr[i];
			var point = new Point(jp.STRCOORDS.split(",")[0],jp.STRCOORDS.split(",")[1]);
			var pTitle = new Title(jp.POINTID, 13, 7, "Microsoft YaHei");
			var pIcon = new Icon();
			pIcon.width =  24; 
			pIcon.height = 24;
			pIcon.image = "../../modules/roadnet/edit/images/nearjp.png";
			var newmarker = new Marker(point, pIcon, pTitle);
			newmarker.hideTitle();
			newmarker.attr = jp;
			newmarker.image = "../../modules/roadnet/edit/images/nearjp.png";
			_MapApp.addOverlay(newmarker);
			addjpclicklistener(newmarker);
		}
		
	}
	
	function addjpclicklistener(newmarker){
		newmarker.addListener("click", function(){
			//this.div.src = newImg;
			//this.icon.image = newImg;
			if(newmarker.image == "../../modules/roadnet/edit/images/nearjp.png"){
				newmarker.image = "../../modules/roadnet/edit/images/joinpoint.png";
				newmarker.div.src = newmarker.image;
				newmarker.icon.image = newmarker.image;
				window.parent.addJoinpoint(newmarker.attr);
			}else{
				newmarker.image = "../../modules/roadnet/edit/images/nearjp.png";
				newmarker.div.src = newmarker.image;
				newmarker.icon.image = newmarker.image;
				window.parent.delJoinpoint(newmarker.attr);
			}
		});
	}
	
	function showNearNodes(nodeArr,width,height){
		for(var i=0;i<nodeArr.length;i++){
			var node = nodeArr[i];
			var point = new Point(node.STRCOORDS.split(",")[0],node.STRCOORDS.split(",")[1]);
			var pTitle = new Title(node.NODEID, 13, 7, "Microsoft YaHei");
			var pIcon = new Icon();
			pIcon.width =  width|12; 
			pIcon.height = height|12;
			pIcon.image = "../../modules/roadnet/edit/images/cross.png";
			var newmarker = new Marker(point, pIcon, pTitle);
			newmarker.hideTitle();
			newmarker.attr = node;
			newmarker.image = "../../modules/roadnet/edit/images/cross.png";
			_MapApp.addOverlay(newmarker);
			addnnclicklistener(newmarker);
		}
	}
	
	var polylinearr = [];
	function showNearNodeRelation(nearnode){
		if(polylinearr.length>0){
		for(var i=0;i<polylinearr.length;i++){
				_MapApp.removeOverlay(polylinearr[i]);
			}
		}
		
		centerAndZoom(nearnode.STRCOORDS,0);
		var ltzt = nearnode.ltzt;
		var selflt = "-1";
		for(var i = 0;i<ltzt.length;i++){
			if(ltzt[i].strcoords == nearnode.STRCOORDS){
				selflt = i;
				continue;
			}
			var strcoords = nearnode.STRCOORDS+","+nearnode.routenode.strcoords+","+ltzt[i].strcoords;
			var color = ltzt[i].ltzt == "1"?"green":"gray";
			var polyline = new Polyline(strcoords,color,7,1,1);
			polyline.ltzt = ltzt[i];
			polyline.nodeid = nearnode.NODEID;
			_MapApp.addOverlay(polyline);
			polylinearr.push(polyline);
			addnnLineclicklistener(polyline);
		}
		var strcoords = nearnode.STRCOORDS+","+nearnode.routenode.strcoords+","+nearnode.STRCOORDS;
		var color = ltzt[selflt].ltzt == "1"?"green":"gray";
		var polyline = new Polyline(strcoords,color,7,1,1);
		polyline.ltzt = ltzt[selflt];
		polyline.nodeid = nearnode.NODEID;
		_MapApp.addOverlay(polyline);
		polylinearr.push(polyline);
		addnnLineclicklistener(polyline);
	}
	
	function addnnclicklistener(newmarker){
		newmarker.addListener("click", function(){
			showNearNodeRelation(newmarker.attr);
		});
	}
	
	function addnnLineclicklistener(polyline){
		polyline.addListener("click", function(){
			if(polyline.getColor() == "green"){
				polyline.setColor("gray");
				window.parent.addNoderelation(polyline.nodeid,polyline.ltzt.nodeid,0);
			}else{
				polyline.setColor("green");
				window.parent.addNoderelation(polyline.nodeid,polyline.ltzt.nodeid,1);
			}
		});
	}
	
	
	function showcross(node){
		var point = new Point(node.strcoords.split(",")[0],node.strcoords.split(",")[1]);
		var pTitle = new Title(node.nodeid, 13, 7, "Microsoft YaHei");
		var pIcon = new Icon();
		pIcon.width =  24; 
		pIcon.height = 24;
		pIcon.image = "../../modules/roadnet/edit/images/cross.png";
		var newmarker = new Marker(point, pIcon, pTitle);
		newmarker.hideTitle();
		_MapApp.addOverlay(newmarker);
		
	}
	

	


	return {
		showWMS : showWMS,
		closeWMS : closeWMS,
		getMousePos : getMousePos,
		showcross : showcross,
		showjoinpoints : showjoinpoints,
		shownearjoinpoints : shownearjoinpoints,
		showNearNodes : showNearNodes,
		showNearNodeRelation : showNearNodeRelation,
		centerAndZoom : centerAndZoom
	}
});