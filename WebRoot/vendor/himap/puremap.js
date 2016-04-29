//地图对象
var _MapApp;

require.config({
    baseUrl:'../../',
　　paths: {
　　　　'jquery':'vendor/jquery/jquery-1.10.2.min'
　　}
});

require(['jquery'], function ($){
	$("#map").click(mapclick);
    window.parent._MapApp = window._MapApp;
    window.parent.loadmodule = loadmodule;
});

  
  //加载模块js对应的文件
  function loadmodule(modulepath,modulename,callback){
  	require([modulepath+'/'+modulename],function(module){
  		window[modulename] = module;
        window.parent.window[modulename] = module;
        if(typeof(callback)!='undefined'){
	  		callback.call(this,module);
        }
  	});
  }
  
  


  