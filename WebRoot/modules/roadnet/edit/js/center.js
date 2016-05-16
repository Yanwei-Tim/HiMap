require.config({
    baseUrl:"../../../"
})

define(["components/panel/hiatmp.panel","text!../center.html"],
    function(panel,center) {
		var vm = avalon.vmodels.root;
        avalon.templateCache.center = center;

        vm.center = "center";
        vm.centerattr = {
        	centerTitle:"节点维护",
        	frame : "editnode"
        }


    })