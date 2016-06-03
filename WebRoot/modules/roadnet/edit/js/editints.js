/**
 * Created by liuxiaobing on 2015-12-25.
 */
 var baseUrl = "../../../";
require.config({
	baseUrl:baseUrl,
    map: {
        '*': {
            'css': 'vendor/require/css.min'
        }
    },
    paths:{
        avalon:"vendor/avalon/avalon2", 
        jquery:"vendor/jquery/jquery-1.10.2.min",
        bootstrap:"vendor/bootstrap/js/bootstrap.min",
        text: 'vendor/require/text',
        domReady:"vendor/require/domReady"
    }
});
var Tools;
var timeout;
var arrPocessTimeout;
var mapad;
var _MapApp;
var allIntsList;
var vm;
var currintsid;
require(["avalon","vendor/himap/tool/tools","jquery","components2/pager/hiatmp.pager","text","domReady!"],function(avalon,Tools,$,pager,text,domReady){
    this.Tools = Tools;
    vm = avalon.define({
        $id: "editints",
        srchSecName:'',
        srchSecNamechange:function(){
        	if(timeout!=null){
        		clearTimeout(timeout);
        	}
        	timeout = setTimeout(getIntsList,200);
       	},
       	xzqhchange : function(){
       		if(timeout!=null){
        		clearTimeout(timeout);
        	}
        	timeout = setTimeout(getIntsList,200);
       	},
       	submitswhnode : function(){
       		for(var i = 0;i<vm.intsList.length;i++){
       			if(vm.intsList[i].INTSID == currintsid){
		       		vm.intsList[i].NODEID = routenode.nodeid;
       			}
       		}
       		vm.isshowbtn = false;
       	},
       	calcelswhnode : function(){
       		vm.isshowbtn = false;
       	},
       	intsList: [],
       	xzqhList : [],
       	xzqh : '',
       	currpage : 0,
       	isshowbtn : false,
       	editintsnodes : editintsnodes
       	
    });
    //ajax 获取行政区划
    $.ajax({
		url:"/roadnet/edit/getXZQH",
		type:"get",
		dataType:"json",
		success:function(data){
			vm.xzqhList = data.xzqh;
			vm.xzqh = data.xzqh[0].ENUMNAME;
		}
	});
    
    $("#intstbl").height($(document).height()-20);
    $("#mapdiv").height($(document).height()-20);
    $("#butdiv").css("top",$(document).height()-50);
	$("#butdiv").css("left",$("#mapdiv").position().left);
    
    getIntsList();
    setTimeout(function(){
    	var oFrm = $("#mapframe")[0];
		oFrm.src = baseUrl+"vendor/himap/puremap.html";
		oFrm.onload = oFrm.onreadystatechange = function(){
			if(this.readyState=='loaded' || this.readyState=='complete'){
				setTimeout(function(){
					mapframe.loadmodule("modules/roadnet/edit/js","editints_map",function(ad){
						mapad = ad;
						_MapApp = mapframe._MapApp;
						ad.showarcWMS();
					});
				},1000);
				
			}
		}
	},1000);
   
    //获取路口列表
    function getIntsList(){
		//ajax 获取路段数据
	    $.ajax({
			url:"/roadnet/edit/getIntsList",
			type:"get",
			dataType:"json",
			data:{intsname:vm.srchSecName,xzqh:$("#xzqh").val()},
			success:function(data){
				allIntsList = data.record;
				var totalCount =  allIntsList.length;
				var limit = parseInt(($("#intstbl").height()-120)/35);
				limit = limit>totalCount?totalCount:limit;
				var showPage = parseInt(totalCount/limit);
				var maxshowPage = parseInt(($("#intstbl").width()-180)/40);
				showPage = showPage>maxshowPage?maxshowPage:showPage;
				
				$('#callBackPager').extendPagination({
		          	totalCount: totalCount,
		          	showPage : showPage,
		          	limit: limit,
		          	callback: showIntsList
		     	});
		     	showIntsList(1,limit,totalCount);
		     	
		     	
				
			}
		});
	}
	//分页显示路口列表
	function showIntsList(curr, limit, totalCount){
		var start = (curr-1)*limit;
		vm.intsList = allIntsList.slice(start,start+limit);
	}
	
	function editintsnodes(el,e){
		currintsid = el.INTSID;
		if(null!=el.STRCOORDS){
			_MapApp.centerAndZoom(el.STRCOORDS,_MapApp.getZoomLevel());
		}
		vm.isshowbtn = true;
		
	}

});

function mapclick(evt){
	getNodeInfo(evt);
}

//获取节点详细信息
function getNodeInfo(evt){
	if(!vm.isshowbtn){
		return ;
	}
	var pixpos = Tools.getMousePosition(evt,document.getElementById("mapframe"));
	var pos = mapad.getMousePos(pixpos.x,pixpos.y);
	strcoords = pos.lon+","+pos.lat;
	getAjaxNodeInfo(strcoords);
}

function getAjaxNodeInfo(strcoords){
	$.ajax({
		url:"/roadnet/edit/getRouteNode",
		type:"get",
		dataType:"json",
		data:{strcoords:strcoords},
		success:function(data){
			routenode = data.routenode; //节点信息
		}
	});
}










