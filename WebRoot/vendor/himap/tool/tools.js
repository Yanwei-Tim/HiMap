define([],function(){
	
	function createHttpRequest() {
		 var request; 
	     if (window.ActiveXObject) {
	          request = new ActiveXObject("Microsoft.XMLHTTP");
	     } else if (window.XMLHttpRequest) {
	          request = new XMLHttpRequest();
	     }
	     return request;
	}
	
	
	var Tools = function(){
		/**
		*反转坐标
		*/
		this.revertCoords = function(strcoords){
			var points = strcoords.split(",");
			var num = points.length/2;
			var newstrcoords = "";
			for(var i=num-1;i>=0;i--){
				newstrcoords+=points[i*2]+","+points[i*2+1]+",";
			}
			newstrcoords = newstrcoords.substring(0,newstrcoords.length-1);
			return newstrcoords;
		}
		
		/**获得当前鼠标的屏幕坐标*/
		this.getMousePosition = function (e,o){
			 var mousePosition={x:0,y:0};
			 var x,y;
			 var e = e||window.event;
			 mousePosition.x = e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft-o.scrollLeft;
			 mousePosition.y = e.clientY+document.body.scrollTop+document.documentElement.scrollTop-o.scrollLeft;
			 return mousePosition;
		}
		
		this.sendAjax = function(url,callback,async,contenttype){
			async = async||false;
			var request = createHttpRequest();
			try {
				request.onreadystatechange = function(){
					if (request.readyState == 4) {
						var data = "";
						if (request.status == 200 || request.status == 0) {
							if(null == contenttype || contenttype == "json"){
								if (typeof(JSON) == 'undefined'){
								data = eval("("+request.responseText+")");
								}else{
									data = JSON.parse(request.responseText);
								}
							}else{
								data = request.responseText;
							}
							
							callback.call(this,data);
							
						}
					}
				};
				request.open("POST", url, async);
				request.send("");
			} catch (exception) {
				 //alert("!");
			}
		};
		
		this.checkParam = function(param,ptype){
	    	if(ptype == "string" || ptype == "object"){
	    		if(null == param||typeof param != ptype){
					return false;
				}
	    	}else if(ptype == "number"){
	    		if(null == param || isNaN(param)){
					return false;
				}
	    	}else{
	    		if(null == param || param+"" == ""){
	    			return false;
	    		}
	    	}
	    	return param;
	    }
	    
	    //大数据量循环的优化方法
		this.largeArrayProcess = function(array,process,onceNum,context){
			var arrPocessTimeout = setTimeout(function(){
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
		           arrPocessTimeout = setTimeout(arguments.callee, 0);
		       }else{
		       		//addLayerListener(devicetype);
		       }
			}, 0);
		};
		
		
	}
	
	return new Tools();
});