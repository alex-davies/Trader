var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./UIContainer"], function (require, exports, UIContainer_1) {
    "use strict";
    var PaddedContainer = (function (_super) {
        __extends(PaddedContainer, _super);
        function PaddedContainer(paddingTop, paddingRight, paddingBottom, paddingLeft) {
            if (paddingTop === void 0) { paddingTop = 0; }
            if (paddingRight === void 0) { paddingRight = 0; }
            if (paddingBottom === void 0) { paddingBottom = 0; }
            if (paddingLeft === void 0) { paddingLeft = 0; }
            _super.call(this);
            this.pivot.y = -paddingTop;
            this._paddingRight = paddingRight;
            this._paddingBottom = paddingBottom;
            this.pivot.x = -paddingLeft;
        }
        Object.defineProperty(PaddedContainer.prototype, "paddingTop", {
            get: function () {
                return -this.pivot.y;
            },
            set: function (value) {
                this.pivot.y = -value;
                this.relayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PaddedContainer.prototype, "paddingLeft", {
            get: function () {
                return -this.pivot.x;
            },
            set: function (value) {
                this.pivot.x = -value;
                this.relayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PaddedContainer.prototype, "paddingRight", {
            get: function () {
                return this._paddingRight;
            },
            set: function (value) {
                this._paddingRight = value;
                this.relayout();
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(PaddedContainer.prototype, "paddingBottom", {
            get: function () {
                return this._paddingBottom;
            },
            set: function (value) {
                this._paddingBottom = value;
                this.relayout();
            },
            enumerable: true,
            configurable: true
        });
        PaddedContainer.prototype.relayout = function () {
            var _this = this;
            this.children.forEach(function (child) {
                var anyChild = child;
                if (anyChild.width != null)
                    anyChild.width = _this.width - _this.paddingLeft - _this.paddingRight;
                if (anyChild.height != null)
                    anyChild.height = _this.height - _this.paddingTop - _this.paddingBottom;
            });
        };
        return PaddedContainer;
    }(UIContainer_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PaddedContainer;
});
//# sourceMappingURL=PaddedContainer.js.map