var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "../../util/Util"], function (require, exports, PIXI, Util_1) {
    "use strict";
    var DisplayObject = PIXI.DisplayObject;
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
            // this.renderRect = {x:0,y:0,width:this.width,height:this.height}
            this.onChildrenChange = function () {
                //sort the children so the z layer is followed
                _this.children.sort(function (c1, c2) { return (_this.getChildCellSize(c1).z || 0) - (_this.getChildCellSize(c2).z || 0); });
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
        // private getChildSizeInPixels(child:PIXI.DisplayObject){
        //     let size = this.getChildCellSize(child);
        //
        //     if(this.isPixelSize(size)){
        //         return size.pixels
        //     }
        //
        //     if(this.isWeightSize(size)){
        //         var pixelsUsed = 0;
        //         var totalWeight = 0;
        //         this.children.forEach(child=>{
        //             let size = this.getChildCellSize(child);
        //             if(this.isWeightSize(size)) {
        //                totalWeight += size.weight
        //             }
        //             else{
        //                 pixelsUsed += this.getChildSizeInPixels(child);
        //             }
        //         });
        //
        //         pixelsUsed += (this.children.length-1) * this.spacing;
        //
        //         let totalWeightWidth = this.renderRect[this.primaryDimension] - pixelsUsed;
        //
        //         return Math.round(totalWeightWidth * size.weight / totalWeight);
        //     }
        //
        //     if(this.isFlexibleSize(size)){
        //         return (<any>child)[this.primaryDimension] || 0;
        //     }
        //
        //     return 0;
        // }
        // relayout(){
        //
        //     clearTimeout((this.relayoutTimeout));
        //     this.relayoutTimeout = null;
        //
        //     let runningOffset = 0;
        //     let childrenInCellOrder = this.children.slice().sort((c1,c2)=>{
        //         return (this.getChildCellSize(c1).order || this.nextCellOrder) - (this.getChildCellSize(c2).order || this.nextCellOrder)
        //     });
        //
        //     childrenInCellOrder.forEach(child=>{
        //         let sizeInPixels = this.getChildSizeInPixels(child);
        //
        //         //set the X or Y to be the offset
        //         child[this.primaryAxis] = runningOffset;
        //
        //         //let the child know of its space that it should use for rendering
        //         var childRenderRect = {x:0,y:0,width:this.renderRect.width, height:this.renderRect.height};
        //         childRenderRect[this.primaryDimension] = sizeInPixels;
        //         Util.TrySetRenderRect(child, childRenderRect);
        //
        //         runningOffset += sizeInPixels + this.spacing;
        //     });
        // }
        StackContainer.prototype.relayout = function () {
            var _this = this;
            if (this.renderRect == null)
                return;
            var childrenInCellOrder = this.children.slice().sort(function (c1, c2) {
                return (_this.getChildCellSize(c1).order || _this.nextCellOrder) - (_this.getChildCellSize(c2).order || _this.nextCellOrder);
            });
            //we will run through all the children and gather some data about the sizing
            var totalFixedSize = 0;
            var totalWeight = 0;
            childrenInCellOrder.forEach(function (child) {
                var cellSize = _this.getChildCellSize(child);
                if (_this.isPixelSize(cellSize)) {
                    totalFixedSize += cellSize.pixels;
                }
                else if (_this.isFlexibleSize(cellSize)) {
                    //for flex size we will run set render rect first then get the size. the child
                    //can take all the size if he wants to
                    var childRenderRect = { x: 0, y: 0, width: _this.renderRect.width, height: _this.renderRect.height };
                    childRenderRect[_this.primaryDimension] = Math.max(0, childRenderRect[_this.primaryDimension] - totalFixedSize);
                    Util_1.default.TrySetRenderRect(child, childRenderRect);
                    totalFixedSize += child[_this.primaryDimension];
                }
                else if (_this.isWeightSize(cellSize)) {
                    totalWeight += cellSize.weight;
                }
            });
            //now we will do the real run through setting everyones x/y and sizes
            //we will also set render rects for the other non flexi cells
            var runningOffset = 0;
            childrenInCellOrder.forEach(function (child) {
                var cellSize = _this.getChildCellSize(child);
                child[_this.primaryAxis] = runningOffset;
                if (_this.isPixelSize(cellSize)) {
                    var actualSize = Math.max(0, Math.min(cellSize.pixels, _this.renderRect[_this.primaryDimension] - runningOffset));
                    var childRenderRect = { x: 0, y: 0, width: _this.renderRect.width, height: _this.renderRect.height };
                    childRenderRect[_this.primaryDimension] = actualSize;
                    Util_1.default.TrySetRenderRect(child, childRenderRect);
                    runningOffset += actualSize;
                }
                else if (_this.isFlexibleSize(cellSize)) {
                    runningOffset += child[_this.primaryDimension];
                }
                else if (_this.isWeightSize(cellSize)) {
                    var totalWeightSize = Math.max(0, _this.renderRect[_this.primaryDimension] - totalFixedSize);
                    var actualSize_1 = Math.round(cellSize.weight / totalWeight * totalWeightSize);
                    var childRenderRect = { x: 0, y: 0, width: _this.renderRect.width, height: _this.renderRect.height };
                    childRenderRect[_this.primaryDimension] = actualSize_1;
                    Util_1.default.TrySetRenderRect(child, childRenderRect);
                    runningOffset += actualSize_1;
                }
            });
        };
        StackContainer.prototype.setRenderRect = function (rect) {
            this.renderRect = rect;
            this.relayout();
        };
        StackContainer.prototype.cells = function (children) {
            var _this = this;
            children.forEach(function (child) {
                _this.addChildWithoutRelayout(child[1], child[0]);
            });
            this.relayout();
            return this;
        };
        StackContainer.prototype.cell = function (size, child) {
            this.addChild(child, size);
            return this;
        };
        StackContainer.prototype.addChildWithoutRelayout = function (child, size) {
            size = size || { flexible: true };
            size.order = size.order || this.nextCellOrder;
            this.nextCellOrder = size.order + 1;
            this.setChildCellSize(child, size);
            var returnValue = _super.prototype.addChild.call(this, child);
            return returnValue;
        };
        StackContainer.prototype.addChild = function (child, size) {
            if (size === void 0) { size = { flexible: true }; }
            var returnValue = this.addChildWithoutRelayout(child, size);
            this.relayout();
            return returnValue;
        };
        StackContainer.prototype.addChildAt = function (child, index) {
            var result = _super.prototype.addChildAt.apply(this, arguments);
            this.relayout();
            return result;
        };
        StackContainer.prototype.swapChildren = function (child, child2) {
            var result = _super.prototype.swapChildren.apply(this, arguments);
            this.relayout();
            return result;
        };
        StackContainer.prototype.getChildIndex = function (child) {
            var result = _super.prototype.getChildIndex.apply(this, arguments);
            this.relayout();
            return result;
        };
        StackContainer.prototype.setChildIndex = function (child, index) {
            var result = _super.prototype.setChildIndex.apply(this, arguments);
            this.relayout();
            return result;
        };
        StackContainer.prototype.getChildAt = function (index) {
            var result = _super.prototype.getChildAt.apply(this, arguments);
            this.relayout();
            return result;
        };
        StackContainer.prototype.removeChild = function (child) {
            var result = _super.prototype.removeChild.apply(this, arguments);
            this.relayout();
            return result;
        };
        StackContainer.prototype.removeChildAt = function (index) {
            var result = _super.prototype.removeChildAt.apply(this, arguments);
            this.relayout();
            return result;
        };
        StackContainer.prototype.removeChildren = function (beginIndex, endIndex) {
            var result = _super.prototype.removeChildren.apply(this, arguments);
            this.relayout();
            return result;
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
    var Spacer = (function (_super) {
        __extends(Spacer, _super);
        function Spacer(width, height) {
            if (width === void 0) { width = 0; }
            if (height === void 0) { height = 0; }
            _super.call(this);
            this.width = width;
            this.height = height;
            //dont try and render this
            this.visible = false;
            this.renderable = false;
        }
        Spacer.prototype.getLocalBounds = function () {
            return new PIXI.Rectangle(0, 0, this.width, this.height);
        };
        return Spacer;
    }(DisplayObject));
    exports.Spacer = Spacer;
});
//# sourceMappingURL=StackContainer.js.map