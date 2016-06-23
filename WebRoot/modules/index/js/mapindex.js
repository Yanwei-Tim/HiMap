$(document).ready(function(){
	initdrawTools();
});
var param = {};
var himap = this;

//初始化画点、画线控件
function initdrawTools(){
	 $(".getposDiv").mouseover(function(){
		 Move_obj(this.id);
	 });
	 $("#pointsubmitbtn").click(function(){
		 returnPos(true);
	 });
	 $("#pointcalcelbtn").click(function(){
		 returnPos(false);
	 });
	 $("#linesubmitbtn").click(function(){
		 returnPos(true);
	 });
	 $("#linecalbtn").click(function(){
		 returnPos(false);
	 });
	
	 $("#selpolygonbtn").click(function(){
		 getPolygonPos();
	 });
	 $("#polygonsubmitbtn").click(function(){
		 returnPos(true);
	 });
	 $("#polygoncalbtn").click(function(){
		 returnPos(false);
	 });
	 $("#pileclosebtn").click(function(){
		 pileDiv.style.display = 'none';
		 document.getElementById("crd").value = "";
		 document.getElementById("pile").value = "";
	 });
}


// 移动
var drag_ = false;
var D = new Function('obj', 'return document.getElementById(obj);');
var oevent = new Function('e', 'if (!e) e = window.event;return e');
function Move_obj(obj){
	var x,y;
	D(obj).getElementsByTagName("table")[0].onmousedown = function(e) {
		drag_ = true;
		with(D(obj)) {
			style.position = "absolute";
			var temp1 = offsetLeft;
			var temp2 = offsetTop;
			x = oevent(e).clientX;
			y = oevent(e).clientY;
			document.onmousemove = function(e){
				if(!drag_)return false;
				with(D(obj)){
					style.left = temp1+oevent(e).clientX-x+"px";
					style.top = temp2+oevent(e).clientY-y+"px";
				}
			}
		}
		document.onmouseup = function(){
			drag_=false;
		}
	}
}

/**用于在地图上获取经纬度
*openobj 弹出页面对象,通常为flexapp
*callback 回调函数,返回经纬度值
*/
function getPointPos(openobj,callback,hasdesc){
	if(openobj!=null){
		param.openobj= openobj;
	}
	if(callback!=null){
		param.callback = callback;
	}
	if(hasdesc){
		posdesc.style.display = '';
	}else{
		posdesc.style.display = 'none';
	}
	param.hasdesc = hasdesc;
	polygonDiv.style.display = 'none';//add zz
	pointDiv.style.display = '';
	dataInputx.value = '';
	dataInputy.value = '';
	digroadDesc.value = '';
	
	_MapApp.changeDragMode('drawPoint',dataInputx,dataInputy,himap.regetPointPos);
}
function regetPointPos(){
	_MapApp.changeDragMode('drawPoint',dataInputx,dataInputy,himap.regetPointPos);
}

/**用于在地图上画线获取经纬度
*openobj 弹出页面对象,通常为flexapp
*callback 回调函数,返回经纬度值
*arrow 箭头方向
*/
function getLinePos(openobj,callback,arrow){
	
	if(openobj!=null){
		param.openobj= openobj;
	}
	if(callback!=null){
		param.callback = callback;
	}
	if(arrow == null) {
		arrow = 0;
	}
	param.arrow = arrow;
	lineDiv.style.display = '';
	lineInputx.value = '';
	lineInputy.value = '';
	_MapApp.changeDragMode('drawPolyline',lineInputx,lineInputy,himap.regetLinePos);
}
function regetLinePos(){
	if(param.tempOverlay!=null && param.tempOverlay!=""){
		_MapApp.removeOverlay(param.tempOverlay);
	}
	param.tempOverlay =  _MapApp.showPolyline(lineInputx.value,null,null,null,null,param.arrow);
	_MapApp.changeDragMode('drawPolyline',lineInputx,lineInputy,himap.regetLinePos);
}

/**用于在地图上画区域获取经纬度
*openobj 弹出页面对象,通常为flexapp
*callback 回调函数,返回经纬度值
*/
function getPolygonPos(openobj,callback,drawflag){
	
	if(openobj!=null){
		param.openobj= openobj;
	}
	if(callback!=null){
		param.callback = callback;
	}
	pointDiv.style.display = 'none';//add zz
	polygonDiv.style.display = '';
	if(param.tempOverlay!=null && param.tempOverlay!=""){
		_MapApp.removeOverlay(param.tempOverlay);
	}
	var selvalue = parseInt(document.getElementById("selAreaTypeId").options[document.getElementById("selAreaTypeId").options.selectedIndex].value);
	if(drawflag==null || drawflag==true){
		switch(selvalue){
		case 0:
		    _MapApp.drawCircle(function(pos){
		    	param.tempOverlay = _MapApp.showCircle({strcoords:pos});
		    });
		    break;
		case 1:
		    _MapApp.drawRect(function(pos){param.tempOverlay = _MapApp.showRect({strcoords:pos});});
		    break;
		case 2:
			_MapApp.drawPolygon(function(pos){param.tempOverlay = _MapApp.showPolygon({strcoords:pos});});
		    break;
		}
	}
	
}

function returnPos(issubmit){
	var dragmode = _MapApp.getDragMode();
	var pointstr;
	if(dragmode =="drawPoint"){
		if(param.hasdesc){
			pointstr = dataInputx.value + "||" + dataInputy.value+"||"+digroadDesc.value;
		}else{
			pointstr = dataInputx.value + "," + dataInputy.value;
		}
		pointDiv.style.display = 'none';
	}else if(dragmode =="drawPolyline"){
		if(param.tempOverlay!=null && param.tempOverlay!=""){
			_MapApp.removeOverlay(param.tempOverlay);
		}
		pointstr = lineInputx.value;
		lineDiv.style.display = 'none';
	}else{
		if(param.tempOverlay!=null && param.tempOverlay!=""){
			pointstr = param.tempOverlay.points+'';
			_MapApp.removeOverlay(param.tempOverlay);
		}
		param.tempOverlay = null;
		polygonDiv.style.display = 'none';
	}
	//_MapApp.changeDragMode('');
	_MapApp.changeDragMode('pan');
	if(issubmit){
		param.callback.call(param.openobj,pointstr);
		//param.openobj.focus();
	}else{
		setTimeout(function() {param.openobj.focus();},300);
		//param.openobj.focus();
	}
}