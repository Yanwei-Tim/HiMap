/**
 * Created by liuxiaobing on 2016-1-4.
 */
require.config({
    baseUrl:"../../"
})

define(["components/panel/hiatmp.panel","text!./header.html","text!./left.html","text!./center.html","text!./right.html"],
    function(panel,header,left,center,right) {
        avalon.templateCache.header = header;
        avalon.templateCache.left = left;
        avalon.templateCache.center = center;
        avalon.templateCache.right = right;

        avalon.vmodels.root.header = "header";
        avalon.vmodels.root.left = "left";
        avalon.vmodels.root.center = "center";
        avalon.vmodels.root.right = "right";



    })