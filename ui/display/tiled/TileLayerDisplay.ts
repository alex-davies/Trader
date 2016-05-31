import * as PIXI from 'pixi.js'

export default class TileLayerDisplay extends PIXI.Container{
    constructor(map:Tiled.Map, layer:Tiled.Layer, tileMap:{[gid:number]:PIXI.Texture}){
        super();

        for(var i=0;i<layer.data.length;i++){
            let gid = layer.data[i];
            let texture = tileMap[gid];
            //let properties = 
            
            //only draw the item if we actuall yhave a texture
            if(texture) {
                var tileCol = i % layer.width;
                var tileRow = Math.floor(i / layer.height);

                var sprite = new PIXI.Sprite(texture);
                
                //we will position based on the bottom right tile when the tileset is multiple tiles high
                sprite.pivot.y = texture.height - map.tileheight;


                sprite.x = map.tilewidth * tileCol;
                sprite.y = map.tileheight * tileRow;
                this.addChild(sprite);
            }


        }
    }
}