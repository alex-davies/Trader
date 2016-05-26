import * as PIXI from 'pixi.js'
import LayerObjectDisplay from "./tiled/LayerObjectDisplay";
import {City} from "../../engine/objectTypes/City";
import {Ship} from "../../engine/objectTypes/Ship";


export  default class ShipDisplay extends LayerObjectDisplay{
    constructor(public ship:Ship, public tileMap:{[gid:number]:PIXI.Texture}){
        super(ship, tileMap);

        this.interactive = true;
        this.on("click", (e)=>{
            e.data.selection = this.ship
        })
    }

}