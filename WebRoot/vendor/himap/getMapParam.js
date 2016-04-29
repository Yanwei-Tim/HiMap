	
var mapurl = ""; //地图url地址
var centerpoint = ""; //地图中心点
var initlevel = "";   //地图初始化显示层级
var geoserverURL = "";//geoserver地址，用于展示路况、渲染图等专题图
var mapmaxlevel = ""; //地图最大显示级别


var rooturl = document.URL.split( "/" )[0]+"/"+ document.URL.split( "/" )[1]+"/"+ document.URL.split( "/" )[2]+"/"+ document.URL.split( "/" )[3];
var request;
if (window.ActiveXObject) {
    request = new ActiveXObject("Microsoft.XMLHTTP");
} else if (window.XMLHttpRequest) {
    request = new XMLHttpRequest();
}
var url = "/getSysParams?sysparams=2001,2002,2003,2004,2005";
try {
    request.onreadystatechange = function(){
        if (request.readyState == 4) {
            var data = "";
            if (request.status == 200 || request.status == 0) {
                if (typeof(JSON) == 'undefined'){
                    data = eval("("+request.responseText+")");
                }else{
                    data = JSON.parse(request.responseText);
                }
                for(var i=0;i<data.record.length;i++){
                	var sysparam = data.record[i];
                	if(sysparam.PARAMCODE == '2001'){
                		mapurl = sysparam.PARAMVALUE;
                	}else if(sysparam.PARAMCODE == '2002'){
                		centerpoint = sysparam.PARAMVALUE;
                	}else if(sysparam.PARAMCODE == '2003'){
                		mapmaxlevel = sysparam.PARAMVALUE;
                	}else if(sysparam.PARAMCODE == '2004'){
                		initlevel = sysparam.PARAMVALUE;
                	}else if(sysparam.PARAMCODE == '2005'){
                		geoserverURL = sysparam.PARAMVALUE;
                	}
                }
                if(mapurl == null || mapurl == ""){
                    alert("地图引擎配置错误!");
                }else{
                    document.writeln("<SCRIPT type='text/javascript' src='"+mapurl+"'><\/SCRIPT>");
                }
                
            }
        }
    };
    request.open("POST", url, false);
    request.send("");
} catch (exception) {
    // alert("您要访问的资源不存在!");
}