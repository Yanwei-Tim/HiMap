/*
 * 设备图层展示类
 * */
define([''],function (){

	    var currdevicetype = "";
	    var deldevicetype = "";
	    var markerMap = new _MapApp.JsMap();
	    var currLevel = _MapApp.getZoomLevel(); //当前地图显示级别
	    var mapchangetimeout,delouttimeout;
	    var selectedTypes = new Array();//当前显示的设备类型
	    var bbox = "";
	    var mapchangeflag = false;
	    var cluimgURL = HiMapConfig.HOSTNAME+"vendor/himap/icons/device/clu/cluIcon.png";
	    				
	    //按照类别显示设备图层
		function showDevicesByType(devicetype){
			mapchangeflag = false;
			if(devicetype == null || devicetype==""){
				return;
			}
			//判断该类型是否已展示
			var hasshow = false;
			for(var i = 0;i<selectedTypes.length;i++){
				if(selectedTypes[i] == devicetype){
					hasshow = true;
					break;
				}
			}
			if(!hasshow){
				selectedTypes.push(devicetype);
				getMonitor(function(datalist){
					currdevicetype = devicetype; 
					_MapApp.Tools.largeArrayProcess(datalist,showMonitors,50);
				});
			}
		}

		//计算当前视野范围内聚合后的安装点 
	    function getMonitor(callback){
			var cullevel = getcullevel();
			bbox = _MapApp.getBoundsLatLng() +"";
			_MapApp.Tools.sendAjax(HiMapConfig.HOSTNAME+"mapindex/getMonitor?clulevel="+getcullevel()+"&bbox="+bbox,function(data){
				var monitorList = data.rows;
				if(callback!=null){
					callback.call(this,monitorList);
				}
			},true,"json");
	    }

		//批量展示安装点
		function showMonitors(itemarray){
			
			for (var i = 0; i < itemarray.length; i++) {
				
				var item = itemarray[i];
				if(item.longitude==null || item.longitude==""||item.longitude=="0"||
					item.latitude==null || item.latitude==""||item.latitude=="0"){
					continue;
				}
				showMonitor(item);
			}
		}

		//展示一个安装点
		function showMonitor(monitor){
			if(typeof(monitor)=='undefined' || typeof(monitor.longitude)=='undefined'|| typeof(monitor.latitude)=='undefined'
				||monitor.longitude=='0' || monitor.latitude == '0' || monitor.latitude == ""|| monitor.latitude ==""){
				return;
			}
			
			var devicenums = monitor.markerinfo["num-"+currdevicetype];
			if((null == devicenums|| devicenums<=0)){
				return ;
			}
			
			var premarker = markerMap.get(monitor.id);
			if(premarker != null){
				return updateMonitor(premarker);
			}
			
			monitor.strcoords = monitor.longitude + "," + monitor.latitude; 
			monitor.imgurl = getMonitorImg(monitor);
			var newmarker;

			if(monitor.imgurl != cluimgURL && devicenums==1){
				var width,height;
				if(monitor.imgurl == ""){
					width = height = 18;
				}else{
					width = height = 24;
				}
				newmarker = _MapApp.showDevice({width:width,height:height,imgurl:monitor.imgurl,deviceid:monitor.markerinfo["device-"+currdevicetype],devicetype:currdevicetype,pointid:monitor.id});
			}else{
				monitor.width = monitor.height = 24;
				newmarker = _MapApp.showMonitor(monitor);
				//@todo 点击事件
				newmarker.addListener("click", function() {
				});
			}
			if(newmarker == null){
				return null;
			}

			newmarker.mouseoverlistener = function() {
				newmarker.showTitle();
				newmarker.titleDiv.style.zIndex=999;
                himap.param.mousePosType = 1;
			};
			newmarker.mouseoutlistener = function() {
				newmarker.hideTitle();
                himap.param.mousePosType = 0;
			};
			monitor.marker = newmarker;
			_MapApp.addOverlay(newmarker);
			markerMap.put(monitor.id,monitor);
			return newmarker;
		}

		//按照类别删除设备图层	
		function removeDevicesByType(devicetype){
			deldevicetype = devicetype; 
			if(devicetype == null || devicetype==""){
				return;
			}
			
			for(var i = 0;i<selectedTypes.length;i++){
				if(selectedTypes[i] == devicetype){
					selectedTypes.splice(i,1);
					break;
				}
			}
			currdevicetype = selectedTypes[selectedTypes.length-1];
			var datalist = markerMap.values().concat();

			_MapApp.Tools.largeArrayProcess(datalist,removeDevicesByTypeProcess,50);
		}

		//批量更新安装点
		function removeDevicesByTypeProcess(itemarray){
			for (var i = 0; i < itemarray.length; i++) {
				var item = itemarray[i];
				if(item.markerinfo["num-"+deldevicetype]>0){
					if(item.imgurl == HiMapConfig.HOSTNAME+"vendor/himap/icons/device/clu/cluIcon.png"){
						updateMonitor(item);
					}else{
						removeMonitor(item);
					}
				}
				
			}
		}

		//批量删除安装点
		function removeMonitors(itemarray){
			
			for (var i = 0; i < itemarray.length; i++) {
				var item = itemarray[i];
				if(item.marker == null){
					item = markerMap.get(item.id);
				}
				if(item != null){
					removeMonitor(item);
				}
			}
		}
	    
		//更新地图上的安装点	
		function updateMonitor(monitor){
			var imgurl = getMonitorImg(monitor);
			if(imgurl != monitor.imgurl){
				removeMonitor(monitor);
				showMonitor(monitor);
			}
			return monitor;
		}
		
		//删除地图上展示的安装点
		function removeMonitor(monitor){
			_MapApp.removeOverlay(monitor.marker);
			markerMap.remove(monitor.id);
		}

	    //根据比例尺计算聚合级别
	    function getcullevel(){
	    	//计算像素/度
	    	var ppd = 0;
			if( typeof(_PixelsPerDegree) == "undefined"){
				ppd = 1/_MapApp.map.baseLayer.tileInfo.levelDetails[_MapApp.map.realZoomLevel].resolution;
			}else{
				ppd = _PixelsPerDegree[_MapApp.getZoomLevel()].x;
			}
			ppd = ppd+0;
			if(ppd>=65536){
				return "0";
			}else if(ppd<65536 && ppd>=32768){
				return "0.001";
			}else if(ppd<32768 && ppd>=16384){
				return "0.005";
			}else if(ppd<16384 && ppd>=8192){
				return "0.008";
			}else{
				return "0.02";
			}
			
	    }

	    function getMonitorOnChange(callback){
			var cullevel = getcullevel();
			
			var newbbox = _MapApp.getBoundsLatLng();
			if(newbbox == bbox){
				return ;
			}
			_MapApp.Tools.sendAjax(HiMapConfig.HOSTNAME+"mapindex/getMonitorOnMapChange?clulevel="+getcullevel()+"&bbox="+newbbox+"&prebbox="+bbox,function(data){
				var addList = data.addrows;
				var delList = data.delrows;
				if(callback!=null){
					callback.call(this,addList,delList);
				}
			},true,"json");
			bbox = newbbox;
	    }
		
		function getImageByType(monitor,devicetype){
			var imgurl = HiMapConfig.HOSTNAME+"vendor/himap/icons/device/clu/";
			//根据设备类型自动获取图标
			var devicenums = monitor.markerinfo["num-"+devicetype];
			imgurl+=devicetype+"_";
			if(devicenums>1){
				var num = devicenums;
				if(devicenums>=9){
					num = "9+";
				}
				imgurl+=num+".png";
			}else{//如果只有一个设备，不在此计算设备图标，调用showdevice方法自动匹配设备图标
				imgurl = "";
			}
			return imgurl;
		}
		
		function getMonitorImg(monitor){
			var imgurl = null;
			if(selectedTypes.length>=2){
				var count = 0;
				for(var i=0;i<selectedTypes.length;i++){
					if(monitor.markerinfo["num-"+selectedTypes[i]]>0){
						count++;
					}
				}
				if(count>1){
					imgurl = HiMapConfig.HOSTNAME+"vendor/himap/icons/device/clu/cluIcon.png";
				}else if(count == 1){
					imgurl = getImageByType(monitor,currdevicetype);
				}
			}else{
				imgurl = getImageByType(monitor,selectedTypes[0]);
			}
			return imgurl;
		}
		
		//添加地图监听事件
		_MapApp.addMapChangeListener(function(){
			handleMapChange();
		});
		
		//监听地图状态变化
		function handleMapChange() {
			if(selectedTypes.length<=0){
				return;
			}
			//停止之前未完成的方法
			if(mapchangetimeout!=null){
				clearTimeout(mapchangetimeout);
				mapchangetimeout = null;
			}
			
			mapchangetimeout = setTimeout(function(){
				//如果地图级别发生变化
				if(_MapApp.getZoomLevel()!=currLevel){
					currLevel = _MapApp.getZoomLevel();
					//var premonitors = markerMap.values().concat();
					//_MapApp.Tools.largeArrayProcess(premonitors,removeMonitors);
					removeMonitors(markerMap.values().concat());
					getMonitor(function(datalist){
						_MapApp.Tools.largeArrayProcess(datalist,showMonitors,50);
					});
				}else{
					getMonitorOnChange(function(addList,delList){
						mapchangeflag = false;
						_MapApp.Tools.largeArrayProcess(addList,showMonitors,50);
						_MapApp.Tools.largeArrayProcess(delList,removeMonitors,50);
					});
				}

			},300);


		}
		
		//××××××××××××××××××××××××××方法内部定义结束×××××××××××××××××××××××××××
	
	
	
		//外部调用接口
		return{
			showDevicesByType:showDevicesByType,
			removeDevicesByType:removeDevicesByType
		}
	});
