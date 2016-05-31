import World from "../engine/World";
import DebugDraw from "./controls/DebugDraw";

export interface ButtonNinePatch{
    up:PIXI.Texture;
    down:PIXI.Texture;
    hover:PIXI.Texture;
}

export default class Resources{
    tileSets:{ [name:string]:PIXI.Texture} = {};
    tileTextures:{[gid:number]:PIXI.Texture};
    menuBackground:PIXI.Texture;
    menuBorder:PIXI.Texture;
    cityIcon:PIXI.Texture;
    world:World;
    button:ButtonNinePatch;
}