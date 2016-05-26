export class ShipUtil{
    static TypeName = "Ship";

    static IsShip(layerObj:Tiled.LayerObject): layerObj is Ship{
        return layerObj && layerObj.type === this.TypeName;
    }
}
export interface Ship extends Tiled.LayerObject{
    properties:{

    };
}
