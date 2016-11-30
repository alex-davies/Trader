import * as PIXI from 'pixi.js'
import Util from "../../util/Util";
import DebugDraw from "../controls/DebugDraw";
import * as TWEEN from "tween.js";
import InteractionManager = PIXI.interaction.InteractionManager;

export class SceneManager{

    public renderer:PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private currentScene : PIXI.Container;
    private container: PIXI.Container;

    constructor(private htmlContainer:HTMLElement){
        this.renderer = PIXI.autoDetectRenderer(htmlContainer.clientWidth, htmlContainer.clientHeight, {antialias:true});
        this.renderer.backgroundColor = 0xFF0000;
        htmlContainer.appendChild(this.renderer.view);

        //Hack: interaction data objects are reused making it difficult to store info on them
        //this is a hack to remove the "selection" property on every click so it can be used
        //by the rest of hte system to bubble what has been clicked in
        // let plugins = ((<any>this.renderer).plugins);
        // let interactionManager = (<InteractionManager>plugins.interaction);
        // let clearData = function(displayObject, eventString, eventData){
        //     debugger;
        //     delete (<any>interactionManager.eventData.data).selection;
        // }
        // this.interceptBefore(interactionManager, "onMouseUp",clearData)
        // this.interceptBefore(interactionManager, "onMouseDown",clearData)
        // interactionManager.setTargetElement(interactionManager.interactionDOMElement, interactionManager.resolution);


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
        this.currentScene = this.container.addChildAt(scene,0) as PIXI.Container;
        scene.width = this.renderer.width;
        scene.height = this.renderer.height;
        //Util.TrySetRenderRect(scene, {x:0,y:0,width:this.renderer.width, height:this.renderer.height});
    }

    animate() {
            TWEEN.update();
            this.renderer.render(this.container);
        window.requestAnimationFrame( ()=>this.animate() );
    }

    interceptBefore(target:Object, method:string, intercept:(...args:any[])=>void){
        let originalMethod = target[method];
        target[method] = function(){
            intercept.apply(this,arguments);
            originalMethod.apply(this, arguments);
        }
    }
}
