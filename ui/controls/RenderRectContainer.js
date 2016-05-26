var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "pixi.js", "../../util/Util"], function (require, exports, PIXI, Util_1) {
    "use strict";
    var RenderRectContainer = (function (_super) {
        __extends(RenderRectContainer, _super);
        function RenderRectContainer() {
            _super.call(this);
            this._childRenderRectTransform = function (rect) { return rect; };
        }
        Object.defineProperty(RenderRectContainer.prototype, "childRenderRectTransform", {
            get: function () {
                return this._childRenderRectTransform;
            },
            set: function (value) {
                this._childRenderRectTransform = value;
                this.setChildrenRenderRect();
            },
            enumerable: true,
            configurable: true
        });
        RenderRectContainer.prototype.setRenderRect = function (rect) {
            this.renderRect = rect;
            this.setChildrenRenderRect();
        };
        RenderRectContainer.prototype.setChildRenderRect = function (child) {
            if (this.renderRect == null || this.childRenderRectTransform == null)
                return;
            var childRenderRect = this.childRenderRectTransform(this.renderRect);
            Util_1.default.TrySetRenderRect(child, childRenderRect);
        };
        RenderRectContainer.prototype.setChildrenRenderRect = function () {
            if (this.renderRect == null || this.childRenderRectTransform == null)
                return;
            var childRenderRect = this.childRenderRectTransform(this.renderRect);
            this.children.forEach(function (child) { return Util_1.default.TrySetRenderRect(child, childRenderRect); });
        };
        RenderRectContainer.prototype.withChild = function (child) {
            var result = this.addChild.apply(this, arguments);
            return this;
        };
        RenderRectContainer.prototype.addChild = function (child) {
            var result = _super.prototype.addChild.apply(this, arguments);
            this.setChildRenderRect(child);
            return result;
        };
        RenderRectContainer.prototype.addChildAt = function (child, index) {
            var result = _super.prototype.addChildAt.apply(this, arguments);
            this.setChildRenderRect(child);
            return result;
        };
        RenderRectContainer.prototype.swapChildren = function (child, child2) {
            var result = _super.prototype.swapChildren.apply(this, arguments);
            return result;
        };
        RenderRectContainer.prototype.getChildIndex = function (child) {
            var result = _super.prototype.getChildIndex.apply(this, arguments);
            return result;
        };
        RenderRectContainer.prototype.setChildIndex = function (child, index) {
            var result = _super.prototype.setChildIndex.apply(this, arguments);
            return result;
        };
        RenderRectContainer.prototype.getChildAt = function (index) {
            var result = _super.prototype.getChildAt.apply(this, arguments);
            return result;
        };
        RenderRectContainer.prototype.removeChild = function (child) {
            var result = _super.prototype.removeChild.apply(this, arguments);
            return result;
        };
        RenderRectContainer.prototype.removeChildAt = function (index) {
            var result = _super.prototype.removeChildAt.apply(this, arguments);
            return result;
        };
        RenderRectContainer.prototype.removeChildren = function (beginIndex, endIndex) {
            var result = _super.prototype.removeChildren.apply(this, arguments);
            return result;
        };
        return RenderRectContainer;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = RenderRectContainer;
});
//# sourceMappingURL=RenderRectContainer.js.map