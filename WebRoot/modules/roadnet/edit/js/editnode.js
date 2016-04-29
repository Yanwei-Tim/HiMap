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
	
	$("#nodejp").on('click',showJp);
	$("#noderelation").on('click',showNodeRelations);
	
	

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
	$.ajax({
		url:"/roadnet/edit/getRouteNode",
		type:"get",
		dataType:"json",
		data:{strcoords:strcoords},
		success:function(data){
			routenode = data.routenode; //节点信息
			if(null!=routenode.nodeid){
				$("#butdiv").show();
				noderelations = data.noderelations; //连通关系
				joinpoints = data.joinpoints; //节点包含的连接点
				nearjoinpoints = data.nearjoinpoints; //节点周围的连接点
				nearnodes = data.nearnodes;
				var relationarr = noderelations.next_nodes.split(",");
				var ltztarr = noderelations.ltztj.split(",");
				for(var i=0;i<nearnodes.length;i++){
					nearnodes[i].ltzt = [];
					nearnodes[i].routenode = routenode;
					var m = 0;
					for(m = 0;m<relationarr.length;m++){
						if(relationarr[m] == nearnodes[i].NODEID){
							break;
						}
					}
					var ltzt = ltztarr[m];
					for(m = 0;m<relationarr.length;m++){
						for(var k=0;k<nearnodes.length;k++){
							if(nearnodes[k].NODEID == relationarr[m]){
								nearnodes[i].ltzt.push({nodeid:relationarr[m],ltzt:ltzt.substring(m,m+1),strcoords:nearnodes[k].STRCOORDS})
								break;
							}
						}
					}
					
				}
				//显示连接点
				showJp();
				
			}
			
		}
	});
}

function showJp(){
	mapframe.loadmodule("modules/roadnet/edit/js","editnode_map",function(ad){
		mapframe._MapApp.clear();
		ad.closeWMS();
		setTimeout(function(){ad.centerAndZoom(strcoords,0);isincrossmap = true;},200);
		ad.showcross(routenode);
		ad.showjoinpoints(joinpoints);
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
	alert(jp.POINTID);
	for(var i=0;i<nearjoinpoints.length;i++){
		if(nearjoinpoints[i].POINTID == jp.POINTID){
			nearjoinpoints.splice(i,1);
			break;
		}
	}
	joinpoints.push(jp);
	//ajax添加到后台
	//更新连接点列表
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
	//更新连接点列表
}


//删除节点
function delRoutenode(nodeid){
	//ajax删除
	//更新wms图
}

//添加转向关系
function addNoderelation(fromnode,tonode,relation){
	alert(fromnode+"--"+tonode+"--"+relation);
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


