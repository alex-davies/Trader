import * as PIXI from 'pixi.js'
import Resources from "../Resources";
import World from "../../engine/World";
import DebugDraw from "../controls/DebugDraw";
import NinePatch from "../controls/NinePatch";

export default class DebugScene extends PIXI.Container {

    numberAdded:number = 0;
    spacePerPatch = 100;

    addEmptyPatch(){
        var emptyPatch = new NinePatch().setPadding(20,20,20,20);
        emptyPatch.addChild(new PIXI.Text("patch with no textures"));
        emptyPatch.y = (this.numberAdded++) * this.spacePerPatch;
        this.addChild(emptyPatch);
    }

    addDynamicLoadPatch(){
        let dynamicLoadPatch = new NinePatch().loadFromPatchArray([
            [
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_01.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_02.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_03.png")
            ],
            [
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_04.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_05.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_06.png")
            ],
            [
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_07.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_08.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_09.png")
            ]
        ]).setPadding(20,20,20,20);
        dynamicLoadPatch.addChild(new PIXI.Text("dynamic load patch"));
        dynamicLoadPatch.y = (this.numberAdded++) * this.spacePerPatch;
        this.addChild(dynamicLoadPatch);
    }

    addFailedLoadPatch(){
        let failedLoadPatch = new NinePatch().loadFromPatchArray([
            [
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_01.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_02.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_03.png")
            ],
            [
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_04.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_05.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_06.png")
            ],
            [
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_07.png"),
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_xx.png"), //<-- doesnt exist
                PIXI.Texture.fromImage("/assets/images/backgrounds/button_09.png")
            ]
        ]).setPadding(20,20,20,20);
        failedLoadPatch.addChild(new PIXI.Text("failed load patch"));
        failedLoadPatch.y = (this.numberAdded++) * this.spacePerPatch;
        this.addChild(failedLoadPatch);
    }

    addPreloadedPatch(){
        let yValue = (this.numberAdded++) * this.spacePerPatch;
        PIXI.loader
            .add('b1', '/assets/images/backgrounds/button_01.png')
            .add('b2', '/assets/images/backgrounds/button_02.png')
            .add('b3', '/assets/images/backgrounds/button_03.png')
            .add('b4', '/assets/images/backgrounds/button_04.png')
            .add('b5', '/assets/images/backgrounds/button_05.png')
            .add('b6', '/assets/images/backgrounds/button_06.png')
            .add('b7', '/assets/images/backgrounds/button_07.png')
            .add('b8', '/assets/images/backgrounds/button_08.png')
            .add('b9', '/assets/images/backgrounds/button_09.png')
            .load((loader, res)=> {

                var preloadedPatch = new NinePatch().loadFromPatchArray([
                    [res.b1.texture, res.b2.texture, res.b3.texture],
                    [res.b4.texture, res.b5.texture, res.b6.texture],
                    [res.b7.texture, res.b8.texture, res.b9.texture]
                ]).setPadding(20,20,20,20);
                preloadedPatch.addChild(new PIXI.Text("Preloaded patch"));
                preloadedPatch.y = yValue;
                this.addChild(preloadedPatch);
            });
    }

    addAndroidPatch(){
        let yValue = (this.numberAdded++) * this.spacePerPatch;
        PIXI.loader
            .add('button', '/assets/images/backgrounds/button.9.png')
            .load((loader, res)=> {

                var androidPatch = new NinePatch().loadFromAndroidImage(res.button.texture);
                androidPatch.addChild(new PIXI.Text("android patch"));
                androidPatch.y = yValue;
                this.addChild(androidPatch);
            });
    }

    addAndroidPatchWithHover(){
        let yValue = (this.numberAdded++) * this.spacePerPatch;
        PIXI.loader
            .add('button', '/assets/images/backgrounds/button.9.png')
            .add('buttonGreen', '/assets/images/backgrounds/button-green.9.png')
            .load((loader, res)=> {

                var androidPatch = new NinePatch().loadFromAndroidImage(res.button.texture);
                androidPatch.interactive = true;
                this.buttonMode = true;
                androidPatch.on("mousedown",function(){
                    this.loadFromAndroidImage(res.buttonGreen.texture);
                });
                androidPatch.on("mouseup", function(){
                    this.loadFromAndroidImage(res.button.texture);
                })
                androidPatch.on("mouseupoutside",function(){
                    this.loadFromAndroidImage(res.button.texture);
                });
                androidPatch.on("mouseclick", function(){
                    alert('hi');
                })

                androidPatch.addChild(new PIXI.Text("android patch"));
                androidPatch.y = yValue;
                this.addChild(androidPatch);
            });
    }


    constructor(){
        super();
        // this.addEmptyPatch();
        // this.addDynamicLoadPatch();
        // this.addFailedLoadPatch();
        //
        // this.addPreloadedPatch();
        //this.addAndroidPatch();
        this.addAndroidPatchWithHover();


    }
}