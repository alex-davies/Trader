import Resources from "../Resources";
import TileLayerDisplay from "./TileLayerDisplay";
export default class MapDisplay extends PIXI.Container{

    constructor(public resources:Resources){
        super();

        //we dont support other render orders for now
        var renderOrder = resources.world.state.renderorder
        if(renderOrder != "right-down"){
            throw Error("render order '${renderOrder}' is not supported. right-down is hte only supported render order");
        }


        //load up all our tile layers
        var tileMap = this.generateTileMap(resources);
        resources.world.tileLayers().forEach(layer=>{
            var layerDisplay = new TileLayerDisplay(layer, tileMap);
            this.addChild(layerDisplay);
        });
        


    }

    

    generateTileMap(resources:Resources):{[gid:number]:PIXI.Texture}{
        var tileMap:{[gid:number]:PIXI.Texture} = {};

        this.resources.world.state.tilesets.forEach(tileset=>{
            var baseTexture = resources.tileSets[tileset.name];
            var subImageIndex = 0;
            for(var y=tileset.margin
                ; y+tileset.tileheight <= tileset.imageheight
                ; y+=tileset.tileheight+tileset.spacing) {

                for (var x = tileset.margin
                    ; x + tileset.tilewidth <= tileset.imagewidth
                    ; x += tileset.tilewidth + tileset.spacing) {

                    var subImageRectangle = new PIXI.Rectangle(x,y,tileset.tilewidth, tileset.tileheight);
                    tileMap[tileset.firstgid+subImageIndex] = new PIXI.Texture(baseTexture, subImageRectangle);

                    var test:PIXI.Texture;
                    

                    subImageIndex++;
                }
            }

        });

        return tileMap;
    }
}