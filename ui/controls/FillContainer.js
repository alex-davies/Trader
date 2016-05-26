var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "pixi.js", "./RenderRectContainer"], function (require, exports, PIXI, RenderRectContainer_1) {
    "use strict";
    var FillContainer = (function (_super) {
        __extends(FillContainer, _super);
        function FillContainer(alignment) {
            var _this = this;
            if (alignment === void 0) { alignment = { horizontal: "middle", vertical: "middle" }; }
            _super.call(this);
            this.alignment = alignment;
            alignment.horizontal = alignment.horizontal || "middle";
            alignment.vertical = alignment.vertical || "middle";
            this.graphcis = this.addChild(new PIXI.Graphics());
            var oldChildrenChange = this.onChildrenChange;
            this.onChildrenChange = function () {
                oldChildrenChange();
                _this.relayout();
            };
        }
        FillContainer.prototype.setRenderRect = function (rect) {
            _super.prototype.setRenderRect.call(this, rect);
            this.relayout();
        };
        FillContainer.prototype.relayout = function () {
            if (this.renderRect == null)
                return;
            var childrenBounds = _super.prototype.getBounds.call(this);
            if (this.alignment.horizontal === "left") {
                this.pivot.x = 0;
            }
            else if (this.alignment.horizontal === "middle") {
                this.pivot.x = -Math.floor((this.renderRect.width - childrenBounds.width) / 2);
            }
            else if (this.alignment.horizontal === "right") {
                this.pivot.x = this.renderRect.x + this.renderRect.width - childrenBounds.width;
            }
            if (this.alignment.vertical === "left") {
                this.pivot.y = 0;
            }
            else if (this.alignment.vertical === "middle") {
                this.pivot.y = -Math.floor((this.renderRect.height - childrenBounds.height) / 2);
            }
            else if (this.alignment.vertical === "right") {
                this.pivot.y = this.renderRect.y + this.renderRect.height - childrenBounds.height;
            }
            //this.graphcis.clear();
            //this.graphcis.lineStyle(2, 0x00FF00, 1);
            //var bounds = this.getLocalBounds();
            //this.graphcis.drawRect(-20,-20,bounds.width,bounds.height);
        };
        FillContainer.prototype.getBounds = function () {
            if (this.renderRect == null)
                return _super.prototype.getBounds.call(this);
            //we fill up everything
            return new PIXI.Rectangle(this.renderRect.x + this.pivot.x, this.renderRect.y + this.pivot.y, this.renderRect.width, this.renderRect.height);
        };
        return FillContainer;
    }(RenderRectContainer_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = FillContainer;
});
// export default class FillContainer extends PIXI.Container {
//
//     content:PIXI.Container;
//     graphcis:PIXI.Graphics;
//     renderRect:{x:number,y:number,width:number,height: number};
//
//     constructor(){
//         super();
//         this.content = super.addChild(new PIXI.Container());
// this.graphcis = super.addChild(new PIXI.Graphics());
//         this.renderRect = {x:0,y:0,width:this.content.width,height:this.content.height};
//     }
//
//     public setRenderRect(rect:{x:number, y:number, width:number, height:number}){
//         this.renderRect = rect;
//
//
//         this.children.forEach(child=>{
//             Util.TrySetRenderRect(child, rect);
//         });
//         this.relayout();
//
//
//     }
//
//     relayout(){
//         this.content.x = Math.floor((this.renderRect.width - this.content.width) / 2);
//         this.content.y = Math.floor((this.renderRect.height - this.content.height) / 2);
//
//         this.graphcis.clear();
//         this.graphcis.lineStyle(2, 0x00FF00, 1);
//         var bounds = this.getLocalBounds();
//         this.graphcis.drawRect(bounds.x,bounds.y,bounds.width,bounds.height);
//     }
//
//     getLocalBounds(){
//         //we fill up everything
//         return new PIXI.Rectangle(this.renderRect.x, this.renderRect.y, Math.max(this.content.width, this.renderRect.width), Math.max(this.content.height, this.renderRect.height));
//     }
//
//     get contentChildren(){
//         //the children array is the only thing I cant forward requests as PIXI uses it internally
//         //so when dealing with a NinePatch you should not access children array, instad access
//         //the contentChildren array
//         return this.content.children;
//     }
//     set contentChildren(children:PIXI.DisplayObject[]){
//         this.content.children = children;
//     }
//
//     addChild<T extends PIXI.DisplayObject>(child:T):T{
//         return this.content.addChild.apply(this.content, arguments);
//     }
//     addChildAt<T extends PIXI.DisplayObject>(child: T, index: number): T{
//         return this.content.addChildAt.apply(this.content, arguments);
//     }
//     swapChildren(child: PIXI.DisplayObject, child2: PIXI.DisplayObject): void{
//         return this.content.swapChildren.apply(this.content, arguments);
//     }
//     getChildIndex(child: PIXI.DisplayObject): number{
//         return this.content.getChildIndex.apply(this.content, arguments);
//     }
//     setChildIndex(child: PIXI.DisplayObject, index: number): void{
//         return this.content.setChildIndex.apply(this.content, arguments);
//     }
//     getChildAt(index: number): PIXI.DisplayObject{
//         return this.content.getChildAt.apply(this.content, arguments);
//     }
//     removeChild<T extends PIXI.DisplayObject>(child: T): T{
//         return this.content.removeChild.apply(this.content, arguments);
//     }
//     removeChildAt(index: number): PIXI.DisplayObject{
//         return this.content.removeChildAt.apply(this.content, arguments);
//     }
//     removeChildren(beginIndex?: number, endIndex?: number): PIXI.DisplayObject[]{
//         return this.content.removeChildren.apply(this.content, arguments);
//     }
// } 
//# sourceMappingURL=FillContainer.js.map