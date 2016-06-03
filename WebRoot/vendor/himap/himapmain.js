
require.config({
    paths:{
        himap:"map/himap_"+window["HiMapConfig"].MAPTYPE,
        jquery:"../jquery/jquery-1.10.2.min",
        text: '../require/text',
        domReady:"../require/domReady"
    },shim: {
　　　'../handlebar/handlebars':{
　　　　　exports: 'Handlebars'
　　　}
　　}
});

require(["himap","domReady!"],function(HiMap){
	var config = window["HiMapConfig"];
	window["HiMap"] = HiMap;
	
	if(null!=config.MAPREADY){
		try{
			eval(config.MAPREADY+"()");
		}catch(a){
			alert("回调函数执行出错:"+a.message);
		}
	}
	
});


  


  