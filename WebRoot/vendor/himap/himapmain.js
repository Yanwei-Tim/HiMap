
require.config({
    paths:{
        himap:"map/himap_"+window["HiMapConfig"].MAPTYPE,
        text: '../require/text',
        domReady:"../require/domReady"
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


  


  