$(document).ready(function(){
	
	var tonailLayer = null;
	var mapLayers = null;//图层面板图层
	var favorLayers = null; //快捷图层
	var mouseIsiInLayerDiv = false;
	var recsearchflag=0;
	var equipsearchflag=0;
	
	$("#mapPanelDiv").load("mapmgr/jsp/templates/indextpl.html",function(){
		$("#mapServerDiv").unwrap(); //移出 mapPanelDiv 
		$("#mapPanelDiv").remove();
		
		$("#mapServerDiv").css('top',$(document).height()-70);
		$("#zoomDiv").css('top',$(document).height()-125);
		
		/*加载所有图层信息*/
		$.ajax({
			url:"himap/getMapToolAuth.do",
			type:"get",
			dataType:"json",
			data:{},
			success:function(data){
				if(data.oneKeySearch == "false"){
					$("#oneKeySearch").remove();
				}
			}
		});
		
		
		/*加载所有图层信息*/
		$.ajax({
			url:"himap/getuserLayers.do",
			type:"post",
			dataType:"json",
			data:{},
			success:function(data){
				if(data!=null){
					var layers = data.rows; //从后台传过来的图层数据
					mapLayers = [];
					favorLayers = [];
					
					for(var i=0;i<layers.length;i++){
						var templayer = layers[i];
						if(templayer.isfavor =="1"){
							favorLayers.push(templayer);
						}
						if(mapLayers[templayer.lparent] == null){
							mapLayers[templayer.lparent] = [];
						}
						mapLayers[templayer.lparent].push(templayer);
					}
					//排序快捷图层
					favorLayers = sortLayers(favorLayers,1);
					
					//排序图层面板图层
					for(var i=0;i<mapLayers.length;i++){
						mapLayers[i] = sortLayers(mapLayers[i],0);
					}
					//初始化快捷图层栏
					for(var i=0;i<favorLayers.length;i++){
						var templayer = favorLayers[i];
						var layerhtml = "<li title='"+templayer.lname+"' id='icon-"+templayer.lid+"'><img  src='"+templayer.licon+"' title='"+templayer.lname+"' /></li>";
						$("#tools").before(layerhtml);
					}
					
					//初始化图层面板
					var layergroups = mapLayers[0];
					var twoRowHeight = 0;
					var threeRowHeight = 0;
					var fourRowHeight = 0;
					var fiveRowHeight = 0;
					var rownum = 4;
					var maxRowWidth = 0;
					for(var i=0;i<layergroups.length;i++){
						var templayers = mapLayers[layergroups[i].lid];
						if(templayers == null || templayers.length==0){
							continue;
						}
						twoRowHeight+=(parseInt(templayers.length/2)+(templayers.length%2==0?0:1))*22+30;
						threeRowHeight+=(parseInt(templayers.length/3)+(templayers.length%3==0?0:1))*22+30;
						fourRowHeight+=(parseInt(templayers.length/4)+(templayers.length%4==0?0:1))*22+30;
						fiveRowHeight+=(parseInt(templayers.length/5)+(templayers.length%5==0?0:1))*22+30;
					}
					var height = $(document).height()-100;
					if(height - twoRowHeight>=200){
						rownum = 2;
						$("#layerDiv .layer_table tr td").css('width','50%');
					}else if(height - threeRowHeight>=90){
						rownum = 3;
						$("#layerDiv .layer_table tr td").css('width','33%');
					}else if(height - fourRowHeight>=100){
						rownum = 4;
						$("#layerDiv .layer_table tr td").css('width','25%');
					}else{
						rownum = 5;
						$("#layerDiv .layer_table tr td").css('width','20%');
					}
					
					for(var i=0;i<layergroups.length;i++){
						var layergroup = layergroups[i];
						var layerhtml = "<li id='"+layergroup.lid+"'>";
						layerhtml+="<div class='layer_title' > <img src='"+layergroup.licon+"' style='vertical-align:middle;width:17px;height:17px;' />&nbsp;"+layergroup.lname;
						layerhtml+="</div> ";
						layerhtml+="<div class = 'layer_content'>";
						layerhtml+="<table border='0' class = 'layer_table'>";
						var templayers = mapLayers[layergroup.lid];
						if(templayers == null || templayers.length==0){
							continue;
						}
						var nextlinecount = 0;
						for(var m=0;m<templayers.length;m++){
							var layer = templayers[m];
							if(layer.lname.length*12+55>maxRowWidth){
								maxRowWidth = layer.lname.length*12+55;
							}
							if(nextlinecount == 0){
								layerhtml+="<tr>";
							}
							layerhtml+="<td>";
							layerhtml+="<input type='hidden' class='modulename' value='"+layer.modulename+"'/>";
							layerhtml+="<input type='hidden' class='cfunc' value=\""+layer.cfunc+"\"/>";
							layerhtml+="<input type='hidden' class='ucfunc' value=\""+layer.ucfunc+"\"/>";
							layerhtml+="<div class ='layer_check'><img src='images/map/uncheck.png'/></div>";
							layerhtml+="<span  id='"+layer.lid+"' class='layer_type' name = '"+layer.thirdsyscode+"'>";
							layerhtml+="<img  class='layer_icon' src='"+layer.licon+"' title='"+layer.lname+"' />"+layer.lname;
							layerhtml+="</span>";
							layerhtml+="&nbsp;&nbsp;<img src='images/map/nail.png' class='nail' title='固定在右侧' /></td>";
							nextlinecount++;
							if(nextlinecount == rownum){
								nextlinecount = 0;
								layerhtml+="</tr>";
							}
						}
						if(nextlinecount<rownum && nextlinecount>0){
							for(var nultd=0;nultd<rownum-nextlinecount;nultd++){
								layerhtml+="<td></td>";
							}
							layerhtml+="</tr>";
						}
						layerhtml+="</table></div></li>";
						$("#layerDiv ul").append(layerhtml);
						$("#layerDiv").css('width',maxRowWidth*rownum);
					}
				}
			}
		});
		
		
		
		//排序图层
		function sortLayers(favorLayers,sortEm){
			for(var m =favorLayers.length-1;m>0;m--){
				for(var k=0;k<m;k++){
					var player = favorLayers[k];
					var nlayer = favorLayers[k+1];
					var swaplayer = null;
					var porder = Number(sortEm==0?player.lorder:player.favororder);
					var norder = Number(sortEm==0?nlayer.lorder:nlayer.favororder);
					//alert(porder+","+norder);
					if(porder>norder){
						swaplayer = player;
						favorLayers[k] = nlayer;
						favorLayers[k+1] = swaplayer;
					}
				}
			}
			return favorLayers;
		}
		
	    //快捷图层栏
	    $(document).on('mouseover','#mapToolDiv li',function(){
			$(this).attr("class","li_mouseover");
			var layerid = $(this).attr("id");
			if($("#layerDiv").css("display") != "none"){
				$("#"+layerid.substring(5)).trigger("click");
			}
	    	//$("#"+layerid.substring(5)).addClass("tdover");
		});
		$(document).on('mouseout','#mapToolDiv li',function(){
			$(this).attr("class","li_mouseout");
			var layerid = $(this).attr("id");
			//$("#"+layerid.substring(5)).removeClass("tdover");
		});
		
	    $(document).on('click','#mapToolDiv li',function(event) {
	    	$("#layerDiv .layer_type").css("background-color","");
	    	$(".nail").hide();
	    	var id = $(this).attr("id");
	    	if(id == "layers"){ //图层面板
	    		$("#toolDiv").hide("fast");
	    		$("#searchDiv").hide("fast");
		    	$("#tools").css("background-color","");
		    	$("#equipsearch").css("background-color","");
	    		
	    		if($("#layerDiv").css("display") == "none"){
		    		$("#layerDiv").show("fast");
		    		$(this).css("background-color","#083548");
		    	}else{
		    		$("#layerDiv").hide("normal");
		    		$(this).css("background-color","");
		    	}
		    	event.stopPropagation();
	    	}else if(id == "tools"){ //工具按钮
	    		$("#searchDiv").hide("fast");
	    		$("#layerDiv").hide("fast");
	    		$("#layers").css("background-color","");
		    	$("#equipsearch").css("background-color","");
	    		
	    		if($("#toolDiv").css("display") == "none"){
	    			if($(this).position().top+$("#mapToolDiv").position().top+$("#toolDiv").height()>$(document).height()){
	    				$("#toolDiv").css('top',$(this).position().top+$("#mapToolDiv").position().top-$("#toolDiv").height()+37);
	    			}else{
		    			$("#toolDiv").css('top',$(this).position().top+$("#mapToolDiv").position().top);
	    			}
		    		$("#toolDiv").show("fast");
		    		$(this).css("background-color","#083548");
		    	}else{
		    		$("#toolDiv").hide("fast");
		    		$(this).css("background-color","");
		    	}
		    	event.stopPropagation();
	    	}else if(id == "equipsearch"){ //设备搜索按钮
	    		$("#toolDiv").hide("fast");
	    		$("#layerDiv").hide("fast");
	    		$("#layers").css("background-color","");
		    	$("#tools").css("background-color","");
	    		
	    		if($("#searchDiv").css("display") == "none"){
	    			$("#searchDiv").css('top',$(this).position().top+$("#mapToolDiv").position().top);
		    		$("#searchDiv").show("fast");
		    		$(this).css("background-color","#083548");
		    	}else{
		    		$("#searchDiv").hide("fast");
		    		$(this).css("background-color","");
		    	}
		    	event.stopPropagation();
	    	}else{ //快捷图层
	    		$("#"+id.substring(5)).prev().find("img").trigger("click");
	    		//alert($(_MapApp.map.mapServer[1]).text());
	    	}
	    	
	    });
	    $('.autoHide').on('mouseover',function(){
	    	mouseIsiInLayerDiv = true;
	    });
	    
	    $('.autoHide').on('mouseout',function(){
	    	mouseIsiInLayerDiv = false;
	    });
	    
	    $(document).on('click',function(){
	    	if(!mouseIsiInLayerDiv){
	    		$(".autoHide").hide("fast");
		    	$("#layers").css("background-color","");
		    	$("#tools").css("background-color","");
		    	$("#equipsearch").css("background-color","");
	    	}
	    	$("#layerDiv .layer_type").css("background-color","");
	    	$(".nail").hide();
	    });
	    
	    
	    
	    //图层文字区域
	    $(document).on('mouseover','#layerDiv .layer_type',function(){
	    	var layerid = $(this).attr("id");
	    	if(typeof(layerid)!='undefined'){
	     		$("#icon-"+layerid).attr("class","li_mouseover");
	    	}
	    	$(this).addClass("tdover");
	    });
	    $(document).on('mouseout',"#layerDiv .layer_type",function(){
	    	var layerid = $(this).attr("id");
	    	if(typeof(layerid)!='undefined'){
	     		$("#icon-"+layerid).attr("class","li_mouseout");
	    	}
	    	$(this).removeClass("tdover");
	    });
	    $(document).on('click',"#layerDiv .layer_type",function(event){
	    	tonailLayer = $(this);
	    	$("#layerDiv .layer_type").css("background-color","");
	    	$(".nail").hide();
	    	$(this).css("background-color","#038ED1");
	    
	    	var favorlayer = $("#icon-"+$(this).attr("id"));
	    	var nail = $(this).next();
	    	nail.show();
	    	if(favorlayer.attr("id") == undefined){ //如果没有在快捷栏上，启动钉子
	    		nail.attr("src","images/map/nail.png");
	    		nail.attr("title","固定在右侧");
	    	}else{
	    		nail.attr("src","images/map/unnail.png");
	    		nail.attr("title","取消固定");
	    	}
	    	event.stopPropagation();   	
	    	
	    });
	    
	    //图钉区域
	    $(document).on('mouseover','.nail',function(){
	    	isinnail = true;
	    	var layerid = $(this).prev().attr("id");
	    	if(typeof(layerid)!='undefined'){
	     		$("#icon-"+layerid).attr("class","li_mouseover");
	    	}
	    });
	    $(document).on('mouseout',".nail",function(){
	    	isinnail = false;
	    	var layerid = $(this).prev().attr("id");
	    	if(typeof(layerid)!='undefined'){
	     		$("#icon-"+layerid).attr("class","li_mouseout");
	    	}
	    });
	    $(document).on('click',".nail",function(event){
	    	if($(this).attr("src")=="images/map/nail.png"){ //固定
	    		var layersize = $("#mapToolDiv ul li").size();
	    		if(layersize>=15){
	    			$(this).attr("title","最多只能设置12个快捷图标");
	    			event.stopPropagation();
	    			return;
	    		}
	    		$(this).attr("src","images/map/unnail.png").attr("title","取消固定");
	    		//动画效果
	    		var leftval = $("#mapToolDiv").position().left-$("#layerDiv").position().left;
		    	var topval = $("#mapToolDiv").position().top + ($("#mapToolDiv ul").children().length-1)*25;
		    	tonailLayer.find(".layer_icon").css("top",tonailLayer.position().top).css("left",tonailLayer.position().left);
		    	var preleft = tonailLayer.find(".layer_icon").css("left");
		    	var pretop = tonailLayer.find(".layer_icon").css("top");
		    	tonailLayer.find(".layer_icon").animate({
				   left: leftval, 
				   top : topval,
				   opacity: 'show'
				 }, 600,function(){//动画执行完的回调
				 	//添加快捷按钮
				 	$(this).css("left",preleft).css("top",pretop).css("display","none");
				 	var layerhtml = "<li title='"+$(this).attr('title')+"' id='icon-"+$(this).parent().attr('id')+"'><img  src='"+$(this).attr('src')+"' title='"+$(this).attr('title')+"' /></li>";
				 	$("#tools").before(layerhtml);
				 	if(isinnail){
				 		tonailLayer.next().trigger("mouseover");
				 	}
				 	if(tonailLayer.prev().find("img").attr("src") == "images/map/checked.png"){
				 		$("#icon-"+tonailLayer.attr("id")).css("background-color","#083548");
				 	}
				 	//保存到后台trigger("mouseover")
				 	layersize = $("#mapToolDiv ul li").size();
				 	var layers = "";
				 	$("#mapToolDiv ul li").each(function(i){
				 		if(i>0 && i<layersize-2){
					 		layers+=$(this).attr("id").substring(5)+","+i+"&";
				 		}
				 	});
				 	
				 	layers = layers.substring(0,layers.length-1);
					$.ajax({
						url:"himap/editFavorLayer.do",
						type:"post",
						dataType:"json",
						data:{params:layers},
						success:function(data){}
					}); 
				 	
				 });
	    	}else{
	    		$(this).attr("src","images/map/nail.png").attr("title","固定在右侧");
	    		var favorli = $("#icon-"+tonailLayer.attr('id'));
	    		favorli.hide('normal',function(){
					favorli.remove();
					
					//保存到后台
				 	layersize = $("#mapToolDiv ul li").size();
				 	var layers = "";
				 	$("#mapToolDiv ul li").each(function(i){
				 		if(i>0 && i<layersize-2){
					 		layers+=$(this).attr("id").substring(5)+","+i+"&";
				 		}
				 	});
				 	
				 	layers = layers.substring(0,layers.length-1);
					$.ajax({
						url:"himap/editFavorLayer.do",
						type:"post",
						dataType:"json",
						data:{params:layers},
						success:function(data){}
					}); 
	    		});    		
	    	}
	    	event.stopPropagation();     
	    	 	  	
	    	
	    });
	    
	    //图层前复选框区域
	    $(document).on('click',"#layerDiv .layer_check img",function(event){
	    	var modulename = $(this).parent().parent().find(".modulename").val();
	    	//modulename = "mapmgr/jsp/js/interact/assistant/assistantInteract";
	    	
	    	var cfunc = $(this).parent().parent().find(".cfunc").val();	
	    	var ucfunc = $(this).parent().parent().find(".ucfunc").val();	    	
	    	//cfunc = "mapframe.assistantInteract.showClusterDevicesByType('13')";
	    	//ucfunc = "mapframe.assistantInteract.removeDevicesByType('13')";
	    	var callfunc = cfunc;
	    	
	    	var layerid = $(this).parent().next().attr("id");
	    	if($(this).attr("src") == "images/map/uncheck.png"){ //勾选事件
	    		$(this).attr("src","images/map/checked.png");
		     	$("#icon-"+layerid).css("background-color","#083548");
	    	}else{ //取消勾选事件
	    		$(this).attr("src","images/map/uncheck.png");
	    		$("#icon-"+layerid).css("background-color","");
	    		callfunc = ucfunc;
	    	}
	    	var mmarr = modulename.split("/");
	    	//判断是否需要额外加载js文件
	    	if(modulename == null || mmarr.length<=0){
	    		eval(callfunc);
	    	}else{
	    		mapframe.loadmodule(mmarr.slice(0,mmarr.length-1).join("/"),mmarr[mmarr.length-1],function(module){
	    			eval(callfunc);
	    		});
	    	}
	    	event.stopPropagation();  
	    });
	    
	    $(document).on('mouseover',"#toolDiv ul li",function(){
	    	$(this).css("background-color","#038ED1");
	    });
	    $(document).on('mouseout',"#toolDiv ul li",function(){
	    	$(this).css("background-color","");
	    });
	    
	    $(document).on('click',"#toolDiv ul li div",function(){
	    	var id = $(this).attr('id');
	    	if(id == "clear"){ //清空
		     	$("#layerDiv .layer_check img").each(function(layer){
		     		if($(this).attr("src") == "images/map/checked.png"){
		     			$(this).trigger("click");
		     		}
		     	});
	    		MyMapFrameId._MapApp.clearOverlays();
				
	    	}else if(id == "leng"){// 测距
	    		mapframe._MapApp.measureLength();
	    	}else if(id == "area"){ //测面积
	    		mapframe._MapApp.measureArea();
	    	}else if(id == "view"){ //鹰眼
	    		MyMapFrameId._MapApp.reverseOverView();
	    	}else if(id == "print"){ //地图打印
	    		MyMapFrameId._MapApp.printmap();
	    	}else if(id == "illegalHeat"){//违法热点图
	    	   	var date=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1);
		       	begin=date.getFullYear()+"-"+((date.getMonth()+1)<10? "0"+(date.getMonth()+1):(date.getMonth()+1)) +"-"+(date.getDate()<10? "0"+date.getDate():date.getDate());
		       	end=date.getFullYear()+"-"+((date.getMonth()+1)<10? "0"+(date.getMonth()+1):(date.getMonth()+1)) +"-"+(date.getDate()<10? "0"+date.getDate():date.getDate());
		       	cpTitleName = "违法热点渲染图_"+begin;
		       	window.open("/HiatmpPro/analyzing/jsp/view/heatIllegalMap.html");
	    	}else if(id == "policeHeat"){ //警情热点图
	    	  var date=new Date(new Date().getFullYear(),new Date().getMonth(),new Date().getDate()-1);
		       	beginStr=date.getFullYear()+"-"+((date.getMonth()+1)<10? "0"+(date.getMonth()+1):(date.getMonth()+1)) +"-"+(date.getDate()<10? "0"+date.getDate():date.getDate());
		       	endStr=date.getFullYear()+"-"+((date.getMonth()+1)<10? "0"+(date.getMonth()+1):(date.getMonth()+1)) +"-"+(date.getDate()<10? "0"+date.getDate():date.getDate());
		       	policeType="01";
		      	area_id="370202";
		       	window.open("/HiatmpPro/analyzing/jsp/view/heatMap.html");
	          	cpTitleName = "警情热点渲染图_"+beginStr;
	    	}else if(id == "oneKeySearch"){ //一键查询
			    var iTop = (window.screen.availHeight-30-620)/2;      
			    var iLeft = (window.screen.availWidth-10-1000)/2;
		    	zqueryflag=window.open("/HiatmpPro/zquery.html","车辆信息查询","height="+cpHeight+",width="+cpWidth+",toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no,left="+iLeft+",top="+iTop);
	    	}else if(id == "workPanelNote"){// 工作提示面板
	    		var panel = window.parent.Ext.getCmp("workPanelNoteId");
		       	 	refreshWorkPanel();
	    		if(panel == null || panel.isHidden()){
	    			//从后台重新获取工作面板数据
		        	loadScript('index/js/workPanelNote.js');
	    		}else{
	    			panel.close();
	    		}
			    
	    	}
	    });
	    
	    $(document).on('mouseover',"#searchDiv ul li",function(){
	    	$(this).css("background-color","#038ED1");
	    });
	    
	    $(document).on('mouseout',"#searchDiv ul li",function(){
	    	$(this).css("background-color","");
	    });
	    
	    $(document).on('click',"#searchDiv ul li div",function(){
	    	var id = $(this).attr('id');
	    	if(id == "rectsearch"){
	    		mapframe.loadmodule('mapmgr/jsp/js/interact/assistant','assistantInteract',function(){
			    	if(recsearchflag==0){
					    recsearchflag=1;
			    	}
			    	loadScript("index/js/recSearchWin.js");
				});
	    	}else if(id == "equipsearch"){
	    		if(equipsearchflag==0){
			    	equipsearchflag=1;
			    }
			    loadScript("index/js/equipSearchWin.js");
	    	}
	    });
	    
	    $(document).on('click',"#currMapServer",function(){
	    	if($(this).prev().attr('name')!=null && $(this).prev().attr('name')!=''){
	    		$("#mapServerDiv .ms").show();
	    	}else if(typeof(_MapApp.map.mapServer)!='undefined' && _MapApp.map.mapServer.length>1){
	   			for(var i=0;i<_MapApp.map.mapServer.length;i++){
	   				if($(_MapApp.map.mapServer[i]).text() == "矢量地图"){
	   					$("#mapServerDiv").prepend("<div name='"+i+"' class='ms' style='float:left;background-color:#026696'>"+$(_MapApp.map.mapServer[i]).text()+"</div>");
	   				}else{
		   				$("#mapServerDiv").prepend("<div name='"+i+"' class='ms' style='float:left'>"+$(_MapApp.map.mapServer[i]).text()+"</div>");
	   				}
	   			}
	   		}
	   		
	    });
	    
	    $(document).on('click',"#mapServerDiv .ms",function(event){
	   		$(_MapApp.map.mapServer[$(this).attr('name')]).trigger('click');
	   		$('#currMapServer').html($(this).html());
	   		$('#mapServerDiv .ms').css("background-color","");
	   		$(this).css("background-color","#026696");
	   		$("#mapServerDiv .ms").hide();
	   		event.stopPropagation();
	   		
	    });
	    
	    $("#zoomin").on('click',function(event){
	    	_MapApp.zoomIn();
	    	event.stopPropagation();
	    });
	    $("#zoomin,#zoomout").on('mouseover',function(event){
	    	$(this).find('img').attr('src',$(this).find('img').attr('src').replace('.png','_.png'));
	    });
	    $("#zoomin,#zoomout").on('mouseout',function(event){
	    	$(this).find('img').attr('src',$(this).find('img').attr('src').replace('_.png','.png'));
	    });
	    $("#zoomout").on('click',function(event){
	    	_MapApp.zoomOut();
	    	event.stopPropagation();
	    });
	    
	});

});
