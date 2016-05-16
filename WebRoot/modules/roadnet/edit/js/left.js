
define(["components/panel/hiatmp.panel",
        "components/listgroup/hiatmp.listgroup",
        "components/label/hiatmp.label",
        "text!../left.html","jquery"],
    function(panel,listgroup,label,left,$) {
		var vm = avalon.vmodels.root;
        avalon.templateCache.left = left;
        vm.left = "left";
        
        vm.leftattr = {
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
        }
        
        
    });