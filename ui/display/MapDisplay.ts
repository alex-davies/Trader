import Resources from "../Resources";
import TileLayerDisplay from "./tiled/TileLayerDisplay";
import {CityType, City, CityUtil} from "../../engine/objectTypes/City";
import LayerObjectDisplay from "./tiled/LayerObjectDisplay";
import CityDisplay from "./CityDisplay";
import EventEmitter = PIXI.EventEmitter;
import Graphics = PIXI.Graphics;
import {ShipUtil, Ship} from "../../engine/objectTypes/Ship";
import ShipDisplay from "./ShipDisplay";
import {TileProperties} from "../../engine/objectTypes/TileProperties";
import * as Linq from "linq"
import ShipPathOverlay from "./overlay/ShipPathOverlay";
import Container = PIXI.Container;
import * as TWEEN from "tween.js"
import ShipTravelPointsOverlay from "./overlay/ShipTravelPointsOverlay";

export default class MapDisplay extends PIXI.Container{

    background:PIXI.extras.TilingSprite;

    public tileContainer : PIXI.Container;
    public underObjectsOverlay: PIXI.Container;
    public shipContainer: PIXI.Container;
    public overObjectsOverlay: PIXI.Container;

    constructor(public resources:Resources){
        super();


        //we dont support other render orders for now
        var renderOrder = resources.world.state.renderorder
        if(renderOrder != "right-down"){
            throw Error("render order '${renderOrder}' is not supported. right-down is hte only supported render order");
        }

        var map = resources.world.state;

        //1. background
        this.background = this.addChild(new PIXI.extras.TilingSprite(resources.tileTextures[1], this.width,this.height));

        //2. tiles
        this.tileContainer = this.addChild(new Container());
        resources.world.tileLayers().forEach(layer=>{
            var layerDisplay = new TileLayerDisplay(map, layer, resources.tileTextures);
            this.tileContainer.addChild(layerDisplay);
        });

        //3. under object overlay
        this.underObjectsOverlay = this.addChild(new PIXI.Container());

        //4. objects

        resources.world.objectsOfType<City>(CityUtil.TypeName).forEach(city=>{
            var cityDisplay = new CityDisplay(city, resources.tileTextures);
            this.addChild(cityDisplay);
        });

        this.shipContainer = this.addChild(new PIXI.Container());
        resources.world.objectsOfType<Ship>(ShipUtil.TypeName).forEach(ship=>{
            var cityDisplay = new ShipDisplay(ship, resources.tileTextures);
            this.shipContainer.addChild(cityDisplay);
        });

        //4. over object overlay
        this.overObjectsOverlay = this.addChild(new PIXI.Container());



        //5. grid
        // let grid = this.addChild(new PIXI.Graphics());
        // grid.lineStyle(1,0xFFFFFF, 0.5);
        // for(let row = 0 ; row <= resources.world.state.height; row++){
        //     grid.moveTo(row*resources.world.state.tileheight,0);
        //     grid.lineTo(row*resources.world.state.tileheight, resources.world.state.width * resources.world.state.tilewidth);
        //
        // }
        // for(let col=0;col<resources.world.state.width;col++){
        //     grid.moveTo(0,col*resources.world.state.tilewidth);
        //     grid.lineTo( resources.world.state.height * resources.world.state.tileheight,col*resources.world.state.tilewidth);
        // }


        this.interactive = true;

        this.on("click", this.onClick, this);
    }



    onClick(e){
        let selectedItems = [];

        let city = this.findSelectedCity(e);
        if(city)
            selectedItems.push(city);

        let ship = this.findSelectedShip(e);
        if(ship)
            selectedItems.push(ship);

        this.emit("selection", selectedItems);
    }


    findSelectedCity(e){
        let world = this.resources.world;
        let localPoint = this.toLocal(e.data.global);

        let tileIndex = this.resources.world.getTileIndex(localPoint);
        let partOfCityIndexes = world.getExtendedNeighbours(tileIndex, index=>world.isIndexPartOfCity(index));
        if(!partOfCityIndexes.any()){
            return null;
        }
        let city = world.objectsOfType<City>(CityUtil.TypeName).firstOrDefault(city=>{
            return world.getTileIndexesInRect(city).intersect(partOfCityIndexes).any();
        });

        return city;
    }

    findSelectedShip(e){
        let world = this.resources.world;
        let localPoint = this.shipContainer.toLocal(e.data.global);
        
        let selectedShipDisplay = Linq.from(this.shipContainer.children)
            .where(x=>{
                let localPoint = e.data.getLocalPosition(x);
                return x.getLocalBounds().contains(localPoint.x, localPoint.y)
            })
            .cast<ShipDisplay>()
            .firstOrDefault();

        if(selectedShipDisplay)
            return selectedShipDisplay.ship;
        return null;

    }





    public setRenderRect(rect:{x:number, y:number, width:number, height:number}) {


        //we will adjust our background in such a way that the tilings aligns wiht our drawn tiles
        //we will also need to modify the width/height to ensure we still cover the full render area
        let xTileAligned = Math.floor(rect.x / this.background.texture.width) * this.background.texture.width;
        let xAdjustment = rect.x - xTileAligned;
        let yTileAligned = Math.floor(rect.y / this.background.texture.height) * this.background.texture.height;
        let yAdjustment = rect.y - yTileAligned;


        this.background.x = xTileAligned;
        this.background.y = yTileAligned;

        this.background.width = rect.width + xAdjustment;
        this.background.height = rect.height + yAdjustment;
    }

    getBounds(){
        let worldState = this.resources.world.state;
        return new PIXI.Rectangle(0,0,worldState.width * worldState.tilewidth, worldState.height* worldState.tileheight);
    }
}