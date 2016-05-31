import * as PIXI from 'pixi.js'
import Resources from "../Resources";
import World from "../../engine/World";
import DebugDraw from "../controls/DebugDraw";
import NinePatch from "../controls/NinePatch";
import {HContainer, VContainer} from "../controls/StackContainer";
import UIContainer from "../controls/UIContainer";
import AlignContainer from "../controls/AlignContainer";

export default class StackContainerDebugScene extends UIContainer {




    constructor(){
        super();


        let alignC = this.addChild(new AlignContainer());
        alignC.width = 500;
        alignC.height = 500;

        let sprite = alignC.addChild(new PIXI.Text("scaled"));
        sprite.scale.x = 4;

        alignC.relayout();


        // var hContainer = this.addChild(new HContainer());
        // hContainer.width = 300;
        // hContainer.height = 300;
        //
        // setTimeout(()=>{
        //     hContainer.width = 600;
        // },2000)
        //
        // var vContainer = hContainer.addChild(new VContainer(),{weight:1});
        //
        // vContainer.addChild(new PIXI.Text("one"),{weight:1});
        // vContainer.addChild(new AlignContainer().withChild(new PIXI.Text("two")), {weight:1});

    }
}