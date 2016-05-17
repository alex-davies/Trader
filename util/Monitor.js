var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    var Monitor = (function () {
        function Monitor(predicate, action) {
            var _this = this;
            this.predicate = predicate;
            this.action = action;
            this.tick = (function () {
                if (predicate.call(_this))
                    action.call(_this);
            }).bind(this);
            this.start();
        }
        Monitor.prototype.start = function () {
            PIXI.ticker.shared.add(this.tick, this);
        };
        Monitor.prototype.stop = function () {
            PIXI.ticker.shared.remove(this.tick, this);
        };
        return Monitor;
    }());
    exports.Monitor = Monitor;
    var ChangeMonitor = (function (_super) {
        __extends(ChangeMonitor, _super);
        function ChangeMonitor(propertySelector, action) {
            var _this = this;
            _super.call(this, function () {
                return propertySelector() === _this.lastValue;
            }, function () {
                _this.lastValue = propertySelector();
                action();
            });
            this.propertySelector = propertySelector;
            this.action = action;
        }
        return ChangeMonitor;
    }(Monitor));
    exports.ChangeMonitor = ChangeMonitor;
});
//# sourceMappingURL=Monitor.js.map