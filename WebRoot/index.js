/**
 * Created by liuxiaobing on 2015-12-25.
 */
require.config({
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
        map: "empty",

        onmapInit:avalon.noop,
        
    });





    require(['./modules/index/js/map'], function() {//第三块，加载其他模块
        avalon.log("加载完毕");
        avalon.scan(document.body);
    });



});
