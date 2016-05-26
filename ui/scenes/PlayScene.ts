import * as PIXI from 'pixi.js'
import Resources from "../Resources";
import Texture = PIXI.Texture;
import MapDisplay from "../display/MapDisplay";
import Camera from "../display/Camera";
import VerticalContainer from "../controls/StackContainer";
import CityDetails from "../menus/CityMenu";
import {City, CityUtil} from "../../engine/objectTypes/City";
import {HContainer} from "../controls/StackContainer";
import MenuContainer from "../menus/MenuContainer";
import CityHarvest from "../../engine/commands/CityHarvest";
import DebugDraw from "../controls/DebugDraw";
import FillContainer from "../controls/FillContainer";



export default class PlayScene extends HContainer{

    private mapDisplay:MapDisplay;
    private camera:Camera;
    private menuContainer:MenuContainer;


    constructor(resources:Resources) {
        super(-resources.menuBorder.width);

        PIXI.ticker.shared.add(()=> {
            resources.world.tick(PIXI.ticker.shared.elapsedMS * PIXI.ticker.shared.speed);
        });

        this.mapDisplay = new MapDisplay(resources);
        this.camera = new Camera(resources, this.mapDisplay);
        this.menuContainer = new MenuContainer(resources);

let f1 = new FillContainer();
        f1.addChild(new PIXI.Text("hi"));

        //this.addChild(f1, {pixels:300});
        this.addChild(this.menuContainer, {pixels: 300, z: 1});
        this.addChild(this.camera, {weight: 1});

        this.mapDisplay.on("click", (e)=> {
            var objSelection = e.data.selection;

            if(CityUtil.IsCity(objSelection)){
                this.menuContainer.showCityMenu(e.data.selection)
            }
        });

        setInterval(()=>{
            var camera = this.camera;
            //debugger;
        },5000);
    }

}