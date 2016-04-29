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
        left: "empty",
        center:"empty",
        right:"empty",

        testparam:"aaa",


        //left 变量定义
        treeconfig:{options:{}},

        onheaderInit:avalon.noop,
        onleftInit:avalon.noop,
        oncenterInit:avalon.noop,
        onrightInit:avalon.noop
    });





    require(['./modules/leaderindex/js/header','./modules/leaderindex/js/left',
            './modules/leaderindex/js/center','./modules/leaderindex/js/right'], function() {//第三块，加载其他模块
        avalon.log("加载完毕");
        avalon.scan(document.body);
    });



});




function getTree(){
    var tree = [
        {
            text: "Parent 1",
            nodes: [
                {
                    text: "Child 1",
                    nodes: [
                        {
                            text: "Grandchild 1"
                        },
                        {
                            text: "Grandchild 2"
                        }
                    ]
                },
                {
                    text: "Child 2"
                }
            ]
        },
        {
            text: "Parent 2"
        },
        {
            text: "Parent 3"
        },
        {
            text: "Parent 4"
        },
        {
            text: "Parent 5"
        }
    ];
    return tree;
}