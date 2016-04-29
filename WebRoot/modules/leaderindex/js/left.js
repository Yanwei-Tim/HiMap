require.config({
    baseUrl:"../../../"
})

define(["components/panel/hiatmp.panel",
        "components/treeview/hiatmp.treeview",
        "components/listgroup/hiatmp.listgroup",
        "components/label/hiatmp.label",
        "text!../left.html"],
    function(panel,treeview,listgroup,label,left) {

        avalon.templateCache.left = left;
        avalon.vmodels.root.left = "left";

        avalon.vmodels.root.treeconfig.options = {data:getTree()};


        function getTree(){
            var tree = [
                {
                    text: "Parent 1",
                    nodes: [
                        {
                            text: "Child 1",
                            nodes: [
                                {
                                    text: "Grandchild 1"
                                },
                                {
                                    text: "Grandchild 2"
                                }
                            ]
                        },
                        {
                            text: "Child 2"
                        }
                    ]
                },
                {
                    text: "Parent 2"
                },
                {
                    text: "Parent 3"
                },
                {
                    text: "Parent 4"
                },
                {
                    text: "Parent 5"
                }
            ];
            return tree;
        }


    })