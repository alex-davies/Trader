import World from "../engine/World";
import DebugDraw from "./controls/DebugDraw";
export default class Resources{
    tileSets:{ [name:string]:PIXI.Texture} = {};
    tileTextures:{[gid:number]:PIXI.Texture};
    menuBackground:PIXI.Texture;
    menuBorder:PIXI.Texture
    world:World;
    buttonNinePatch:PIXI.Texture;
}