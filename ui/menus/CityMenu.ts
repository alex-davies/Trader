import {City} from "../../engine/objectTypes/City";
import VerticalContainer from "../controls/StackContainer";
import {Properties} from "../../engine/objectTypes/Properties";
import * as Linq from "linq"
import {XYUtil} from "../../util/Coordinates";
import {VContainer} from "../controls/StackContainer";
import Resources from "../Resources";
import CityHarvest from "../../engine/commands/CityHarvest";

export default class CityMenu extends PIXI.Container{

    screenWidth:number;
    screenHeight:number;
    content:PIXI.Container;

    constructor(public resources:Resources, public city:City){
        super();

        this.content = new VContainer();
        this.addChild(this.content);


        var updateFn = this.update.bind(this);
        this.on("added",()=>{
            this.resources.world.onCommand(CityHarvest, updateFn)
        });

        this.on("removed", ()=>{
            this.resources.world.offCommand(CityHarvest, updateFn)
        })



    }

    update(){
        var textOptions = {font: "bold 20px Tahoma, Geneva, sans-serif", fill: "#DDDDDD", align: "center", stroke: "#AAAAAA", strokeThickness: 2};
        this.content.removeChildren();

        if(this.city){
            this.content.addChild(new PIXI.Text(this.city.name, textOptions));
            Linq.from(this.city.properties)
                .where(kvp=>Properties.IsInventory(kvp.key)).forEach(kvp=>{

                var resourceName = Properties.InventoryResourceName(kvp.key);
                this.content.addChild(new PIXI.Text(resourceName + ":" + kvp.value, textOptions));
            });
        }
    }



    resize(width:number, height:number){
        this.screenWidth = width;
        this.screenHeight = height;

        this.update();

    }

}