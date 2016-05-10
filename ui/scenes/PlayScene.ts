import * as PIXI from 'pixi.js'
import Resources from "../Resources";
import Texture = PIXI.Texture;
import * as _ from 'lodash'
import MapDisplay from "../display/MapDisplay";
import Camera from "../display/Camera";



export default class PlayScene extends PIXI.Container{
    private loadingSprite:PIXI.Sprite;
    private viewWidth:number = 0;
    private viewHeight:number = 0;
    private mapDisplay:MapDisplay;
    private camera:Camera;

    constructor(resources:Resources){
        super();


        this.mapDisplay = new MapDisplay(resources);
        this.camera = new Camera(resources, this.mapDisplay);

        this.addChild(this.camera);
    }

    resize(width:number, height:number){
        this.viewWidth = width;
        this.viewHeight= height;

        this.camera.resize(width,height);
    }

    
}