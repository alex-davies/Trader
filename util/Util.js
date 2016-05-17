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
        Util.EmptyObject = {};
        return Util;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Util;
});
//# sourceMappingURL=Util.js.map