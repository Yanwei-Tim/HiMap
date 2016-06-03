
define(["text!../center.html"],
    function(center) {
    	$("#centerdiv").append(center);
		$("#centercontent").height($("#centerdiv").height()-$("#centertitle").height()-50);
    })