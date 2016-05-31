import * as PIXI from "pixi.js"
import Util from "../../util/Util";
import RenderRectContainer from "./RenderRectContainer";
import DebugDraw from "./DebugDraw";
import AlignContainer from "./AlignContainer";
import NinePatch from "./NinePatch";
import UIText from "./UIText";
import Resources from "../Resources";
import {ButtonNinePatch} from "../Resources";
import UIContainer from "./UIContainer";
import * as TWEEN from "tween.js";


export default class UIButton extends UIContainer{

    upNinePatch:NinePatch;
    downNinePatch:NinePatch;
    content:PIXI.Container;

    
    constructor(public textures:ButtonNinePatch, public text:UIText, clickAction?:()=>void) {
        super();
        this.buttonMode = true;
        this.interactive = true;

        this.upNinePatch = this.addChildWithoutRelayout(new NinePatch(new UIContainer()).loadFromAndroidImage(textures.up));
        this.downNinePatch = this.addChildWithoutRelayout(new NinePatch(new UIContainer()).loadFromAndroidImage(textures.down));
        this.content = this.addChildWithoutRelayout(text);

        this.downNinePatch.alpha = 1;

        if(clickAction != null)
            this.on("fire",clickAction,this);

        this.on("mousedown", this.fire, this);
        
        this.relayout();
    }

    fire(){
        this.downNinePatch.alpha = 0;
        this.emit("fire")
        new TWEEN.Tween(this.downNinePatch)
            .to({alpha:1},300)
            .start();
    }

    relayout(){
        this.upNinePatch.width = this.width;
        this.upNinePatch.height = this.height;

        this.downNinePatch.width = this.width;
        this.downNinePatch.height = this.height;

        this.content.width = this.upNinePatch.content.width;
        this.content.height = this.upNinePatch.content.height;

        this.content.x = this.upNinePatch.content.x;
        this.content.y = this.upNinePatch.content.y;
    }
}