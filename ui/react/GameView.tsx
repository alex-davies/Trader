import * as React from 'react';
import World from 'engine/World'
import WorldDisplay from "../WorldDisplay";
import {PixiCamera, PixiCameraTranslateInteraction} from "../../util/PixiCamera";

interface GameViewProps{
    world:World;
}

export default class GameView extends React.Component<GameViewProps, any> {
    constructor(props:GameViewProps) {
        super(props);
    }
    render() {
        return <div>
            <section>Top Banner</section>
            <MapView world={this.props.world}/>
            <section>Bottom Banner</section>
        </div>
    }
}


interface MapViewProps{
    world:World;
}

class MapView extends React.Component<MapViewProps, any> {
    private renderer:PIXI.WebGLRenderer | PIXI.CanvasRenderer;
    private worldDisplay:WorldDisplay;
    private camera:PixiCamera;

    constructor(props:MapViewProps) {
        super(props);

        // create a renderer instance.
        this.renderer = PIXI.autoDetectRenderer(1136, 640);
        this.renderer.backgroundColor = 0x1C6BA0;

        this.worldDisplay = new WorldDisplay(props.world);
    }


    render() {
        return <div ref={(domElement)=>{
                domElement.appendChild(this.renderer.view);
                this.animate();
        }}/>
    }

    animate() {
        this.renderer.render(this.worldDisplay);
        window.requestAnimationFrame( ()=>this.animate() );
    }
}