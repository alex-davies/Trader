var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../util/Util"], function (require, exports, Util_1) {
    "use strict";
    var DebugDraw = (function (_super) {
        __extends(DebugDraw, _super);
        function DebugDraw() {
            _super.call(this);
            this.debugObjects = [];
            this.graphics = this.addChild(new PIXI.Graphics());
            PIXI.ticker.shared.add(this.redraw.bind(this));
        }
        // getLocalBounds(){
        //
        //     return new PIXI.Rectangle(0,0,0,0);
        // }
        DebugDraw.prototype.redraw = function () {
            var _this = this;
            this.graphics.clear();
            this.debugObjects.forEach(function (obj, i) {
                if (!_this.isRelatedToDebugDraw(obj.displayObject)) {
                    _this.debugObjects.slice(i, 1);
                    return;
                }
                var bounds = obj.displayObject.getBounds();
                var p1 = _this.toLocal(new PIXI.Point(bounds.x, bounds.y), obj.displayObject);
                var p2 = _this.toLocal(new PIXI.Point(bounds.x + bounds.width, bounds.y + bounds.height), obj.displayObject);
                _this.graphics.lineStyle(2, obj.color, 1);
                _this.graphics.drawRect(p1.x, p1.y, p2.x - p1.x, p2.y - p1.y);
            });
        };
        DebugDraw.prototype.drawBounds = function (displayObject, color) {
            if (color === void 0) { color = this.defaultColor(displayObject); }
            var debugObj = {
                displayObject: displayObject,
                color: color
            };
            this.debugObjects.push(debugObj);
        };
        DebugDraw.prototype.isRelatedToDebugDraw = function (item) {
            var thisAncestors = DebugDraw.getAncestors(this);
            var itemAncestors = DebugDraw.getAncestors(item);
            for (var i = 0; i < thisAncestors.length; i++) {
                if (itemAncestors.indexOf(thisAncestors[i]) >= 0)
                    return true;
            }
            return false;
        };
        DebugDraw.getAncestors = function (item) {
            var ancestors = [];
            var currentItem = item;
            while (currentItem = currentItem.parent) {
                ancestors.push(currentItem);
            }
            return ancestors;
        };
        DebugDraw.DrawBounds = function (displayObject, color) {
            DebugDraw.Global.drawBounds(displayObject, color);
        };
        DebugDraw.prototype.defaultColor = function (obj) {
            var constructorName = Util_1.default.FunctionName(obj.constructor) || "";
            var hashedName = Util_1.default.HashCodeString(constructorName);
            var color = Math.abs(hashedName % 16777216);
            return color;
        };
        DebugDraw.Global = new DebugDraw();
        return DebugDraw;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DebugDraw;
});
//# sourceMappingURL=DebugDraw.js.map