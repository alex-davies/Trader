import * as PIXI from "pixi.js"
import Util from "../../util/Util";
import RenderRectContainer from "./RenderRectContainer";
import DebugDraw from "./DebugDraw";
import AlignContainer from "./AlignContainer";

export default class UISprite extends AlignContainer{

    private _sprite;
    public set sprite(sprite:PIXI.Sprite){
        this.removeChild(this._sprite);
        this._sprite = this.addChild(sprite);
    }
    public get sprite():PIXI.Sprite{
        return this._sprite;
    }

    constructor(texture?: PIXI.Texture){
        super();
        this.sprite = new PIXI.Sprite(texture);
    }
}