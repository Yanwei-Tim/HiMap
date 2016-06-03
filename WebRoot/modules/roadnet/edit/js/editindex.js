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
        jquery:"../../../vendor/jquery/jquery-1.10.2.min",
        currurl:"./modules/roadnet/edit",
        bootstrap:"../../../vendor/bootstrap/js/bootstrap.min",
        text: '../../../vendor/require/text',
        domReady:"../../../vendor/require/domReady"
    }
});

require(["jquery","text","domReady!"],function($,text,domReady){

    require(['currurl/js/header','currurl/js/left'], function(header,left) {//第三块，加载其他模块
	    $("#contentdiv").height($(window).height()-$("#headerdiv").height()-40);
	    require(['currurl/js/center']);
        
    });



});





