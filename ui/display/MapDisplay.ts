import Resources from "../Resources";
import TileLayerDisplay from "./tiled/TileLayerDisplay";
import {CityType, City} from "../../engine/objectTypes/City";
import LayerObjectDisplay from "./tiled/LayerObjectDisplay";
import CityDisplay from "./CityDisplay";
import EventEmitter = PIXI.EventEmitter;
import Graphics = PIXI.Graphics;
export default class MapDisplay extends PIXI.Container{

    background:PIXI.extras.TilingSprite;
    debugDraw:Graphics;


    constructor(public resources:Resources){
        super();



        //we dont support other render orders for now
        var renderOrder = resources.world.state.renderorder
        if(renderOrder != "right-down"){
            throw Error("render order '${renderOrder}' is not supported. right-down is hte only supported render order");
        }

        var map = resources.world.state;
        //load up all our tile layers
        var tileMap = this.generateTileMap(resources);

        this.background = this.addChild(new PIXI.extras.TilingSprite(tileMap[1], this.width,this.height));

        resources.world.tileLayers().forEach(layer=>{
            var layerDisplay = new TileLayerDisplay(map, layer, tileMap);
            this.addChild(layerDisplay);
        });

        resources.world.objectsOfType<City>(CityType).forEach(city=>{
            var cityDisplay = new CityDisplay(city, tileMap);
            this.addChild(cityDisplay);
            this.propogate(cityDisplay, "click-city");
        });


        // var gx = new PIXI.Graphics();
        // gx.lineStyle(2,0xFFFFFF,0.1);
        // for(var row = 0; row<map.height;row++){
        //     for(var col = 0; col<map.width;col++){
        //         gx.drawRect(col*map.tilewidth, row*map.tileheight, map.tilewidth, map.tileheight);
        //     }
        // }
        //
        // this.addChild(gx);

        this.debugDraw = this.addChild(new PIXI.Graphics());


    }

    private propogate(emitter:EventEmitter,event:string)
    {
        var _me = this;
        emitter.on(event, function(){
            [].splice.call(arguments,0,0,event)
            _me.emit.apply(_me, arguments);
        });
    }


    

    generateTileMap(resources:Resources):{[gid:number]:PIXI.Texture}{
        var tileMap:{[gid:number]:PIXI.Texture} = {};

        this.resources.world.state.tilesets.forEach(tileset=>{
            var baseTexture = resources.tileSets[tileset.name];
            baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

            var subImageIndex = 0;
            for(var y=tileset.margin
                ; y+tileset.tileheight <= tileset.imageheight
                ; y+=tileset.tileheight+tileset.spacing) {

                for (var x = tileset.margin
                    ; x + tileset.tilewidth <= tileset.imagewidth
                    ; x += tileset.tilewidth + tileset.spacing) {

                    var subImageRectangle = new PIXI.Rectangle(x,y,tileset.tilewidth, tileset.tileheight);
                    tileMap[tileset.firstgid+subImageIndex] = new PIXI.Texture(baseTexture, subImageRectangle);

                    subImageIndex++;
                }
            }

        });

        return tileMap;
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