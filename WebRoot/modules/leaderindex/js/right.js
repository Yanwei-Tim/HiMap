require.config({
    baseUrl:"../../../"
})

define(["components/panel/hiatmp.panel","text!../right.html"],
    function(panel,right) {

        avalon.templateCache.right = right;
        avalon.vmodels.root.right = "right";

    })