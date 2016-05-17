import * as PIXI from 'pixi.js'
import Util from "../../util/Util";

export class SceneManager{

    public renderer:PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private currentScene : PIXI.DisplayObject;

    constructor(private container:HTMLElement){
        this.renderer = PIXI.autoDetectRenderer(container.clientWidth, container.clientHeight);
        this.renderer.backgroundColor = 0xFF0000;
        container.appendChild(this.renderer.view);

        this.animate();

        window.addEventListener('resize', ()=>{
            if(container.clientWidth != this.renderer.width
                || container.clientHeight != this.renderer.height){
                this.renderer.resize(container.clientWidth, container.clientHeight);
                this.setScene(this.currentScene);

            }
        })
    }

    public setScene(scene:PIXI.DisplayObject){
        this.currentScene = scene;
        Util.TrySetRenderRect(scene, {x:0,y:0,width:this.renderer.width, height:this.renderer.height});
    }

    animate() {
        if(this.currentScene != null)
            this.renderer.render(this.currentScene);
        window.requestAnimationFrame( ()=>this.animate() );
    }
}