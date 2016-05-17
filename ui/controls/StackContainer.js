var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "../../util/Util"], function (require, exports, PIXI, Util_1) {
    "use strict";
    var StackContainer = (function (_super) {
        __extends(StackContainer, _super);
        function StackContainer(orientation, spacing) {
            var _this = this;
            if (spacing === void 0) { spacing = 0; }
            _super.call(this);
            this.orientation = orientation;
            this.spacing = spacing;
            this.primaryDimension = this.orientation === "horizontal" ? "width" : "height";
            this.primaryAxis = this.orientation === "horizontal" ? "x" : "y";
            this.nextCellOrder = 1;
            this.onChildrenChange = function () {
                //sort the children so the z layer is followed
                _this.children.sort(function (c1, c2) { return (_this.getChildCellSize(c1).z || 0) - (_this.getChildCellSize(c2).z || 0); });
                //little bit hacky, but we wont bother updating layout unless we know our size
                if (_this.renderRect) {
                    _this.relayout();
                }
            };
        }
        StackContainer.prototype.isPixelSize = function (size) {
            return !!size.pixels;
        };
        StackContainer.prototype.isWeightSize = function (size) {
            return !!size.weight;
        };
        StackContainer.prototype.isFlexibleSize = function (size) {
            return size.flexible;
        };
        StackContainer.prototype.getChildCellSize = function (child) {
            var size = child._cellSize;
            size = size || { flexible: true };
            return size;
        };
        StackContainer.prototype.setChildCellSize = function (child, cellSize) {
            child._cellSize = cellSize;
        };
        StackContainer.prototype.getChildSizeInPixels = function (child) {
            var _this = this;
            var size = this.getChildCellSize(child);
            if (this.isPixelSize(size)) {
                return size.pixels;
            }
            if (this.isWeightSize(size)) {
                var pixelsUsed = 0;
                var totalWeight = 0;
                this.children.forEach(function (child) {
                    var size = _this.getChildCellSize(child);
                    if (_this.isWeightSize(size)) {
                        totalWeight += size.weight;
                    }
                    else {
                        pixelsUsed += _this.getChildSizeInPixels(child);
                    }
                });
                pixelsUsed += (this.children.length - 1) * this.spacing;
                var totalWeightWidth = this.renderRect[this.primaryDimension] - pixelsUsed;
                return totalWeightWidth * size.weight / totalWeight;
            }
            if (this.isFlexibleSize(size)) {
                return child.width || 0;
            }
            return 0;
        };
        StackContainer.prototype.addChild = function (child, size) {
            if (size === void 0) { size = { flexible: true }; }
            size.order = size.order || this.nextCellOrder;
            this.nextCellOrder = size.order + 1;
            this.setChildCellSize(child, size);
            var returnValue = _super.prototype.addChild.call(this, child);
            return returnValue;
        };
        StackContainer.prototype.relayout = function () {
            var _this = this;
            var runningOffset = 0;
            var childrenInCellOrder = this.children.slice().sort(function (c1, c2) {
                return (_this.getChildCellSize(c1).order || _this.nextCellOrder) - (_this.getChildCellSize(c2).order || _this.nextCellOrder);
            });
            childrenInCellOrder.forEach(function (child) {
                var sizeInPixels = _this.getChildSizeInPixels(child);
                //set the X or Y to be the offset
                child[_this.primaryAxis] = runningOffset;
                //let the child know of its space that it should use for rendering
                var childRenderRect = { x: 0, y: 0, width: _this.renderRect.width, height: _this.renderRect.height };
                childRenderRect[_this.primaryDimension] = sizeInPixels;
                Util_1.default.TrySetRenderRect(child, childRenderRect);
                runningOffset += sizeInPixels + _this.spacing;
            });
        };
        StackContainer.prototype.setRenderRect = function (rect) {
            this.renderRect = rect;
            this.relayout();
        };
        return StackContainer;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StackContainer;
    var VContainer = (function (_super) {
        __extends(VContainer, _super);
        function VContainer(spacing) {
            if (spacing === void 0) { spacing = 0; }
            _super.call(this, "vertical", spacing);
        }
        return VContainer;
    }(StackContainer));
    exports.VContainer = VContainer;
    var HContainer = (function (_super) {
        __extends(HContainer, _super);
        function HContainer(spacing) {
            if (spacing === void 0) { spacing = 0; }
            _super.call(this, "horizontal", spacing);
        }
        return HContainer;
    }(StackContainer));
    exports.HContainer = HContainer;
});
//# sourceMappingURL=StackContainer.js.map