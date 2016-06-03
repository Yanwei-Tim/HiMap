/**
 * Created by liuxiaobing on 2016-1-5.
 */
define(["avalon","jquery"], function(avalon,$) {
    avalon.component("hi:label", {
        $slot: "content",
        content: "",
        color: "default", //primary success info warning danger
        $template: "<span>{{content|html}}</span>",
        $replace: true,
        pill: false,
        $dispose: function (vm, element) {
            element.innerHTML = ""
        },
        $ready: function (vm, element) {
            var root = avalon(element)
            root.addClass("label")
            root.addClass("label-"+vm.color)
            if(vm.pill){
                root.addClass("label-pill")
            }
        }
    })
    return avalon;

});