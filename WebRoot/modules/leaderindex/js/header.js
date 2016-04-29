require.config({
    baseUrl:"../../../"
})

define(["components/panel/hiatmp.panel","text!../header.html"],
    function(panel,header) {
        avalon.templateCache.header = header;

        avalon.vmodels.root.header = "header";



    })