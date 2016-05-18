/**
 * Created by liuxiaobing on 2016-1-5.
 */
define(["himap"], function(HiMap) {
    
        /**
         * 画点
         * @param {function(String)} [callback] 回调函数
         * @return {IHiMap}
         */
        HiMap.prototype.drawPoint = function (callback) {};

        /**
         * 画矩形
         * @param {function(String)} [callback] 回调函数
         * @return {IHiMap}
         */
        HiMap.prototype.drawRect = function (callback) {};

        /**
         * 画圆
         * @param {function(String)} [callback] 回调函数
         * @return {IHiMap}
         */
        HiMap.prototype.drawCircle = function (callback) {};

        /**
         * 画线
         * @param {function(String)} [callback] 回调函数
         * @return {IHiMap}
         */
        HiMap.prototype.drawPolyline = function (callback) {};

        /**
         * 画多边形
         * @param {function(String)} [callback] 回调函数
         * @return {IHiMap}
         */
        HiMap.prototype.drawPolygon = function (callback) {};

});