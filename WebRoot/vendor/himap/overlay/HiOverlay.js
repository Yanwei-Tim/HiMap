/**
 * Created by liuxiaobing on 2016-1-5.
 */
define([], function() {
    
    //叠加信息类的基类
    var HiOverlay =  function (){
        this.id;
        this.paths = null;
        this.points = new Array();
        this.point = null;
        this.iLen = null;
        this.iPause = null;
        this.timeInterval = 1000;
        this.bIsRepeat = false;
        this.bIsPlay = false;
        this.iZIndex = 100;
        this.dispStatus = 1;
        this.startSeq = 0;
        this.endSeq = 0;
        this.dScale = 1;
        this.startScaleSeq = 0;
        this.endScaleSeq = 0;
        this.statusSet = new Array();
        this.dragObject = null;
        this.bIsSyRedraw = true;
        this.map = null;
        this.angle = 0;
        this.color = "red";
        this.opacity = 1;
        this.editable = false;
        this.bIsCenter = false;
        this.init();
    };
    
    //设置其在图上的显示顺序，相当于设置其图层顺序
    HiOverlay.prototype.setZIndex = function(iIndex){};

    //获得其在图上的显示顺序，整形
    HiOverlay.prototype.getZIndex = function(){};

    //闪烁，出现和不出现之间交替3次
    HiOverlay.prototype.flash = function(){};

    //触发onclick事件
    HiOverlay.prototype.onclick = function(){};

    //功能:增加显示的状态
    //参数:
    //iStartS:开始周期
    //iEndS:结束周期
    //iStatus:状态(1:显示;2:隐藏;3:闪烁)
    HiOverlay.prototype.addDispStatus  = function(iStartS,iEndS,iStatus){};


    //图元可以移动，Func为回调函数。可以调研该函数获取其坐标：_CurentOverLay.toString()
    HiOverlay.prototype.startMove = function(func){};

    //功能:设置生长状态
    //参数:
    //iStartS:开始周期
    //iEndS:结束周期
    //dSScale:开始比例
    //dEScale:结束比例
    HiOverlay.prototype.setExtendStatus  = function(iStartS,iEndS,dSScale,dEScale){};


    //功能:设置路径
    //参数:
    //iStartS:开始周期
    //iEndS:结束周期
    //strPoints:轨迹,如:"116.3,39.4,116.5,39.4"
    HiOverlay.prototype.setPath  = function(iStartS,iEndS,strPoints){}


    //功能:显示某周期的状态
    //参数:
    //iSeq:周期
    HiOverlay.prototype.showStatus  = function(iSeq){};


    //缩放
    HiOverlay.prototype.scale = function(dscale){};

    //开始推演, bIsCenter:是否实时对中,默认为:false
    HiOverlay.prototype.play = function(bIsCenter){};

    //停止推演
    HiOverlay.prototype.stop = function(){};

    //可以编辑图形
    HiOverlay.prototype.enableEdit = function(){};

    //不可以编辑图形
    HiOverlay.prototype.disableEdit = function(){};

    //获取透明度
    HiOverlay.prototype.getOpacity = function(){};

    //设置透明度
    HiOverlay.prototype.etOpacity = function(arg){};

    //获取点坐标，Point类型
    HiOverlay.prototype.getPoint = function(){};

    //设置信息定位点，Point类型
    HiOverlay.prototype.etPoint = function(pPoint){};

    //angle:为旋转角度,container为对象，如果为空，默认为本身的容器对象
    HiOverlay.prototype.rotate = function(angle,container){};
    
    return HiOverlay;

});