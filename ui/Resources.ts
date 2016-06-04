import World from "../engine/World";
import DebugDraw from "./controls/DebugDraw";

export class NinePatchButton{
    constructor(public up:PIXI.Texture, public down:PIXI.Texture = up, public hover:PIXI.Texture = up){}
}

export class ImageButton{
    constructor(public up:PIXI.Texture, public down:PIXI.Texture = up, public hover:PIXI.Texture = up){}
}

export default class Resources{
    world:World;
    tileSets:{ [name:string]:PIXI.Texture} = {};
    tileTextures:{[gid:number]:PIXI.Texture};

    menuBackground:PIXI.Texture;
    menuBorder:PIXI.Texture;

    cityIcon:PIXI.Texture;

    buySellButton:NinePatchButton;
    moveButton:ImageButton;
}