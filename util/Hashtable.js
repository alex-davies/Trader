define(["require", "exports"], function (require, exports) {
    "use strict";
    var Hashtable = (function () {
        function Hashtable(computeHashCode) {
            if (computeHashCode === void 0) { computeHashCode = function (key) { return key.toString(); }; }
            this.data = {};
            this.computeHashCode = computeHashCode;
        }
        Hashtable.prototype.get = function (key) {
            var hash = this.computeHashCode(key);
            return this.data[hash];
        };
        Hashtable.prototype.put = function (key, value) {
            var hash = this.computeHashCode(key);
            this.data[hash] = value;
        };
        Hashtable.prototype.entries = function () {
            var returnResult = [];
            for (var property in this.data) {
                if (this.data.hasOwnProperty(property)) {
                    returnResult.push({ key: property, value: this.data[property] });
                }
            }
            return returnResult;
        };
        return Hashtable;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Hashtable;
});
//# sourceMappingURL=Hashtable.js.map