/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {

	/**图标判断规则
	 *设备图标以“配置项_配置项_配置项...”的方式命名。
	 *配置项一般为传入数据的属性名称，后面用括号列举出可选的值。
	 *如果某个配置项没有列举可选值，代表该配置项为可选的，如果传入数据中没有该属性或者属性值为空，则跳过该配置项。
	 *如果某个配置项列举了可选值，列表的第一个为默认值，如果属性值不在可选列表中，则用默认值表示。
	 *解析完后，"_null" 用""替换
	*/
    var devicetypes = {};
    devicetypes["01"] = {devicetype:"01",devicename:"电子警察",icon:"devicetype_devicestate(2,1)"};
	devicetypes["02"] = {devicetype:"02",devicename:"卡口",icon:"devicetype_devicestate(2,1)"},
	devicetypes["03"] = {devicetype:"03",devicename:"超速检测",icon:"devicetype_devicestate(2,1)"},
	devicetypes["10"] = {devicetype:"10",devicename:"诱导屏",icon:"devicetype_vmstype(null,2,3,7)_vmssubtype_direction_devicestate(2,1)"},
	devicetypes["11"] = {devicetype:"11",devicename:"信号机",icon:"devicetype_devicestate(2,1)"},
	devicetypes["13"] = {devicetype:"13",devicename:"视频监控",icon:"devicetype_videotype(1,2,7)_ctrlflag(1,0)_devicestate(2,1)"},
	devicetypes["16"] = {devicetype:"16",devicename:"流量检测",icon:"devicetype_devicestate(2,1)"},
	devicetypes["33"] = {devicetype:"33",devicename:"事件检测",icon:"devicetype_devicestate(2,1)"},
	devicetypes["34"] = {devicetype:"34",devicename:"气象检测系统设备",icon:"devicetype_devicestate(2,1)"}, 
	devicetypes["35"] = {devicetype:"35",devicename:"喊话系统设备",icon:"devicetype_devicestate(2,1)"}, 
	devicetypes["36"] = {devicetype:"36",devicename:"雾区行车安全智能诱导系统设备",icon:"devicetype_devicestate(2,1)"} 
    
    return {
    	devicetypes : devicetypes
    }
    

});