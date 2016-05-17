import DisplayObject = PIXI.DisplayObject;
import {City} from "../../engine/objectTypes/City";
import Util from "../../util/Util";
import CityMenu from "./CityMenu";
import Resources from "../Resources";
import * as PIXI from "pixi.js"

export default class MenuContainer extends PIXI.Container{
    background:PIXI.extras.TilingSprite;
    backgroundEdge:PIXI.extras.TilingSprite;

    currentMenu:PIXI.DisplayObject;



    renderRect:{x:number,y:number,width:number,height:number};

    constructor(public resources:Resources){
        super();

        this.background = new PIXI.extras.TilingSprite(resources.menuBackground, this.width, this.height);
        this.addChild(this.background);

        this.backgroundEdge = new PIXI.extras.TilingSprite(resources.menuBorder, resources.menuBorder.width, this.height);
        this.addChild(this.backgroundEdge);
    }

    public setRenderRect(rect:{x:number, y:number, width:number, height:number}){
        this.renderRect = rect;

        //we will add some padding to the right to make room for hte shadow line
        var paddingRight = this.backgroundEdge.texture.width;

        this.background.width = rect.width - paddingRight;
        this.background.height = rect.height;

        this.backgroundEdge.height = rect.height;
        this.backgroundEdge.width = paddingRight;
        this.backgroundEdge.x = this.background.width;

        Util.TrySetRenderRect(this.currentMenu, {x:0,y:0, width:this.background.width, height:rect.height});

    }

    showMenu(newMenu:DisplayObject){
        this.removeChild(this.currentMenu);
        this.currentMenu = newMenu;
        this.addChild(newMenu);

        Util.TrySetRenderRect(this.currentMenu, {x:0,y:0, width:this.background.width, height:this.renderRect.height});
    }

    showCityMenu(city:City){
        this.showMenu(new CityMenu(this.resources, city));
    }



}