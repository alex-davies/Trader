import * as Linq from "linq"
import {Properties} from "./Properties";

export class ShipUtil{
    static TypeName = "Ship";

    static IsShip(layerObj:Tiled.LayerObject): layerObj is Ship{
        return layerObj && layerObj.type === this.TypeName;
    }

    static TotalResources(ship:Ship):number{
        return Linq.from(ship.properties).where(kvp=>Properties.IsInventory(kvp.key)).sum(kvp=>kvp.value);
    }
}
export interface Ship extends Tiled.LayerObject{
    properties:{
        resourceLimit:number;
    };
}
