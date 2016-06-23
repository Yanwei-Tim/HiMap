/**
 * @Author  : liuxiaobing
 * @Date    : 2014-11-18
 * @Function: 显示辖区
 **/
define(function () {
    //交警警区数组
    var CommunityArray = new Array();
    var CommunityTitleArray = new Array();
    //大队辖区数组
    var BattalionArray = new Array();
    var BattalionTitleArray = new Array();
    //中队辖区数组
    var SquadronArray = new Array();
    var SquadronTitleArray = new Array();



    function showDistrict(nlevel) {
    	_MapApp.Tools.sendAjax(HiMapConfig.HOSTNAME+"mapindex/getLayerData?lid=6&nlevel="+nlevel,function(result){
			var districtarr = result.data;
            for (var iIndex = 0; iIndex < districtarr.length; iIndex++) {
                var pFeat = districtarr[iIndex];
                var coordinates = pFeat.coordinates;
                var overlayColor = "#D54D2B";
                if(pFeat.colorcode!=null){
                    overlayColor = pFeat.colorcode;
                }
                _MapApp.showPolygon();
                var pOverlay = new Polygon({strcoords:coordinates, color:"red", weight:1.5, opacity:0.5, fillcolor:overlayColor});
                //pOverlay.map = _MapApp.map;
                var pTitle = new Title(pFeat.shortname, 12, 7, "宋体", "white", "green", "red", 0, "true");
                pTitle.setPoint(pOverlay.centroid());
                pTitle.setOpacity(1);

                _MapApp.addOverlay(pOverlay);
                _MapApp.addOverlay(pTitle);
                //将图层放入数组用于删除
                if(nlevel == "3"){ //大队
                    BattalionArray.push(pOverlay);
                    BattalionTitleArray.push(pTitle);
                }else if(nlevel == "4"){//中队
                    SquadronArray.push(pOverlay);
                    SquadronTitleArray.push(pTitle);
                }else if(nlevel == "5"){//警区
                    CommunityArray.push(pOverlay);
                    CommunityTitleArray.push(pTitle);
                }
            }
		},false,"json");
    }

    function hideDistrict(nlevel){
        if(nlevel == "3"){ //大队
            if (BattalionArray != null) {
                for (var i = 0; i < BattalionArray.length; i++) {
                    var pOverlay = BattalionArray[i];
                    if (pOverlay != null) {
                        getMapApp().removeOverlay(pOverlay);
                    }
                }
            }
            if (BattalionTitleArray != null) {
                for (var i = 0; i < BattalionTitleArray.length; i++) {
                    var pTitle = BattalionTitleArray[i];
                    if (pTitle != null) {
                        getMapApp().removeOverlay(pTitle);
                    }
                }
            }
            BattalionArray = new Array();
            BattalionTitleArray = new Array();
        }else if(nlevel == "4"){//中队
            if (SquadronArray != null) {
                for (var i = 0; i < SquadronArray.length; i++) {
                    var pOverlay = SquadronArray[i];
                    if (pOverlay != null) {
                        getMapApp().removeOverlay(pOverlay);
                    }
                }
            }
            if (SquadronTitleArray != null) {
                for (var i = 0; i < SquadronTitleArray.length; i++) {
                    var pTitle = SquadronTitleArray[i];
                    if (pTitle != null) {
                        getMapApp().removeOverlay(pTitle);
                    }
                }
            }
            SquadronArray = new Array();
            SquadronTitleArray = new Array();
        }else if(nlevel == "5"){//警区
            if (CommunityArray != null) {
                for (var i = 0; i < CommunityArray.length; i++) {
                    var pOverlay = CommunityArray[i];
                    if (pOverlay != null) {
                        getMapApp().removeOverlay(pOverlay);
                    }
                }
            }
            if (CommunityTitleArray != null) {
                for (var i = 0; i < CommunityTitleArray.length; i++) {
                    var pTitle = CommunityTitleArray[i];
                    if (pTitle != null) {
                        getMapApp().removeOverlay(pTitle);
                    }
                }
            }
            CommunityArray = new Array();
            CommunityTitleArray = new Array();;
        }
    }

    /************************************************************************/

    return {
        showDistrict:showDistrict,
        hideDistrict:hideDistrict
    }
});