import * as PIXI from 'pixi.js'
import Util from "../../util/Util";
import DisplayObject = PIXI.DisplayObject;
import Graphics = PIXI.Graphics;
import DebugDraw from "./DebugDraw"
import UIContainer from "./UIContainer";

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

export default class StackContainer extends UIContainer{
    private get primaryDimension(){
        return this.orientation === "horizontal" ? "width" : "height";
    }
    private get secondaryDimension(){
        return this.orientation === "horizontal" ? "height" : "width";
    }

    private get primaryAxis(){
        return this.orientation === "horizontal" ? "x" : "y";
    }

    private get secondaryAxis(){
        return this.orientation === "horizontal" ? "y" : "x";
    }


    private nextCellOrder = 1;


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


    relayout(){
        let childrenInCellOrder = this.children.slice().sort((c1,c2)=>{
            return (this.getChildCellSize(c1).order || this.nextCellOrder) - (this.getChildCellSize(c2).order || this.nextCellOrder)
        });


        //we will run through all the children and gather some data about the sizing
        let totalPixelSize = 0;
        let totalFlexSize = 0;
        let totalWeight = 0;
        childrenInCellOrder.forEach(child=>{
            let cellSize = this.getChildCellSize(child);
            if(this.isPixelSize(cellSize)){
                totalPixelSize += cellSize.pixels;
            }
            else if(this.isFlexibleSize(cellSize)){
                totalFlexSize += child[this.primaryDimension];
            }
            else if(this.isWeightSize(cellSize)){
                totalWeight += cellSize.weight;
            }
        });

        //now we will do the real run through setting everyones x/y and sizes
        let runningOffset = 0
        childrenInCellOrder.forEach(child=> {
            let cellSize = this.getChildCellSize(child);
            child[this.primaryAxis] = runningOffset;

            if(this.isPixelSize(cellSize)){
                var actualSize = Math.max(0, Math.min(cellSize.pixels, this[this.primaryDimension] - runningOffset));
                child[this.primaryDimension] = actualSize;
                child[this.secondaryDimension] = this[this.secondaryDimension];
                runningOffset += actualSize;
            }
            else if(this.isFlexibleSize(cellSize)){
                child[this.secondaryDimension] = this[this.secondaryDimension];
                runningOffset += child[this.primaryDimension];
            }
            else if(this.isWeightSize(cellSize)){
                let totalWeightSize = Math.max(0,this[this.primaryDimension] - totalPixelSize - totalFlexSize);

                let actualSize = Math.round(cellSize.weight / totalWeight * totalWeightSize);
                child[this.primaryDimension] = actualSize;
                child[this.secondaryDimension] = this[this.secondaryDimension];
                runningOffset += actualSize;
            }
            runningOffset += this.spacing;
        });
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

    addChildWithoutRelayout<T extends PIXI.DisplayObject>(child:T, size?:CellSize): T{
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


