import * as PIXI from 'pixi.js'
import LayerObjectDisplay from "./tiled/LayerObjectDisplay";
import {City} from "../../engine/objectTypes/City";


export  default class CityDisplay extends LayerObjectDisplay{
    constructor(public city:City, public tileMap:{[gid:number]:PIXI.Texture}){
        super(city, tileMap);

        this.interactive = true;
        this.on("click", (e)=>{
            e.data.selection = this.city
        })
    }

}