var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    var UIContainer = (function (_super) {
        __extends(UIContainer, _super);
        function UIContainer() {
            _super.call(this);
            //
            // let oldChildrenChange = this.onChildrenChange;
            // this.onChildrenChange = ()=>{
            //     oldChildrenChange();
            //     this.relayout();
            // }
            //DebugDraw.DrawBounds(this);
        }
        Object.defineProperty(UIContainer.prototype, "width", {
            get: function () {
                return this.getBounds().width;
            },
            set: function (value) {
                if (value !== this._width) {
                    this._width = value;
                    this.relayout();
                }
            },
            enumerable: true,
            configurable: true
        });
        Object.defineProperty(UIContainer.prototype, "height", {
            get: function () {
                return this.getBounds().height;
            },
            set: function (value) {
                if (value !== this._height) {
                    this._height = value;
                    this.relayout();
                }
            },
            enumerable: true,
            configurable: true
        });
        UIContainer.prototype.relayout = function () {
        };
        UIContainer.prototype.getBounds = function () {
            var bounds = _super.prototype.getBounds.call(this).clone();
            bounds.x = this.pivot.x;
            bounds.y = this.pivot.y;
            if (this._width != null) {
                bounds.width = this._width;
            }
            if (this._height != null) {
                bounds.height = this._height;
            }
            return bounds;
        };
        UIContainer.prototype.getChildrenBounds = function () {
            //little hack, getLocalBounds updates all the transforms on the children,
            //then calls getBounds. Issue is we have overridden get bound so it calls the
            //wrong get bounds. Our solution is to call the super class twice, super.getLocalBounds to
            //update the transforms and super.getBounds to get the childrens bounds.
            var ignore = _super.prototype.getLocalBounds.call(this);
            return _super.prototype.getBounds.call(this);
        };
        UIContainer.prototype.withChild = function (child) {
            this.addChild(child);
            return this;
        };
        UIContainer.prototype.addChildWithoutRelayout = function (child) {
            var result = _super.prototype.addChild.apply(this, arguments);
            return result;
        };
        UIContainer.prototype.addChild = function (child) {
            var result = _super.prototype.addChild.apply(this, arguments);
            this.relayout();
            return result;
        };
        UIContainer.prototype.addChildAt = function (child, index) {
            var result = _super.prototype.addChildAt.apply(this, arguments);
            this.relayout();
            return result;
        };
        UIContainer.prototype.swapChildren = function (child, child2) {
            var result = _super.prototype.swapChildren.apply(this, arguments);
            this.relayout();
            return result;
        };
        UIContainer.prototype.getChildIndex = function (child) {
            var result = _super.prototype.getChildIndex.apply(this, arguments);
            this.relayout();
            return result;
        };
        UIContainer.prototype.setChildIndex = function (child, index) {
            var result = _super.prototype.setChildIndex.apply(this, arguments);
            this.relayout();
            return result;
        };
        UIContainer.prototype.getChildAt = function (index) {
            var result = _super.prototype.getChildAt.apply(this, arguments);
            this.relayout();
            return result;
        };
        UIContainer.prototype.removeChild = function (child) {
            var result = _super.prototype.removeChild.apply(this, arguments);
            this.relayout();
            return result;
        };
        UIContainer.prototype.removeChildAt = function (index) {
            var result = _super.prototype.removeChildAt.apply(this, arguments);
            this.relayout();
            return result;
        };
        UIContainer.prototype.removeChildren = function (beginIndex, endIndex) {
            var result = _super.prototype.removeChildren.apply(this, arguments);
            this.relayout();
            return result;
        };
        return UIContainer;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UIContainer;
});
//# sourceMappingURL=UIContainer.js.map