define([],function (){

	//××××××××××××××××××××××××××方法内部定义开始×××××××××××××××××××××××××××
	//$.ajaxSettings.async = false;
	kdTree = kdTree.kdTree;
	
	var param = new Object();
	param.config = CONFIG;
	param.rooturl = CONFIG.rooturl;
	param.markerMap = new jsMap.Map(); // 当前显示在地图上的设备点集合
	param.facimarkerMap = new jsMap.Map();//当前显示在地图上的设施点集合
	param.polylineMap = new jsMap.Map(); //当前显示在地图上的线集合
	param.sectionMap = new jsMap.Map(); //当前显示在地图上的线集合
	param.polygonMap = new jsMap.Map(); //当前显示在地图上的多边形集合
	param.allMarkers = new Array(); //缓存系统所有点位集合
	param.allFaciMarkers = new Array(); //缓存系统所有设施点位集合
	param.currMarkers = new Array(); //视野范围内的所有安装点
	param.kdtree = new Object();
	param.currRecordList = "";
	param.selectedRecord = "";
	param.policeCtrlId = "";
	param.speedCtrlId = "";
	param.videoCtrlId = "";
	param.vmsCtrlId = "";
	param.openobj = "";
	param.callback="";
	param.tempOverlay= "";
	param.kdtreeMap = new jsMap.Map();
	param.arrPocessTimeout; //大循环处理方法
	param.callback = null;
	param.muliObjArr = new Array();
	param.legendMap = new jsMap.Map();//当前打开的图层集合
	param.curIndex=0;
	param.equipImgArr=new Array();
	param.intervalt = null;
    param.mousePosType = 0; //鼠标所在位置，0：地图上；1：设备上
	
	
	
	var DataTool = function(){ 
		
	}
	DataTool.param = param;
	
	function createHttpRequest() {
		 var request; 
	     if (window.ActiveXObject) {
	          request = new ActiveXObject("Microsoft.XMLHTTP");
	     } else if (window.XMLHttpRequest) {
	          request = new XMLHttpRequest();
	     }
	     return request;
	}
	
	DataTool.prototype.sendAjax = function(url,callback,async){
		async = async||false;
		var request = createHttpRequest();
		try {
			request.onreadystatechange = function(){
				if (request.readyState == 4) {
					var data = "";
					if (request.status == 200 || request.status == 0) {
						if (typeof(JSON) == 'undefined'){
							data = eval("("+request.responseText+")");
						}else{
							data = JSON.parse(request.responseText);
						}
						if(typeof(callback) == "function"){
							callback.call(this,data);
						}
						
					}
				}
			};
			request.open("POST", url, false);
			request.send("");
		} catch (exception) {
			 alert("获取设备列表失败!");
		}
	};

	//缓存所有设备点位
	DataTool.prototype.getAllMonitor = function(devicetypes,callback){
		var url =  param.rooturl+'/himap/listAllMonitor.do?devicetypes='+devicetypes;
		this.sendAjax(url,function(data){
			if(data.result=='false'){
				alert("获取设备信息失败!");
			}else{
				var arr = data.rows;
				var typeArr = devicetypes.split(",");
				for(var i = 0;i<typeArr.length;i++){
					if(arr!=null && arr[typeArr[i]]!=null){
						param.allMarkers[typeArr[i]] = arr[typeArr[i]];
					}
				}
			}
			if(callback!=null && callback!=""){
				callback.call(this,param.allMarkers);
			}
		});
	};
	
	//缓存所有设施点位
	DataTool.prototype.getAllFaciMonitor = function(facitypes,level,callback){
		var url =  param.rooturl+'/himap/listAllFaci.do?facitypes='+facitypes+'&level='+level;
		this.sendAjax(url,function(data){
			if(data.result=='false'){
				alert("获取设备信息失败!");
			}else{
				var arr = data.rows;
				param.allFaciMarkers[facitypes] = arr;
				if(callback!=null && callback!=""){
					callback.call(this,arr);
				}
			}
		});
	};

	
	//大数据量循环的优化方法
	DataTool.prototype.largeArrayProcess = function(array,process,onceNum,context){
		param.arrPocessTimeout = setTimeout(function(){
		   	if(array == null || array.length<=0){
		   		return;
		   	}
		   	var count=0;
		   	var showarray = new Array();
		   	while(count<onceNum){
		   		if(array.length==0){
		   			break;
		   		}
		   		var item = array.shift();
	   			showarray.push(item);
	   			count++;
		   	}
		   	process.call(context,showarray);
		   if (array.length > 0){
	           param.arrPocessTimeout = setTimeout(arguments.callee, 0);
	       }else{
	       		//addLayerListener(devicetype);
	       }
		}, 0);
	};
	
	
	
	
	
	DataTool.prototype.getMonitorById = function(deviceid,devicetype){
		var result;
		var url = param.rooturl+'/himap/getEquipmentInfo.do?deviceid='+deviceid+'&devicetype='+devicetype;
		this.sendAjax(url,function(data){
			if(data.result==false){
			}else{
				if(data.rows!= null){
					result  = data.rows[0];
				}
			}
		},false);
		return result;
	};
		
	
	var dataTool = new DataTool();
	dataTool.param = param;
	//××××××××××××××××××××××××××方法内部定义结束×××××××××××××××××××××××××××
	
	//外部调用接口
	return{
		dataTool : dataTool
	}

});

