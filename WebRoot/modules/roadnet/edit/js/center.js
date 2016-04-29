require.config({
    baseUrl:"../../../"
})

define(["components/panel/hiatmp.panel","text!../center.html"],
    function(panel,center) {

        avalon.templateCache.center = center;

        avalon.vmodels.root.center = "center";


    })