import * as PIXI from "pixi.js"
import Util from "../../util/Util";
import RenderRectContainer from "./RenderRectContainer";
import UIContainer from "./UIContainer";

export default class PaddedContainer extends UIContainer{
    set paddingTop(value:number){
        this.pivot.y = -value;
        this.relayout();
    }
    get paddingTop(){
        return -this.pivot.y;
    }

    set paddingLeft(value:number){
        this.pivot.x = -value;
        this.relayout();
    }
    get paddingLeft(){
        return -this.pivot.x;
    }

    private _paddingRight:number;
    set paddingRight(value:number){
        this._paddingRight = value;
        this.relayout();
    }
    get paddingRight(){
        return this._paddingRight;
    }

    private _paddingBottom:number;
    set paddingBottom(value:number){
        this._paddingBottom = value;
        this.relayout();
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

    }

    relayout() {
        this.children.forEach(child=>{
            let anyChild = <any>child
            if(anyChild.width != null)
                anyChild.width = this.width - this.paddingLeft - this.paddingRight;
            if(anyChild.height != null)
                anyChild.height = this.height - this.paddingTop - this.paddingBottom;
        });
    }
}