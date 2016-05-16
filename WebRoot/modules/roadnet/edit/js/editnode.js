/**
 * Created by liuxiaobing on 2015-12-25.
 */
 
 var roadlinks =[];
 var cursor = 0; //游标
 var Tools;
 var ad;
 var isincrossmap = false;
 
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
        bootstrap:"vendor/bootstrap/js/bootstrap.min",
        domReady:"vendor/require/domReady"
    }
});

require(["jquery","vendor/himap/tool/tools","text","domReady!"],function($,Tools,text,domReady){
	$("#butdiv").css("top",$(document).height()-50);
	$("#butdiv").css("left",$(document).width()/2-$("#butdiv span").width()/2);
	this.Tools = Tools;
	var oFrm = $("#mapframe")[0];
	oFrm.src = baseUrl+"vendor/himap/puremap.html";
	oFrm.onload = oFrm.onreadystatechange = function(){
		if(this.readyState=='loaded' || this.readyState=='complete'){
			setTimeout(function(){
				mapframe.loadmodule("modules/roadnet/edit/js","editnode_map",function(ad){
					ad.showWMS();
				});
			},3000);
			
		}
	}
	
	$("#returnIndex").on('click',function(){
		isincrossmap = false;
		mapframe.loadmodule("modules/roadnet/edit/js","editnode_map",function(ad){
			ad.showWMS();
			mapframe._MapApp.zoomOut();
			mapframe._MapApp.clear();
			$("#butdiv").hide();
		});
	});
	
	$("#returnIndex").on('click',function(){
		isincrossmap = false;
		mapframe.loadmodule("modules/roadnet/edit/js","editnode_map",function(ad){
			ad.showWMS();
			mapframe._MapApp.zoomOut();
			mapframe._MapApp.zoomOut();
			mapframe._MapApp.clear();
			$("#butdiv").hide();
		});
	});
	
	$("#nodejp").on('click',function(){
		getAjaxNodeInfo(strcoords,showJp);
	});
	$("#noderelation").on('click',function(){
		getAjaxNodeInfo(strcoords,showNodeRelations);
	});
	
	

});

function mapclick(evt){
	getNodeInfo(evt);
}

//获取节点详细信息
function getNodeInfo(evt){
	if(isincrossmap){
		return ;
	}
	var pixpos = Tools.getMousePosition(evt,document.getElementById("mapframe"));
	var pos = editnode_map.getMousePos(pixpos.x,pixpos.y);
	strcoords = pos.lon+","+pos.lat;
	getAjaxNodeInfo(strcoords,showJp);
}

function getAjaxNodeInfo(strcoords,callback){
	$.ajax({
		url:"/roadnet/edit/getRouteNode",
		type:"get",
		dataType:"json",
		data:{strcoords:strcoords},
		success:function(data){
			routenode = data.routenode; //节点信息
			if(null!=routenode.nodeid){
				$("#butdiv").show();
				joinpoints = data.joinpoints; //节点包含的连接点
				nearjoinpoints = data.nearjoinpoints; //节点周围的连接点
				nearnodes = data.nearnodes;//下一结点
				ftlist = data.ftlist; //禁止转向关系
				
				if(null!=callback){
					callback.call();
				}
				
			}
			
		}
	});
}

function showJp(){
	mapframe.loadmodule("modules/roadnet/edit/js","editnode_map",function(ad){
		mapframe._MapApp.clear();
		setTimeout(function(){ad.centerAndZoom(strcoords,0);isincrossmap = true;},200);
		ad.shownearjoinpoints(nearjoinpoints);
	});
}

function showNodeRelations(){
	mapframe.loadmodule("modules/roadnet/edit/js","editnode_map",function(ad){
		mapframe._MapApp.clear();
		setTimeout(function(){ad.centerAndZoom(strcoords,0);isincrossmap = true;},200);
		ad.showNearNodes(nearnodes);
		ad.showNearNodeRelation(nearnodes[0]);
		
	});
}

//添加一条连接点
function addJoinpoint(jp){
	for(var i=0;i<nearjoinpoints.length;i++){
		if(nearjoinpoints[i].POINTID == jp.POINTID){
			nearjoinpoints.splice(i,1);
			break;
		}
	}
	joinpoints.push(jp);
	//ajax添加到后台
	$.ajax({
		url:"/roadnet/edit/insertJptoNode",
		type:"get",
		dataType:"json",
		data:{nodeid:routenode.nodeid,pointid:jp.POINTID},
		success:function(data){
		}
	});
}

//删除一条连接点
function delJoinpoint(jp){
	for(var i=0;i<joinpoints.length;i++){
		if(joinpoints[i].POINTID == jp.POINTID){
			joinpoints.splice(i,1);
			break;
		}
	}
	nearjoinpoints.push(jp);
	//ajax更新到后台
	$.ajax({
		url:"/roadnet/edit/rmJpfromNode",
		type:"get",
		dataType:"json",
		data:{nodeid:routenode.nodeid,pointid:jp.POINTID},
		success:function(data){
		}
	});
}


//删除节点
function delRoutenode(nodeid){
	//ajax删除
	//更新wms图
}

//添加转向关系
function addNoderelation(fromnode,tonode,relation){
	for(var i=0;i<nearnodes.length;i++){
		if(nearnodes[i].NODEID == fromnode){
			for(var m = 0;m<nearnodes[i].ltzt.length;m++){
				if(nearnodes[i].ltzt[m].nodeid == tonode){
					nearnodes[i].ltzt[m].ltzt = relation;
					break;
				}
			}
			break;
		}
	}
	//ajax更新
	$.ajax({
		url:"/roadnet/edit/updateNodeRelation",
		type:"get",
		dataType:"json",
		data:{nodeid:routenode.nodeid,fromnode:fromnode,tonode:tonode,relation:relation},
		success:function(data){
		}
	});
}


