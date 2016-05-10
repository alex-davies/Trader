define(["require", "exports"], function (require, exports) {
    "use strict";
    var Util = (function () {
        function Util() {
        }
        Util.constrain = function (input, min, max) {
            return Math.max(Math.min(input, max), min);
        };
        Util.DegToRad = function (degrees) {
            return degrees / 180 * Math.PI;
        };
        Util.RadToDeg = function (radians) {
            return radians / Math.PI * 180;
        };
        Util.EmptyObject = {};
        return Util;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Util;
});
//# sourceMappingURL=Util.js.map