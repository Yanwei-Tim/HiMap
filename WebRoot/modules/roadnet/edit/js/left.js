require.config({
    baseUrl:"../../../"
})

define(["components/panel/hiatmp.panel",
        "components/listgroup/hiatmp.listgroup",
        "components/label/hiatmp.label",
        "text!../left.html"],
    function(panel,listgroup,label,left) {

        avalon.templateCache.left = left;
        avalon.vmodels.root.left = "left";

    });