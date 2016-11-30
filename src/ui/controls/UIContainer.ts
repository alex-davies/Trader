import * as PIXI from "pixi.js"
import Util from "../../util/Util";
import RenderRectContainer from "./RenderRectContainer";
import DebugDraw from "./DebugDraw";

export default class UIContainer extends PIXI.Container{


    private _width;
    set width(value:number){
        if(value !== this._width) {
            this._width = value;
            this.relayout();
        }
    }
    get width(){
        return this.getBounds().width;
    }

    private _height;
    set height(value:number){
        if(value !== this._height) {
            this._height = value;
            this.relayout();
        }
    }
    get height(){
        return this.getBounds().height;
    }

    constructor(){
        super();
        //
        // let oldChildrenChange = this.onChildrenChange;
        // this.onChildrenChange = ()=>{
        //     oldChildrenChange();
        //     this.relayout();
        // }

        //DebugDraw.DrawBounds(this);
    }


    relayout(){

    }


    getBounds(){
       let bounds = super.getBounds().clone();

        bounds.x = this.pivot.x;
        bounds.y = this.pivot.y;
        if(this._width != null) {
            bounds.width = this._width;
        }

        if(this._height != null){
            bounds.height = this._height;
        }

        return bounds;
    }

    getChildrenBounds(){
        //little hack, getLocalBounds updates all the transforms on the children,
        //then calls getBounds. Issue is we have overridden get bound so it calls the
        //wrong get bounds. Our solution is to call the super class twice, super.getLocalBounds to
        //update the transforms and super.getBounds to get the childrens bounds.
        let ignore = super.getLocalBounds();
        return super.getBounds();
    }

    withChild(child:PIXI.DisplayObject):this{
        this.addChild(child);
        return this;
    }
    addChildWithoutRelayout<T extends PIXI.DisplayObject>(child:T):T{
        let result = super.addChild.apply(this, arguments);
        return result;
    }
    addChild<T extends PIXI.DisplayObject>(child:T):T{
        let result = super.addChild.apply(this, arguments);
        this.relayout();
        return result;
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
