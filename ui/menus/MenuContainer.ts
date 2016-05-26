import DisplayObject = PIXI.DisplayObject;
import {City} from "../../engine/objectTypes/City";
import Util from "../../util/Util";
import CityMenu from "./CityMenu";
import Resources from "../Resources";
import * as PIXI from "pixi.js"
import DebugDraw from "../controls/DebugDraw";
import PaddedContainer from "../controls/PaddedContainer";

export default class MenuContainer extends PIXI.Container{
    background:PIXI.extras.TilingSprite;
    backgroundEdge:PIXI.extras.TilingSprite;

    currentMenu:PIXI.DisplayObject;
    content:PaddedContainer;


    renderRect:{x:number,y:number,width:number,height:number};

    constructor(public resources:Resources){
        super();


        this.background = this.addChild(new PIXI.extras.TilingSprite(resources.menuBackground, this.width, this.height));
        this.backgroundEdge = this.addChild(new PIXI.extras.TilingSprite(resources.menuBorder, resources.menuBorder.width, this.height));

        this.content = this.addChild(new PaddedContainer(10,10,10,10));


    }

    public setRenderRect(rect:{x:number, y:number, width:number, height:number}){
        this.renderRect = rect;

        //we will add some padding to the right to make room for hte shadow line
        var edgeWidth = this.backgroundEdge.texture.width;

        this.background.width = rect.width - edgeWidth;
        this.background.height = rect.height;

        this.backgroundEdge.height = rect.height;
        this.backgroundEdge.width = edgeWidth;
        this.backgroundEdge.x = this.background.width;

        this.content.setRenderRect(rect);

    }

    showMenu(newMenu:DisplayObject){
        this.content.removeChildren();
        this.content.addChild(newMenu);
    }

    showCityMenu(city:City){
        this.showMenu(new CityMenu(this.resources, city));
    }



}