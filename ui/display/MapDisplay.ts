import Resources from "../Resources";
import TileLayerDisplay from "./tiled/TileLayerDisplay";
import {CityType, City, CityUtil} from "../../engine/objectTypes/City";
import LayerObjectDisplay from "./tiled/LayerObjectDisplay";
import CityDisplay from "./CityDisplay";
import EventEmitter = PIXI.EventEmitter;
import Graphics = PIXI.Graphics;
import {ShipUtil, Ship} from "../../engine/objectTypes/Ship";
import ShipDisplay from "./ShipDisplay";
export default class MapDisplay extends PIXI.Container{

    background:PIXI.extras.TilingSprite;

    constructor(public resources:Resources){
        super();



        //we dont support other render orders for now
        var renderOrder = resources.world.state.renderorder
        if(renderOrder != "right-down"){
            throw Error("render order '${renderOrder}' is not supported. right-down is hte only supported render order");
        }

        var map = resources.world.state;
        //load up all our tile layers

        this.background = this.addChild(new PIXI.extras.TilingSprite(resources.tileTextures[1], this.width,this.height));

        resources.world.tileLayers().forEach(layer=>{
            var layerDisplay = new TileLayerDisplay(map, layer, resources.tileTextures);
            this.addChild(layerDisplay);
        });

        resources.world.objectsOfType<City>(CityUtil.TypeName).forEach(city=>{
            var cityDisplay = new CityDisplay(city, resources.tileTextures);
            this.addChild(cityDisplay);
        });

        resources.world.objectsOfType<Ship>(ShipUtil.TypeName).forEach(ship=>{
            var cityDisplay = new ShipDisplay(ship, resources.tileTextures);
            this.addChild(cityDisplay);
        });
        this.interactive = true;

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

    getLocalBounds(){
        let worldState = this.resources.world.state;
        return new PIXI.Rectangle(0,0,worldState.width * worldState.tilewidth, worldState.height* worldState.tileheight);
    }
}