import * as PIXI from 'pixi.js'
import LayerObjectDisplay from "./tiled/LayerObjectDisplay";
import {City} from "../../engine/objectTypes/City";
import {Ship} from "../../engine/objectTypes/Ship";


export  default class ShipDisplay extends PIXI.Sprite{
    constructor(public ship:Ship, public tileMap:{[gid:number]:PIXI.Texture}){
        super(tileMap[37]);
        this.pivot.x = this.texture.width/2;
        this.pivot.y = this.texture.height/2;

        this.x = ship.x;
        this.y = ship.y;

        PIXI.ticker.shared.add(()=> {
            let newx = ship.x;
            let newy = ship.y;

            if(this.x > newx)
                 this.scale.x = 1;
            else if(this.x < newy)
                 this.scale.x = -1;
            this.x = newx;
            this.y = newy;
        }); 

        // this.interactive = true;
        // this.on("click", (e)=>{
        //     e.data.selection = (e.data.selection || [])
        //     e.data.selection.push(this.ship);
        // })
    }

}