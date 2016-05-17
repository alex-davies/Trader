import * as PIXI from 'pixi.js'
import Resources from "../Resources";
import Texture = PIXI.Texture;
import MapDisplay from "../display/MapDisplay";
import Camera from "../display/Camera";
import VerticalContainer from "../controls/StackContainer";
import CityDetails from "../menus/CityMenu";
import {City} from "../../engine/objectTypes/City";
import {HContainer} from "../controls/StackContainer";
import MenuContainer from "../menus/MenuContainer";
import CityHarvest from "../../engine/commands/CityHarvest";



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


        this.addChild(this.menuContainer, {pixels: 200, z: 1});
        this.addChild(this.camera, {weight: 1});


        this.mapDisplay.on("click-city", (city)=> {
            this.menuContainer.showCityMenu(city);
        });

        setInterval(()=>{
            var camera = this.camera;
            //debugger;
        },5000);
    }

}