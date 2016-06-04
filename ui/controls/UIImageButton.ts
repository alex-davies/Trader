import * as PIXI from "pixi.js"
import Util from "../../util/Util";
import RenderRectContainer from "./RenderRectContainer";
import DebugDraw from "./DebugDraw";
import AlignContainer from "./AlignContainer";
import NinePatch from "./NinePatch";
import UIText from "./UIText";
import Resources from "../Resources";

import UIContainer from "./UIContainer";
import * as TWEEN from "tween.js";
import {NinePatchButton} from "../Resources";
import {ImageButton} from "../Resources";


export default class UIImageButton extends PIXI.Sprite{

    upNinePatch:NinePatch;
    downNinePatch:NinePatch;
    content:PIXI.Container;

    
    constructor(public textures:ImageButton, clickAction?:()=>void) {
        super(textures.up);
        this.buttonMode = true;
        this.interactive = true;

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;



        if(clickAction != null)
            this.on("fire",clickAction,this);

        this.on("mousedown", this.fire, this);
    }

    fire(){
        this.emit("fire")
        this.texture = this.textures.down;
    }

}