/**
 * Created by liuxiaobing on 2015-12-30.
 */
define(["avalon","jquery","text!./hiatmp.panel.html","css!./hiatmp.panel"], function(avalon,$,template) {

    avalon.component("ms-panel", {
        template: template,
        defaults: {
	        heading:"",
	        tcontent:"",
	        footer:"",
	        showhead : false
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
        alert(divs.length);
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
    }

    return avalon;

});