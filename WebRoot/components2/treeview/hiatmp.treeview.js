/**
 * Created by liuxiaobing on 2016-1-4.
 * forked by https://github.com/jonmiles/bootstrap-treeview.git
 */

define(["./bootstrap-treeview.min.js","css!./bootstrap-treeview.min.css"], function() {
    //return avalon;

    avalon.component("hi:treeview", {
        $slot:"content",
        content:"",
        elemid:'',
        $template: "<div ></div>",
        $replace: 1,

        options:{},


        $init:function(vm,elem){
            vm.elemid = elem.id;
            //$template = "<div id='"+elem.id+"'></div>";
        },


        $ready: function(vm, elem) {
            //console.log("panel构建完成")
            $(elem).treeview(vm.$model.options);
            //avalon(elem).css("width","100%");
        }

    })



})
