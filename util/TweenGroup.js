define(["require", "exports", "tween.js"], function (require, exports, TWEEN) {
    "use strict";
    var TweenGroup = (function () {
        function TweenGroup() {
            this._tweens = [];
        }
        TweenGroup.prototype.getAll = function () {
            return this._tweens;
        };
        TweenGroup.prototype.removeAll = function () {
            this._tweens = [];
        };
        TweenGroup.prototype.add = function (tween) {
            //remove it from the global group
            TWEEN.remove(tween);
            this._tweens.push(tween);
            return tween;
        };
        TweenGroup.prototype.remove = function (tween) {
            var i = this._tweens.indexOf(tween);
            if (i !== -1) {
                this._tweens.splice(i, 1);
            }
        };
        TweenGroup.prototype.update = function (time) {
            if (this._tweens.length === 0) {
                return false;
            }
            var i = 0;
            time = time !== undefined ? time : window.performance.now();
            while (i < this._tweens.length) {
                if (this._tweens[i].update(time)) {
                    i++;
                }
                else {
                    this._tweens.splice(i, 1);
                }
            }
            return true;
        };
        return TweenGroup;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TweenGroup;
});
//# sourceMappingURL=TweenGroup.js.map