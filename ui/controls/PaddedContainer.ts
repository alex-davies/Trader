import * as PIXI from "pixi.js"
import Util from "../../util/Util";
import RenderRectContainer from "./RenderRectContainer";

export default class PaddedContainer extends RenderRectContainer{
    set paddingTop(value:number){
        this.pivot.y = -value;
        this.resetChildRenderRectTransform();
    }
    get paddingTop(){
        return -this.pivot.y;
    }

    set paddingLeft(value:number){
        this.pivot.x = -value;
        this.resetChildRenderRectTransform();
    }
    get paddingLeft(){
        return -this.pivot.x;
    }

    private _paddingRight:number;
    set paddingRight(value:number){
        this._paddingRight = value;
        this.resetChildRenderRectTransform();
    }
    get paddingRight(){
        return this._paddingRight;
    }

    private _paddingBottom:number;
    set paddingBottom(value:number){
        this._paddingBottom = value;
        this.resetChildRenderRectTransform();
    }
    get paddingBottom(){
        return this._paddingBottom;
    }

    constructor(paddingTop:number=0, paddingRight:number=0, paddingBottom:number=0, paddingLeft:number=0){
         super();

        this.pivot.y = -paddingTop;
        this._paddingRight = paddingRight;
        this._paddingBottom = paddingBottom;
        this.pivot.x = -paddingLeft;

        this.resetChildRenderRectTransform();
    }

    private resetChildRenderRectTransform(){
        this.childRenderRectTransform = rect=> {
            return {
                x: rect.x,
                y: rect.y,
                width: rect.width - this.paddingLeft - this.paddingRight,
                height: rect.height - this.paddingTop - this.paddingBottom
            }
        }
    }
}