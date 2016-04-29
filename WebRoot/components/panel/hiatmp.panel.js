/**
 * Created by liuxiaobing on 2015-12-30.
 */
define(["avalon","jquery","text!./hiatmp.panel.html","css!./hiatmp.panel"], function(avalon,$,template) {

    avalon.component("hi:panel", {
        $slot:"content",        
        content:"",
        $template: template,
        $replace: 1,

        color:"default",
        hasheading:false,
        hascontent:false,
        hasfooter:false,
        heading:"",
        tcontent:"",
        footer:"",

        $init:function(vm,elem){
            var root = avalon(elem);
            root.addClass("panel-"+vm.color);
            normailize(vm,elem);
        },
        $ready: function(vm, elem) {
            //avalon(elem).css("width","100%");
            //alert($('#tree').text());
            //console.log("panel构建完成")
        }
        
    })

    function normailize(vm,elem){
        var elems = elem.childNodes;
        var divs=[];
        for(var i=0,el;el=elems[i++];){
            if(el.nodeType===1 && el.tagName==="DIV"){
                divs.push(el);
            }
        }
        vm.hascontent = (divs.length>=1);
        vm.hasheading = (divs.length>=2);
        vm.hasfooter = (divs.length>=3);
        
        switch(divs.length){
            case 1:
                vm.tcontent = divs[0];
                break;
            case 2:
                vm.heading = divs[0];
                vm.tcontent = divs[1];
                break;
            case 3:
                vm.heading = divs[0];
                vm.tcontent = divs[1];
                vm.footer = divs[2];
                break;
        }
        if(vm.hasheading){
            var headelems = vm.heading.childNodes;
            for(var i=0,el;el=headelems[i++];){
                if(el.nodeType===1 && el.tagName.match("^H[0-9]{1}")){
                    avalon(el).addClass("panel-title");
                }
            }
        }
    }

    return avalon;

});