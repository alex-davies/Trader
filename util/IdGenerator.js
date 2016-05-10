define(["require", "exports"], function (require, exports) {
    "use strict";
    var IdGenerator = (function () {
        function IdGenerator() {
            this.countTracker = {};
        }
        IdGenerator.prototype.getNext = function (prefix) {
            var count = this.countTracker[prefix];
            if (!count) {
                count = 1;
            }
            this.countTracker[prefix] = count + 1;
            return prefix + "-" + this.zeroPad(count, 3);
        };
        IdGenerator.prototype.zeroPad = function (num, places) {
            var zero = places - num.toString().length + 1;
            return Array(+(zero > 0 && zero)).join("0") + num;
        };
        return IdGenerator;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = IdGenerator;
});
//# sourceMappingURL=IdGenerator.js.map