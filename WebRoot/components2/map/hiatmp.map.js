/**
 * Created by liuxiaobing on 2015-12-30.
 */
define(["avalon","text!./hiatmp.map.html"], function(avalon,template) {

    avalon.component("hi:map", {
        $slot:"content",        
        content:"",
        $template: template,
        $replace: 1,

        color:"default",

        $init:function(vm,elem){
            
        },
        $ready: function(vm, elem) {
            //avalon(elem).css("width","100%");
            //alert($('#tree').text());
            //console.log("panel构建完成")
        }
        
    })

    return avalon;

});