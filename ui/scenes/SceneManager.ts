import * as PIXI from 'pixi.js'

export class SceneManager{

    public renderer:PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private currentScene : PIXI.DisplayObject;

    constructor(private container:HTMLElement){
        this.renderer = PIXI.autoDetectRenderer(container.clientWidth, container.clientHeight);
        this.renderer.backgroundColor = 0x2F8136;
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

        var duckScene = <any>scene;
        if(duckScene.resize){
            duckScene.resize(this.renderer.width, this.renderer.height)
        }
    }

    animate() {
        if(this.currentScene != null)
            this.renderer.render(this.currentScene);
        window.requestAnimationFrame( ()=>this.animate() );
    }
}