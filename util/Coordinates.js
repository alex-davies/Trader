define(["require", "exports"], function (require, exports) {
    "use strict";
    var LatLngUtil = (function () {
        function LatLngUtil() {
        }
        LatLngUtil.distance = function (latlng1, latlng2) {
            var dlat = latlng2.lat - latlng1.lat;
            var dlng = latlng2.lng - latlng1.lng;
            return Math.sqrt(dlat * dlat + dlng * dlng);
        };
        return LatLngUtil;
    }());
    exports.LatLngUtil = LatLngUtil;
    var XYUtil = (function () {
        function XYUtil() {
        }
        XYUtil.distance = function (xy1, xy2) {
            var dx = xy2.x - xy1.x;
            var dy = xy2.y - xy1.y;
            return Math.sqrt(dx * dx + dy * dy);
        };
        XYUtil.angleOfLine = function (xy1, xy2) {
            var startRadians = Math.atan((xy2.y - xy1.y) / (xy2.x - xy1.x));
            startRadians += ((xy2.x >= xy1.x) ? -90 : 90) * Math.PI / 180;
            return startRadians;
        };
        XYUtil.rotate = function (rad, center, xys) {
            var translated = [];
            xys.forEach(function (xy) {
                var x = xy.x - center.x;
                var y = xy.y - center.y;
                var tx = x * Math.cos(rad) - y * Math.sin(rad);
                var ty = y * Math.cos(rad) + x * Math.sin(rad);
                tx = tx + center.x;
                ty = ty + center.y;
                translated.push({
                    x: tx,
                    y: ty
                });
            });
            return translated;
        };
        XYUtil.equals = function (xy1, xy2) {
            return xy1 && xy2 && xy1.x === xy2.x && xy1.y === xy2.y;
        };
        XYUtil.scaleRect = function (rect, scale, pivot) {
            if (pivot === void 0) { pivot = { x: rect.x + rect.width, y: rect.y + rect.height }; }
            var xyScale = typeof scale === "number"
                ? { x: scale, y: scale }
                : scale;
            var p1 = { x: rect.x, y: rect.y };
            var p2 = { x: rect.x + rect.width, y: rect.y + rect.height };
            var scaled_p1 = {
                x: ((p1.x - pivot.x) * xyScale.x) + pivot.x,
                y: ((p1.y - pivot.y) * xyScale.y) + pivot.y
            };
            var scaled_p2 = {
                x: ((p2.x - pivot.x) * xyScale.x) + pivot.x,
                y: ((p2.y - pivot.y) * xyScale.y) + pivot.y
            };
            return {
                x: scaled_p1.x,
                y: scaled_p1.y,
                width: scaled_p2.x - scaled_p1.x,
                height: scaled_p2.y - scaled_p1.y
            };
        };
        return XYUtil;
    }());
    exports.XYUtil = XYUtil;
});
//# sourceMappingURL=Coordinates.js.map