require.config({
    baseUrl:"../../../"
})

define(["components/map/hiatmp.map","text!../map.html"],
    function(panel,map) {

        avalon.templateCache.map = map;

        avalon.vmodels.root.map = "map";


    })