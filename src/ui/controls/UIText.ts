import * as PIXI from "pixi.js"
import Util from "../../util/Util";
import RenderRectContainer from "./RenderRectContainer";
import DebugDraw from "./DebugDraw";
import AlignContainer from "./AlignContainer";

export default class UIText extends AlignContainer{

    static DefaultTextStyle = {font: "bold 20px Tahoma, Geneva, sans-serif", fill: "#333", align: "center"};

    private _text;
    public set text(text:PIXI.Text){
        this.removeChild(this._text);
        this._text = this.addChild(text);
    }
    public get text():PIXI.Text{
        return this._text;
    }

    constructor(text?: string, style: PIXI.TextStyle = UIText.DefaultTextStyle){
        super();
        this.text = new PIXI.Text(text,style);
    }
}