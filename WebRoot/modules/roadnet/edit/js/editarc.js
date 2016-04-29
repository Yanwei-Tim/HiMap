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
	$(".dirbtns").hide();
	$(".subbtns").hide();
	$("#addbtn").on('click',function(){
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


