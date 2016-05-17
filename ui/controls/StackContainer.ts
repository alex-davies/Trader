import * as PIXI from 'pixi.js'
import Util from "../../util/Util";
import DisplayObject = PIXI.DisplayObject;

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


    constructor(public orientation:"horizontal"|"vertical",
                public spacing=0){
        super();

        this.onChildrenChange = ()=>{

            //sort the children so the z layer is followed
            this.children.sort((c1, c2)=>(this.getChildCellSize(c1).z || 0) - (this.getChildCellSize(c2).z || 0));


            //little bit hacky, but we wont bother updating layout unless we know our size
            if(this.renderRect) {
                this.relayout();
            }
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

    private getChildSizeInPixels(child:PIXI.DisplayObject){
        let size = this.getChildCellSize(child);

        if(this.isPixelSize(size)){
            return size.pixels
        }

        if(this.isWeightSize(size)){
            var pixelsUsed = 0;
            var totalWeight = 0;
            this.children.forEach(child=>{
                let size = this.getChildCellSize(child);
                if(this.isWeightSize(size)) {
                   totalWeight += size.weight
                }
                else{
                    pixelsUsed += this.getChildSizeInPixels(child);
                }
            });

            pixelsUsed += (this.children.length-1) * this.spacing;

            let totalWeightWidth = this.renderRect[this.primaryDimension] - pixelsUsed;

            return totalWeightWidth * size.weight / totalWeight;
        }

        if(this.isFlexibleSize(size)){
            return (<any>child).width || 0;
        }

        return 0;
    }

    addChild(child:PIXI.DisplayObject, size:CellSize = {flexible:true}): PIXI.DisplayObject{
        size.order = size.order || this.nextCellOrder;
        this.nextCellOrder = size.order+1;

        this.setChildCellSize(child,size);
        let returnValue = super.addChild(child);

        return returnValue;
    }


    relayout(){

        let runningOffset = 0;
        let childrenInCellOrder = this.children.slice().sort((c1,c2)=>{
            return (this.getChildCellSize(c1).order || this.nextCellOrder) - (this.getChildCellSize(c2).order || this.nextCellOrder)
        });

        childrenInCellOrder.forEach(child=>{
            let sizeInPixels = this.getChildSizeInPixels(child);

            //set the X or Y to be the offset
            child[this.primaryAxis] = runningOffset;

            //let the child know of its space that it should use for rendering
            var childRenderRect = {x:0,y:0,width:this.renderRect.width, height:this.renderRect.height};
            childRenderRect[this.primaryDimension] = sizeInPixels;
            Util.TrySetRenderRect(child, childRenderRect);

            runningOffset += sizeInPixels + this.spacing;
        });
    }



    public setRenderRect(rect:{x:number, y:number, width:number, height:number}){
        this.renderRect = rect;
        this.relayout();
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


