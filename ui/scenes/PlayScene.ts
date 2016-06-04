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



export default class PlayScene extends HContainer{

    private mapDisplay:MapDisplay;
    private mapOverlay:MapOverlayDisplay;
    private camera:Camera;
    private menuContainer:MenuContainer;


    constructor(resources:Resources) {
        super(-resources.menuBorder.width);

        PIXI.ticker.shared.add(()=> {
            resources.world.tick(PIXI.ticker.shared.elapsedMS * PIXI.ticker.shared.speed);
        });

        this.mapDisplay = new MapDisplay(resources);
        this.mapOverlay = new MapOverlayDisplay(resources, this.mapDisplay);
        this.camera = new Camera(resources, this.mapOverlay);
        this.menuContainer = new MenuContainer(resources);

        this.mapOverlay.showMoveButtons();

        let ship = resources.world.objectOfType<Ship>(ShipUtil.TypeName);
        resources.world.issueCommand(new ShipMove(ship,188));

        //this.mapOverlay.showMovePath(ship);


        // let f1 = new UIContainer({horizontalAlign:"right"});
        // f1.width = 600;
        // f1.height = 900;
        // f1.addChild(new PIXI.Text("hi"));
        // this.addChild(f1, {pixels:300});

        // let c = this.addChild(new Container());
        // let t = c.addChild(new PIXI.Text("hi"));
        //
        // let bounds = c.getBounds();
        // let localBounds = c.getLocalBounds();
        //
        // t.x = 100;
        // t.y = 100;
        // let bounds2 = c.getBounds();
        // let localBounds2 = c.getLocalBounds();
        // debugger;



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