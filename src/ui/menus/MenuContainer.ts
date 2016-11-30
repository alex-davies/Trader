import DisplayObject = PIXI.DisplayObject;
import {City} from "../../engine/objectTypes/City";
import Util from "../../util/Util";
import CityMenu from "./CityMenu";
import Resources from "../Resources";
import * as PIXI from "pixi.js"
import DebugDraw from "../controls/DebugDraw";
import PaddedContainer from "../controls/PaddedContainer";
import UIContainer from "../controls/UIContainer";

export default class MenuContainer extends UIContainer{
    background:PIXI.extras.TilingSprite;
    backgroundEdge:PIXI.extras.TilingSprite;

    currentMenu:PIXI.DisplayObject;
    content:PaddedContainer;


    renderRect:{x:number,y:number,width:number,height:number};

    constructor(public resources:Resources){
        super();


        this.background = new PIXI.extras.TilingSprite(resources.menuBackground, this.width, this.height);
        this.backgroundEdge = new PIXI.extras.TilingSprite(resources.menuBorder, resources.menuBorder.width, this.height);
        this.content = new PaddedContainer(10,10,10,10);


        this.addChild(this.background);
        this.addChild(this.backgroundEdge);
        this.addChild(this.content);


    }


    relayout(){

        this.content.width = this.width;
        this.content.height = this.height;

        //we will add some padding to the right to make room for hte shadow line
        var edgeWidth = this.backgroundEdge.texture.width;

        this.background.width = this.width - edgeWidth;
        this.background.height = this.height;

        this.backgroundEdge.height = this.height;
        this.backgroundEdge.width = edgeWidth;
        this.backgroundEdge.x = this.background.width;
    }

    showMenu(newMenu:DisplayObject){
        this.content.removeChildren();
        this.content.addChild(newMenu);
    }

    showCityMenu(city:City){
        this.showMenu(new CityMenu(this.resources, city));
    }



}