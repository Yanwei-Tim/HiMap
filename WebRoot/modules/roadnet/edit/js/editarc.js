/**
 * Created by liuxiaobing on 2015-12-25.
 */
 
 var roadlinks =[];
 var cursor = 0; //游标
 var isincrossmap = false;
 var tools;
 var pLine;
 
var baseUrl = "../../../";
require.config({
	baseUrl:baseUrl,
    map: {
        '*': {
            'css': 'vendor/require/css.min'
        }
    },
    paths:{
        jquery:"vendor/jquery/jquery-1.10.2.min",
        text: 'vendor/require/text',
        domReady:"vendor/require/domReady"
    }
});

require(["jquery","vendor/himap/tool/tools","text","domReady!"],function($,Tools,text,domReady){
	this.Tools = Tools;
	$("#butdiv").css("top",$(document).height()-50);
	$(".dirbtns").hide();
	$(".subbtns").hide();
	$("#addbtn").on('click',function(){
		$("#addbtn").hide();
		$(".subbtns").show();
		mapframe.loadmodule("modules/roadnet/edit/js","editarc_map",function(ad){
			isincrossmap = true;
			ad.drawLine(drawline);
		});
	});
	$("#submitbtn").on('click',function(){
		mapframe._MapApp.removeOverlay(pLine);
		if(isincrossmap){
			isincrossmap = false;
			$(".dirbtns").hide();
			$(".subbtns").hide();
			$("#addbtn").show();
			updateArcStrcoords();
		}else{
			//ajax 保存
			$.ajax({
				url:"/roadnet/edit/addRoadLink",
				type:"post",
				dataType:"json",
				data:{strcoords:pLine.getPoints().join(","),direction:0},
				success:function(data){
					if(data.result == "success"){
						alert("保存成功!");
					}
					mapframe.loadmodule("modules/roadnet/edit/js","editarc_map",function(ad){
						ad.closeWMS();
						ad.showarcWMS();
					});
				}
			});
			$("#addbtn").show();
			$(".subbtns").hide();
		}
		
	});
	$("#cancelbtn").on('click',function(){
		if(!!pLine){
			mapframe._MapApp.removeOverlay(pLine);
		}
		mapframe._MapApp.changeDragMode("pan");
		if(isincrossmap){
			isincrossmap = false;
			$(".dirbtns").hide();
			$(".subbtns").hide();
			$("#addbtn").show();
		}else{
			$("#addbtn").show();
			$(".subbtns").hide();
		}
		
	});
	
	$(".dirbtns").on('click',function(){
		if($(this).val() == "del"){
			delArc();
		}else{
			updateArcDirection(pLine.arcid,$(this).val());
		}
		
	});
	
	oFrm = $("#mapframe")[0];
	oFrm.src = baseUrl+"vendor/himap/puremap.html";
	oFrm.onload = oFrm.onreadystatechange = function(){
		if(this.readyState=='loaded' || this.readyState=='complete'){
			setTimeout(function(){
				mapframe.loadmodule("modules/roadnet/edit/js","editarc_map",function(ad){
					ad.showarcWMS();
				});
			},3000)
			
		}
	}
		
});



function mapclick(evt){
	getArcInfo(evt);
}

//获取节点详细信息
function getArcInfo(evt){
	if(isincrossmap){
		return ;
	}
	var pixpos = Tools.getMousePosition(evt,document.getElementById("mapframe"));
	var pos = editarc_map.getMousePos(pixpos.x,pixpos.y);
	strcoords = pos.lon+","+pos.lat;
	getAjaxArcInfo(strcoords);
}


function getAjaxArcInfo(strcoords){
	$.ajax({
		url:"/roadnet/edit/getRouteArc",
		type:"get",
		dataType:"json",
		data:{strcoords:strcoords},
		success:function(data){
			routearc = data.result; //节点信息
			if(null!=routearc.ARCID){
				$("#addbtn").hide();
				$(".subbtns").show();
				$(".dirbtns").show();
				pLine = drawline(routearc.STRCOORDS,routearc.TRAFFIC_DIR);
				pLine.arcid = routearc.ARCID;
				isincrossmap = true;
			}
			
		}
	});
}

/**
* 更新roadarc方向
* @param linkid link编码
* @param edittype 编辑类型 0：正向 1：反向 2：双行 3：限行
*/
function updateArcDirection(arcid,edittype){
	$.ajax({
		url:"/roadnet/edit/updateArcdirection",
		type:"get",
		dataType:"json",
		data:{arcid:arcid,direction:edittype},
		success:function(data){
			if(data.result!="success"){
				alert("调整方向失败");
			}else{
				var strcoords = pLine.getPoints().join(",");
				mapframe._MapApp.removeOverlay(pLine);
				pLine = drawline(strcoords,edittype);
				pLine.arcid = arcid;
				
			}
		}
	});
}

function updateArcStrcoords(){
	var strcoords = pLine.getPoints().join(",");
	var arcid = pLine.arcid;
	$.ajax({
		url:"/roadnet/edit/updateArcStrcoords",
		type:"get",
		dataType:"json",
		data:{arcid:arcid,strcoords:strcoords},
		success:function(data){
			if(data.result!="success"){
				alert("保存失败");
			}
		}
	});
}

function delArc(){
	 if(window.confirm("确定要删除吗？")){
		var arcid = pLine.arcid;
		$.ajax({
			url:"/roadnet/edit/delArc",
			type:"get",
			dataType:"json",
			data:{arcid:arcid},
			success:function(data){
				if(data.result!="success"){
					alert("删除失败");
				}else{
					alert("删除成功!");
					mapframe._MapApp.removeOverlay(pLine);
					isincrossmap = false;
					$(".dirbtns").hide();
					$(".subbtns").hide();
				}
			}
		});
    }
}



function drawline(strcoords,direction){
	direction = direction || "0";
	if(direction == "0"){
		pLine = new mapframe.Polyline(strcoords,"green",5,1,1);// 构造一个多义线对象
	}else if(direction == "1"){
		pLine = new mapframe.Polyline(strcoords,"green",5,1,-1);// 构造一个多义线对象
	}else{
		pLine = new mapframe.Polyline(strcoords,"green",5,1,0);// 构造一个多义线对象
	}
	mapframe._MapApp.addOverlay(pLine);
	pLine.enableEdit();
	return pLine;
}


