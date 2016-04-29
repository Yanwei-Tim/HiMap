/**
 * Created by liuxiaobing on 2016-1-5.
 */
define(["avalon","jquery"], function(avalon,$) {
    avalon.component("hi:listgroup", {
        $slot: "content",
        content: "",
        $template: "<ul>{{content|html}}</ul>",
        size: "", //lg sm xs
        $replace: true,
        $init: function (vm, element) {
            $(element).hide();
            if (/^\s*\<a/.test(element.innerHTML)) {
                vm.$template = "<div>{{content|html}}</div>"
            }
        },
        $ready: function (vm, element) {
            var root = avalon(element)
            root.addClass("list-group")
            normailizeMenu(element.childNodes)
            $(".list-group-item > .label", element).each(function(el){
                avalon(el).addClass("pull-right")
            })
            $(element).show();
        }
    })
    function normailizeMenu(elems) {
        for (var i = 0, el; el = elems[i++]; ) {
            if (el.nodeType === 1) {
                avalon(el).addClass("list-group-item")

            }
        }
    }
    return avalon;

});