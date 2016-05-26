import * as PIXI from 'pixi.js'
import Util from "../../util/Util";
import DisplayObject = PIXI.DisplayObject;
import Graphics = PIXI.Graphics;
import DebugDraw from "./DebugDraw"

interface CellSize{
    flexible?:boolean
    pixels?:number;
    weight?:number;

    z?:number;
    order?:number;
}

interface CellSizeHolder{
    _cellSize:CellSize;
}

export default class StackContainer extends PIXI.Container{
    private primaryDimension = this.orientation === "horizontal" ? "width" : "height";
    private primaryAxis = this.orientation === "horizontal" ? "x" : "y";
    private renderRect:{x:number, y:number, width:number, height:number};
    private nextCellOrder = 1;
    private relayoutTimeout;

    constructor(public orientation:"horizontal"|"vertical",
                public spacing=0){
        super();
        // this.renderRect = {x:0,y:0,width:this.width,height:this.height}
        this.onChildrenChange = ()=>{

            //sort the children so the z layer is followed
            this.children.sort((c1, c2)=>(this.getChildCellSize(c1).z || 0) - (this.getChildCellSize(c2).z || 0));
        }
    }

    private isPixelSize(size:CellSize):boolean{
        return !!size.pixels
    }

    private isWeightSize(size:CellSize):boolean{
        return !!size.weight
    }

    private isFlexibleSize(size:CellSize):boolean{
        return size.flexible
    }

    private getChildCellSize(child:PIXI.DisplayObject){
        let size = (<CellSizeHolder & PIXI.DisplayObject>child)._cellSize;
        size= size || {flexible:true};
        return size;
    }

    private setChildCellSize(child:PIXI.DisplayObject, cellSize:CellSize){
        (<CellSizeHolder & PIXI.DisplayObject>child)._cellSize = cellSize;
    }

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

    relayout(){
        if(this.renderRect == null)
            return;

        let childrenInCellOrder = this.children.slice().sort((c1,c2)=>{
            return (this.getChildCellSize(c1).order || this.nextCellOrder) - (this.getChildCellSize(c2).order || this.nextCellOrder)
        });


        //we will run through all the children and gather some data about the sizing
        let totalFixedSize = 0;
        let totalWeight = 0;
        childrenInCellOrder.forEach(child=>{
            let cellSize = this.getChildCellSize(child);
            if(this.isPixelSize(cellSize)){
                totalFixedSize += cellSize.pixels;
            }
            else if(this.isFlexibleSize(cellSize)){
                //for flex size we will run set render rect first then get the size. the child
                //can take all the size if he wants to
                var childRenderRect = {x:0,y:0,width:this.renderRect.width, height:this.renderRect.height};
                childRenderRect[this.primaryDimension] = Math.max(0,childRenderRect[this.primaryDimension] - totalFixedSize);
                Util.TrySetRenderRect(child, childRenderRect);

                totalFixedSize += child[this.primaryDimension];
            }
            else if(this.isWeightSize(cellSize)){
                totalWeight += cellSize.weight;
            }
        });

        //now we will do the real run through setting everyones x/y and sizes
        //we will also set render rects for the other non flexi cells
        let runningOffset = 0
        childrenInCellOrder.forEach(child=> {
            let cellSize = this.getChildCellSize(child);
            child[this.primaryAxis] = runningOffset;

            if(this.isPixelSize(cellSize)){
                var actualSize = Math.max(0, Math.min(cellSize.pixels, this.renderRect[this.primaryDimension] - runningOffset));
                var childRenderRect = {x:0,y:0,width:this.renderRect.width, height:this.renderRect.height};
                childRenderRect[this.primaryDimension] = actualSize;
                Util.TrySetRenderRect(child, childRenderRect);
                runningOffset += actualSize;
            }
            else if(this.isFlexibleSize(cellSize)){
                runningOffset += child[this.primaryDimension];
            }
            else if(this.isWeightSize(cellSize)){
                let totalWeightSize = Math.max(0,this.renderRect[this.primaryDimension] - totalFixedSize);

                let actualSize = Math.round(cellSize.weight / totalWeight * totalWeightSize);
                var childRenderRect = {x:0,y:0,width:this.renderRect.width, height:this.renderRect.height};
                childRenderRect[this.primaryDimension] = actualSize;
                Util.TrySetRenderRect(child, childRenderRect);

                runningOffset += actualSize;
            }
        });
    }


    public setRenderRect(rect:{x:number, y:number, width:number, height:number}){
        this.renderRect = rect;
        this.relayout();
    }




    cells(children:Array<[CellSize,PIXI.DisplayObject]>){
        children.forEach(child=>{
            this.addChildWithoutRelayout(child[1],child[0]);
        });
        this.relayout();
        return this;
    }

    cell(size:CellSize, child:PIXI.DisplayObject) : this{
        this.addChild(child, size);
        return this;
    }

    private addChildWithoutRelayout<T extends PIXI.DisplayObject>(child:T, size?:CellSize): T{
        size = size || {flexible:true};
        size.order = size.order || this.nextCellOrder;
        this.nextCellOrder = size.order+1;

        this.setChildCellSize(child,size);
        let returnValue = super.addChild(child);
        return returnValue;
    }

    addChild<T extends PIXI.DisplayObject>(child:T, size:CellSize = {flexible:true}): T{
        let returnValue = this.addChildWithoutRelayout(child,size);
        this.relayout();
        return returnValue;
    }

    addChildAt<T extends PIXI.DisplayObject>(child: T, index: number): T{
        let result = super.addChildAt.apply(this, arguments);
        this.relayout();
        return result;
    }
    swapChildren(child: PIXI.DisplayObject, child2: PIXI.DisplayObject): void{
        let result = super.swapChildren.apply(this, arguments);
        this.relayout();
        return result;
    }
    getChildIndex(child: PIXI.DisplayObject): number{
        let result = super.getChildIndex.apply(this, arguments);
        this.relayout();
        return result;
    }
    setChildIndex(child: PIXI.DisplayObject, index: number): void{
        let result = super.setChildIndex.apply(this, arguments);
        this.relayout();
        return result;
    }
    getChildAt(index: number): PIXI.DisplayObject{
        let result = super.getChildAt.apply(this, arguments);
        this.relayout();
        return result;
    }
    removeChild<T extends PIXI.DisplayObject>(child: T): T{
        let result = super.removeChild.apply(this, arguments);
        this.relayout();
        return result;
    }
    removeChildAt(index: number): PIXI.DisplayObject{
        let result = super.removeChildAt.apply(this, arguments);
        this.relayout();
        return result;
    }
    removeChildren(beginIndex?: number, endIndex?: number): PIXI.DisplayObject[]{
        let result = super.removeChildren.apply(this, arguments);
        this.relayout();
        return result;
    }


}


export class VContainer extends StackContainer{
    constructor(spacing = 0){
        super("vertical", spacing);
    }
}

export class HContainer extends StackContainer{
    constructor(spacing = 0){
        super("horizontal", spacing);
    }
}

export class Spacer extends DisplayObject{
    constructor(public width=0, public height=0){
        super();
        //dont try and render this
        this.visible=false;
        this.renderable = false;
    }
    getLocalBounds(){
        return new PIXI.Rectangle(0,0,this.width, this.height)
    }
}


