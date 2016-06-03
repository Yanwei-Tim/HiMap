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
var allSectionList;
var mapad;
require(["avalon","jquery","components2/pager/hiatmp.pager","text","domReady!"],function(avalon,$,pager,text,domReady){
    
    var vm = avalon.define({
        $id: "editsection",
        srchSecName:'',
        srchSecNamechange:function(){
        	if(timeout!=null){
        		clearTimeout(timeout);
        	}
        	timeout = setTimeout(showSectionList,200);
       	},
       	sectionList: [],
       	editsectionarcs : editsectionarcs
       	
    });
    
    
    $("#sectiontbl").height($(document).height()-20);
    $("#mapdiv").height($(document).height()-20);
    
    getIntsList();
    setTimeout(function(){
    	var oFrm = $("#mapframe")[0];
		oFrm.src = baseUrl+"vendor/himap/puremap.html";
		oFrm.onload = oFrm.onreadystatechange = function(){
			if(this.readyState=='loaded' || this.readyState=='complete'){
				setTimeout(function(){
					mapframe.loadmodule("modules/roadnet/edit/js","editsection_map",function(ad){
						mapad = ad;
						ad.showarcWMS();
					});
				},1000);
				
			}
		}
	},1000);
   
    //显示路段列表
    function getIntsList(){
		//ajax 获取路段数据
	    $.ajax({
			url:"/roadnet/edit/getSectionList",
			type:"get",
			dataType:"json",
			data:{sectionname:vm.srchSecName},
			success:function(data){
				
				allSectionList = data.record;
				var totalCount =  allSectionList.length;
				var limit = parseInt(($("#sectiontbl").height()-120)/35);
				limit = limit>totalCount?totalCount:limit;
				var showPage = parseInt(totalCount/limit);
				var maxshowPage = parseInt(($("#sectiontbl").width()-180)/40);
				showPage = showPage>maxshowPage?maxshowPage:showPage;
				
				$('#callBackPager').extendPagination({
		          	totalCount: totalCount,
		          	showPage : showPage,
		          	limit: limit,
		          	callback: showSectionList
		     	});
		     	showSectionList(1,limit,totalCount);
			}
		});
	}
	
	//分页显示路段列表
	function showSectionList(curr, limit, totalCount){
		var start = (curr-1)*limit;
		vm.sectionList = allSectionList.slice(start,start+limit);
	}
	
	function editsectionarcs(el,e){
		if(el.ARCS!=null){
		}else{
			mapad.drawLine(function(strcoords){
				var points = strcoords.split(",");
				var startpoint = "";
				var endpoint = "";
				var inpoints = "";
				for(var i=0;i<points.length;i++){
					if(i<2){
						startpoint+=points[i]+",";
					}else if(i>points.length-3){
						endpoint+=points[i]+",";
					}else{
						inpoints+=points[i]+",";
					}
				}
				startpoint = startpoint.substring(0,startpoint.length-1);
				inpoints = inpoints.substring(0,inpoints.length-1);
				endpoint = endpoint.substring(0,endpoint.length-1);
				var url = "/roadnet/analy/queryShortestPath?startpoint="+startpoint+"&endpoint="+endpoint;
				//ajax 获取路段数据
			    $.ajax({
					url:"/roadnet/analy/queryShortestPath",
					type:"get",
					dataType:"json",
					data:{startpoint : startpoint,endpoint : endpoint,inpoints: inpoints},
					success:function(data){
						var path = data.path;
						mapad.showroad(path);
					}
				});
				
			});
		}
		
	}
	
	//大数据量循环的优化方法
	function largeArrayProcess(array,process,onceNum,context){
		arrPocessTimeout = setTimeout(function(){
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

	

});










