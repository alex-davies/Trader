import * as PIXI from "pixi.js"
import Util from "../../util/Util";
import DisplayObject = PIXI.DisplayObject;

export default class RenderRectContainer extends PIXI.Container {

    renderRect:{x:number,y:number,width:number,height: number};

    private _childRenderRectTransform:(rect:{x:number, y:number, width:number, height:number})=>{x:number, y:number, width:number, height:number} = rect=>rect;
    set childRenderRectTransform(value:(rect:{x:number, y:number, width:number, height:number})=>{x:number, y:number, width:number, height:number}){
        this._childRenderRectTransform = value;
        this.setChildrenRenderRect();
    }
    get childRenderRectTransform(){
        return this._childRenderRectTransform;
    }

    constructor(){
        super();
    }


    public setRenderRect(rect:{x:number, y:number, width:number, height:number}){
        this.renderRect = rect;
        this.setChildrenRenderRect();
    }

    public setChildRenderRect(child:PIXI.DisplayObject){
        if(this.renderRect == null || this.childRenderRectTransform == null)
            return;

        let childRenderRect = this.childRenderRectTransform(this.renderRect);
        Util.TrySetRenderRect(child, childRenderRect);
    }

    public setChildrenRenderRect(){
        if(this.renderRect == null || this.childRenderRectTransform == null)
            return;

        let childRenderRect = this.childRenderRectTransform(this.renderRect);
        this.children.forEach(child=>Util.TrySetRenderRect(child, childRenderRect));
    }

    withChild<T extends PIXI.DisplayObject>(child:T):this{
        let result = this.addChild.apply(this, arguments);
        return this;
    }

    addChild<T extends PIXI.DisplayObject>(child:T):T{
        let result = super.addChild.apply(this, arguments);
        this.setChildRenderRect(child);
        return result;
    }
    addChildAt<T extends PIXI.DisplayObject>(child: T, index: number): T{
        let result = super.addChildAt.apply(this, arguments);
        this.setChildRenderRect(child);
        return result;
    }
    swapChildren(child: PIXI.DisplayObject, child2: PIXI.DisplayObject): void{
        let result = super.swapChildren.apply(this, arguments);
        return result;
    }
    getChildIndex(child: PIXI.DisplayObject): number{
        let result = super.getChildIndex.apply(this, arguments);
        return result;
    }
    setChildIndex(child: PIXI.DisplayObject, index: number): void{
        let result = super.setChildIndex.apply(this, arguments);
        return result;
    }
    getChildAt(index: number): PIXI.DisplayObject{
        let result = super.getChildAt.apply(this, arguments);
        return result;
    }
    removeChild<T extends PIXI.DisplayObject>(child: T): T{
        let result = super.removeChild.apply(this, arguments);
        return result;
    }
    removeChildAt(index: number): PIXI.DisplayObject{
        let result = super.removeChildAt.apply(this, arguments);
        return result;
    }
    removeChildren(beginIndex?: number, endIndex?: number): PIXI.DisplayObject[]{
        let result = super.removeChildren.apply(this, arguments);
        return result;
    }
}