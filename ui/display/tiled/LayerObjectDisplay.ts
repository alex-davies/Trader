import * as PIXI from 'pixi.js'


export  default class LayerObjectDisplay extends PIXI.Container{
    constructor(public layerObject:Tiled.LayerObject, public tileMap:{[gid:number]:PIXI.Texture}){
        super();

        this.pivot.y = layerObject.height;
        this.x = layerObject.x;
        this.y = layerObject.y;

        if(layerObject.gid){
            var texture = tileMap[layerObject.gid];
            var sprite = new PIXI.Sprite(texture);
            sprite.scale.x = layerObject.width / texture.width;
            sprite.scale.y = layerObject.height / texture.height;
            this.addChild(sprite);
        }

        
    }
}