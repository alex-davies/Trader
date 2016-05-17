import World from "../engine/World";
export default class Resources{
    tileSets:{ [name:string]:PIXI.Texture} = {};
    menuBackground:PIXI.Texture;
    menuBorder:PIXI.Texture
    world:World;
}