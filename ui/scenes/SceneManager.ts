import * as PIXI from 'pixi.js'
import Util from "../../util/Util";
import DebugDraw from "../controls/DebugDraw";
import * as TWEEN from "tween.js";

export class SceneManager{

    public renderer:PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private currentScene : PIXI.Container;
    private container: PIXI.Container;

    constructor(private htmlContainer:HTMLElement){
        this.renderer = PIXI.autoDetectRenderer(htmlContainer.clientWidth, htmlContainer.clientHeight);
        this.renderer.backgroundColor = 0xFF0000;
        htmlContainer.appendChild(this.renderer.view);

        this.container = new PIXI.Container();
        this.container.addChild(DebugDraw.Global)

        this.animate();

        window.addEventListener('resize', ()=>{
            if(htmlContainer.clientWidth != this.renderer.width
                || htmlContainer.clientHeight != this.renderer.height){
                this.renderer.resize(htmlContainer.clientWidth, htmlContainer.clientHeight);
                this.setScene(this.currentScene);

            }
        })
    }

    public setScene(scene:PIXI.Container){
        this.container.removeChild(this.currentScene);
        this.currentScene = this.container.addChildAt(scene,0);
        scene.width = this.renderer.width;
        scene.height = this.renderer.height;
        //Util.TrySetRenderRect(scene, {x:0,y:0,width:this.renderer.width, height:this.renderer.height});
    }

    animate() {
            TWEEN.update();
            this.renderer.render(this.container);
        window.requestAnimationFrame( ()=>this.animate() );
    }
}