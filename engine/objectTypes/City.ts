export var CityType = "City";
export class CityUtil{
    static TypeName = "City";

    static IsCity(layerObj:Tiled.LayerObject): layerObj is City{
        return layerObj && layerObj.type === this.TypeName;
    }
}
export interface City extends Tiled.LayerObject{
    properties:{
        economicScore:number;
    };
}
