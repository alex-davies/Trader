define(["require", "exports"], function (require, exports) {
    "use strict";
    var MercatorProjection = (function () {
        function MercatorProjection(latlngWindow, xyWindow) {
            this.latlngWindow = latlngWindow;
            this.xyWindow = xyWindow;
        }
        MercatorProjection.prototype.toXY = function (latlng) {
            var rlat = this.toRadians(latlng.lat);
            var rlng = this.toRadians(latlng.lng);
            var mercN = Math.log(Math.tan((Math.PI / 4) + (rlat / 2)));
            return this.scale({
                x: (latlng.lng + 180) / 360,
                y: 0.5 - (mercN / (2 * Math.PI))
            });
        };
        MercatorProjection.prototype.toLatLng = function (xy) {
            var width = this.xyWindow.bottomRight.x - this.xyWindow.topLeft.x;
            var height = this.xyWindow.bottomRight.y - this.xyWindow.topLeft.y;
            var normalizeXY = {
                x: ((xy.x - this.xyWindow.topLeft.x) % width) / width,
                y: ((xy.y - this.xyWindow.topLeft.y) % height) / height
            };
            var mercN = Math.log(Math.tan((Math.PI / 4) + (rlat / 2)));
            var rlat = 2 * (Math.atan(Math.exp((0.5 - normalizeXY.y) * (2 * Math.PI))) - (Math.PI / 4));
            return {
                lng: normalizeXY.x * 360 - 180,
                lat: this.toDegrees(rlat)
            };
        };
        MercatorProjection.prototype.scale = function (pos) {
            var width = this.xyWindow.bottomRight.x - this.xyWindow.topLeft.x;
            var height = this.xyWindow.bottomRight.y - this.xyWindow.topLeft.y;
            return {
                x: this.xyWindow.topLeft.x + (width * pos.x),
                y: this.xyWindow.topLeft.y + (height * pos.y)
            };
        };
        MercatorProjection.prototype.toRadians = function (degree) {
            return degree * Math.PI / 180;
        };
        MercatorProjection.prototype.toDegrees = function (radians) {
            return radians * 180 / Math.PI;
        };
        MercatorProjection.RadiusOfEarth = 1; //6371 * 1000;
        return MercatorProjection;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MercatorProjection;
});
//# sourceMappingURL=MercatorProjection.js.map