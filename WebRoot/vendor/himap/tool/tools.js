define([],function(){
	
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
		
		/**获得当前鼠标的坐标*/
		this.getMousePosition = function (e,o){
			 var mousePosition={x:0,y:0};
			 var x,y;
			 var e = e||window.event;
			 mousePosition.x = e.clientX+document.body.scrollLeft+document.documentElement.scrollLeft-o.scrollLeft;
			 mousePosition.y = e.clientY+document.body.scrollTop+document.documentElement.scrollTop-o.scrollLeft;
			 return mousePosition;
		}
		
		
	}
	
	return new Tools();
});