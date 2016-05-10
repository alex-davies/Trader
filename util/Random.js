define(["require", "exports"], function (require, exports) {
    "use strict";
    var Random = (function () {
        function Random(seed) {
            this.stringHashCode = function (str) {
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
            if (seed === undefined) {
                this.seed = Math.floor(Math.random() * 233280);
            }
            else if (typeof seed === "number") {
                this.seed = seed;
            }
            else {
                this.seed = this.stringHashCode(seed);
            }
        }
        Random.prototype.next = function (min, max) {
            max = max || 0;
            min = min || 0;
            this.seed = (this.seed * 9301 + 49297) % 233280;
            var rnd = this.seed / 233280;
            return min + rnd * (max - min);
        };
        Random.prototype.nextInt = function (min, max) {
            return Math.floor(this.next(min, max + 1));
        };
        Random.prototype.nextDouble = function () {
            return this.next(0, 1);
        };
        Random.prototype.pick = function (collection, numberToPick) {
            return collection[this.nextInt(0, collection.length - 1)];
        };
        Random.prototype.pickMany = function (collection, numberToPick) {
            var possiblePicks = collection.slice(0);
            var picks = [];
            while (possiblePicks.length > 0 && picks.length < numberToPick) {
                var pick = possiblePicks.splice(this.next(0, possiblePicks.length - 1), 1)[0];
                picks.push(pick);
            }
            return picks;
        };
        return Random;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Random;
});
//# sourceMappingURL=Random.js.map