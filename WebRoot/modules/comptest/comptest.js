
define(["avalon","../../components/button/avalon.button", "text!./comptest.html"], function(avalon,button,comptest) {

    avalon.templateCache.comptest = comptest;
    var vm = avalon.define({
	    $id: "test",
	    btnconfig: {
	        text: "提交"
	    }

	})

    avalon.vmodels.root.page = "comptest";

})