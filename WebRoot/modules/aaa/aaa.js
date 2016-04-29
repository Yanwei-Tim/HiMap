
define(["avalon", "text!./aaa.html"], function(avalon, aaa) {

    avalon.templateCache.aaa = aaa
    avalon.define({
        $id: "aaa",
        username: "hiatmp"
    })
    avalon.vmodels.root.page = "aaa"

})