/**
 * Created by liuxiaobing on 2015-12-25.
 */
 
 var roadlinks =[];
 var cursor = 0; //游标
 
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
	$("#butdiv").css("top",$(document).height()-50);
	$("#butdiv").css("left",$(document).width()/2-$("#butdiv span").width()/2);
	$("#prevbtn").on('click',function(){
		
		var pline = roadlinks[cursor-1].pline;
		if(pline!=null){
			_MapApp.removeOverlay(pline);
			roadlinks[cursor-1].pline = null;
		}
		cursor =  cursor-2;
		showNextRoadLink();
	});
	$("#nextbtn").on('click',function(){
		showNextRoadLink();
	});
	$("#ritbtn").on('click',function(){
		updateRoadLink(roadlinks[cursor-1].LINKID,-1);
	});
	$("#oppbtn").on('click',function(){
		roadlinks[cursor-1].DIRECTION = roadlinks[cursor-1].DIRECTION=='0'?'1':'0';
		updateRoadLink(roadlinks[cursor-1].LINKID,roadlinks[cursor-1].DIRECTION);
	});
	$("#dblbtn").on('click',function(){
		roadlinks[cursor-1].DIRECTION = 2;
		updateRoadLink(roadlinks[cursor-1].LINKID,2);
	});
	$("#forbtn").on('click',function(){
		roadlinks[cursor-1].DIRECTION = 3;
		updateRoadLink(roadlinks[cursor-1].LINKID,3);
	});

	oFrm = $("#mapframe")[0];
	oFrm.src = baseUrl+"vendor/himap/puremap.html";
	oFrm.onload = oFrm.onreadystatechange = function(){
		if(this.readyState=='loaded' || this.readyState=='complete'){
			setTimeout(function(){
				mapframe.loadmodule("modules/roadnet/edit/js","arcdirection_map",function(ad){
					ad.showlinkWMS();
				});
				getRoadLink();
			},3000)
			
		}
	}
		
		
	//获取route_roadlink数据
	function getRoadLink(){
		$.ajax({
			url:"/roadnet/edit/getAllRoadLink",
			type:"get",
			dataType:"json",
			data:{},
			success:function(data){
				roadlinks = data.record;
				showNextRoadLink();	
				$("#totalcount").html(roadlinks.length-cursor);
			}
		});
	}
	
	//编辑一条roadlink
	function showNextRoadLink(){
		if(cursor>0){
			var pline = roadlinks[cursor-1].pline;
			if(pline!=null){
				_MapApp.removeOverlay(pline);
				roadlinks[cursor-1].pline = null;
			}
		}
		roadlink = roadlinks[cursor++];
		/*if(roadlink.DIRECTION == "1"){
			roadlink.STRCOORDS = Tools.revertCoords(roadlink.STRCOORDS);
		}*/
		mapframe.loadmodule("modules/roadnet/edit/js","arcdirection_map",function(ad){
			roadlink.pline = ad.showRoadlink(roadlink.STRCOORDS,roadlink.DIRECTION);
		});
		$("#totalcount").html(roadlinks.length-cursor);
	}
	
	/**
	* 更新roadlink记录
	* @param linkid link编码
	* @param edittype 编辑类型 0：反向 1：双向 2：限行
	*/
	function updateRoadLink(linkid,edittype){
		$.ajax({
			url:"/roadnet/edit/updateLinkDirection",
			type:"post",
			dataType:"json",
			data:{linkid:linkid,direction:edittype},
			success:function(data){
				showNextRoadLink();	
			}
		});
	}
	

});


