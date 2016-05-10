export default class TileLayerDisplay extends PIXI.Container{
    constructor(layer:Tiled.Layer, tileMap:{[gid:number]:PIXI.Texture}){
        super();

        for(var i=0;i<layer.data.length;i++){
            var texture = tileMap[layer.data[i]];

            //only draw the item if we actuall yhave a texture
            if(texture) {
                var tileCol = i % layer.width;
                var tileRow = Math.floor(i / layer.height);
                
                var sprite = new PIXI.Sprite(texture);
                sprite.x = texture.width * tileCol;
                sprite.y = texture.height * tileRow;
                this.addChild(sprite);
            }


        }
    }
}