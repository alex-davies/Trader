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
        // static TryResize(target:any, width:number, height:number){
        //     Util.TryCall(target, "resize", width, height);
        // }
        Util.TrySetRenderRect = function (target, rect) {
            Util.TryCall(target, "setRenderRect", rect);
        };
        Util.TryCall = function (target, method) {
            var args = [];
            for (var _i = 2; _i < arguments.length; _i++) {
                args[_i - 2] = arguments[_i];
            }
            if (!target)
                return;
            var fn = target[method];
            if (typeof fn === "function") {
                return fn.apply(target, args);
            }
        };
        Util.FunctionName = function (fn) {
            if (fn.name)
                return fn.name;
            //fallback for older JS which doesnt have a name proeprty
            var funcNameRegex = /function (.{1,})\(/;
            var results = (funcNameRegex).exec(fn.toString());
            if (results && results.length > 1)
                return results[1];
            throw new Error("function does not have a name");
        };
        Util.HashCodeString = function (str) {
            var hash = 0, i, chr, len;
            if (str.length == 0)
                return hash;
            for (i = 0, len = str.length; i < len; i++) {
                chr = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + chr;
                hash |= 0; // Convert to 32bit integer
            }
            return hash;
        };
        ;
        Util.EmptyObject = {};
        return Util;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Util;
});
//# sourceMappingURL=Util.js.map