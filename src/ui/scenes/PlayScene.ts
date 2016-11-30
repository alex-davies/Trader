import * as Linq from "linq"
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
import UIContainer from "../controls/UIContainer";
import Container = PIXI.Container;
import {ShipUtil, Ship} from "../../engine/objectTypes/Ship";
import ShipMove from "../../engine/commands/ShipMove";
import MapOverlayDisplay from "../display/MapOverlayDisplay";
import ShipPathOverlay from "../display/overlay/ShipPathOverlay";
import ShipTravelPointsOverlay from "../display/overlay/ShipTravelPointsOverlay";



export default class PlayScene extends HContainer{

    private mapDisplay:MapDisplay;
    private camera:Camera;
    private menuContainer:MenuContainer;


    constructor(resources:Resources) {
        super(-resources.menuBorder.width);

        PIXI.ticker.shared.add(()=> {
            //we will prevent hte world from skipping ahead if tab not in focus
            let elapsedTime = Math.min(200, PIXI.ticker.shared.elapsedMS * PIXI.ticker.shared.speed);
            resources.world.tick(elapsedTime);
        });

        this.mapDisplay = new MapDisplay(resources);
        this.camera = new Camera(resources, this.mapDisplay);
        this.menuContainer = new MenuContainer(resources);




        this.addChild(this.menuContainer, {pixels: 300, z: 1});
        this.addChild(this.camera, {weight: 1});

        //for now we will treat the players ship as always selected
        let player = resources.world.player();
        let playerShip = resources.world.objectsOfType<Ship>(ShipUtil.TypeName).firstOrDefault(s=>s.properties.playerId === player.id);
        if(playerShip) {
            this.mapDisplay.underObjectsOverlay.addChild(new ShipPathOverlay(resources, playerShip)).animateIn();
            this.mapDisplay.underObjectsOverlay.addChild(new ShipTravelPointsOverlay(resources, playerShip)).animateIn();
        }
        this.mapDisplay.on("selection", (selectedItems)=>{

            selectedItems = selectedItems.push(playerShip);
            let items = Linq.from(selectedItems);

        })

    }

}