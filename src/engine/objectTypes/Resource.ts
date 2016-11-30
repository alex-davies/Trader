
export class ResourceUtil{
    static TypeName = "Resource";

    static IsResource(layerObj:Tiled.LayerObject): layerObj is Resource{
        return layerObj && layerObj.type === this.TypeName;
    }


}
export interface Resource extends Tiled.LayerObject{
    properties:{
        basePrice:number;
    };
}
