import * as PIXI from "pixi.js"
import Util from "../../util/Util";
import RenderRectContainer from "./RenderRectContainer";
import DebugDraw from "./DebugDraw";
import UIContainer from "./UIContainer";

interface AlignContainerOptions{
    horizontalAlign? : "left"|"center"|"right";
    verticalAlign?: "top"|"middle"|"bootom";
}

export default class AlignContainer extends UIContainer{

    constructor(private options:AlignContainerOptions = {}){
        super();
        this.options = options;
    }


    relayout(){
        let childrenBounds = this.getChildrenBounds();
        let thisBounds = this.getBounds();



        switch(this.options.horizontalAlign){
            case "left":
                this.pivot.x = 0;
                break;
            case "right":
                this.pivot.x = -(thisBounds.width - childrenBounds.width);
                break;
            case "center":
            default:
                this.pivot.x =  -Math.floor((thisBounds.width - childrenBounds.width) / 2);
                break;
        }
        switch(this.options.verticalAlign){
            case "top":
                this.pivot.y = 0;
                break;
            case "bottom":
                this.pivot.y =-(thisBounds.height - childrenBounds.height);
                break;
            case "middle":
            default:
                this.pivot.y =  -Math.floor((thisBounds.height - childrenBounds.height) / 2);
               break;
        }
    }
}
