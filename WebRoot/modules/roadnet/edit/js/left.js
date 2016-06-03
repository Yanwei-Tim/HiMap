
define(["text!../left.html"],function(leftdiv) {
	$("#leftdiv").append(leftdiv);
	
	$(".leftnavl").on('click',function(){
		$(".leftnavl").removeClass("active");
		$(this).addClass("active");
		$("#centercontent").attr("src",$(this).attr("name")+".html");
	});
	/*vm.leftattr = {
        	navis:[
        		{name:'节点维护',value:'editnode'},
        		{name:'弧段维护',value:'editarc'},
        		{name:'弧段方向初始化',value:'arcdirection'},
        		{name:'路段坐标配置',value:'editsection'}
        	],
        	naviClick : function(el,idx){
        		vm.leftattr.currnavIdx = idx;
        		vm.centerattr.centerTitle = el.name;
        		$("#mapframe").attr("src",el.value+".html");
	        },
	        currnavIdx:0
        }*/
})
