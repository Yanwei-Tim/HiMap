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
        avalon:"vendor/avalon/avalon.shim-1.5.5",
        jquery:"vendor/jquery/jquery-1.10.2.min",
        bootstrap:"vendor/bootstrap/js/bootstrap.min",
        text: 'vendor/require/text',
        domReady:"vendor/require/domReady"
    }
});

require(["avalon","jquery","text","domReady!"],function(avalon,$,text,domReady){
    avalon.templateCache.empty = " ";
    var vm = avalon.define({
        $id: "root",
        header: "empty",
        left: "empty",
        center:"empty",

        //left 变量定义
        treeconfig:{options:{}},

        onheaderInit:avalon.noop,
        onleftInit:avalon.noop,
        oncenterInit:oncenterInit,
    });

    require(['./modules/roadnet/edit/js/header','./modules/roadnet/edit/js/left',
            './modules/roadnet/edit/js/center'], function() {//第三块，加载其他模块
        avalon.log("加载完毕");
        avalon.scan(document.body);
    });

	function oncenterInit(){
		$("#centerdiv .panel-body").height($("#centerdiv").height() - $("#centerdiv .panel-title").height()-50); 
	}


});





