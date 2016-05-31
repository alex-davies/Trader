import {City} from "../../engine/objectTypes/City";
import VerticalContainer from "../controls/StackContainer";
import {Properties} from "../../engine/objectTypes/Properties";
import * as Linq from "linq"
import {XYUtil} from "../../util/Coordinates";
import {VContainer} from "../controls/StackContainer";
import Resources from "../Resources";
import CityHarvest from "../../engine/commands/CityHarvest";
import Util from "../../util/Util";
import {ResourceUtil, Resource} from "../../engine/objectTypes/Resource";
import {HContainer} from "../controls/StackContainer";
import {Spacer} from "../controls/StackContainer";
import {Ship, ShipUtil} from "../../engine/objectTypes/Ship";
import NinePatch from "../controls/NinePatch";
import FillContainer from "../controls/FillContainer";
import UIText from "../controls/UIText";
import UISprite from "../controls/UISprite";
import AlignContainer from "../controls/AlignContainer";
import UIButton from "../controls/UIButton";
import UIContainer from "../controls/UIContainer";
import ShipBuyResource from "../../engine/commands/ShipBuyResource";


interface DataBoundUIElement extends PIXI.DisplayObject{
    refreshDataBindings();
}

export default class CityMenu extends VContainer{


    constructor(public resources:Resources, public city:City){
        super(20);

        var updateFn = this.refreshDataBindings.bind(this);
        this.on("added",()=>{
            this.refreshDataBindings();
            this.resources.world.onCommands([CityHarvest, ShipBuyResource], updateFn)
        });

        this.on("removed", ()=>{
            this.resources.world.offCommands([CityHarvest,ShipBuyResource], updateFn)
        })


        this.refreshDataBindings();

    }

    buildDataBoundResourceRow(ship:Ship, resourceMeta:Resource):DataBoundUIElement{
        let cityAmountText:UIText;
        let shipAmountText:UIText;
        
        let buyButton:UIButton = new UIButton(this.resources.button, new UIText("Buy"),()=>{
            this.resources.world.issueCommand(new ShipBuyResource(ship,this.city,resourceMeta))
        });
        
        let sellButton:UIButton  = new UIButton(this.resources.button, new UIText("Sell"),()=>{
            this.resources.world.issueCommand(new ShipBuyResource(ship,this.city,resourceMeta))
        });;

        let row = <HContainer & DataBoundUIElement>new HContainer().cells([
            [{flexible:true}, this.buildIcon(resourceMeta, 1.8)],
            [{pixels:20}, new Spacer()],
            [{weight:1}, new VContainer().cells([
                [{weight:1}, new HContainer().cells([
                    [{flexible:true},this.buildIconFromTexture(this.resources.cityIcon)],
                    [{weight:1}, cityAmountText = new UIText("")],
                    [{weight:2}, sellButton]
                ])],
                [{weight:1}, new HContainer().cells([
                    [{flexible:true},this.buildIcon(ship)],
                    [{weight:1}, shipAmountText = new UIText("")],
                    [{weight:2}, buyButton]
                ])]
            ])]
        ]);

        row.refreshDataBindings = ()=>{

            let inventoryName = Properties.InventoryPropertyName(resourceMeta.name);
            cityAmountText.text.text = this.city.properties[inventoryName]  || 0+ "";
            shipAmountText.text.text = ship.properties[inventoryName] || 0 + ""
            cityAmountText.relayout();
            shipAmountText.relayout();
        };

        return row;
    }

    rowCache:{[resourceName:string]:DataBoundUIElement} = {}

    refreshDataBindings() {

        let resourceMetas = this.resources.world.objectsOfType<Resource>(ResourceUtil.TypeName).toDictionary(r=>r.name);

        let ship = this.resources.world.objectOfType<Ship>(ShipUtil.TypeName);

        this.removeChildren();

        this.addChild(new UIText(`${ShipUtil.TotalResources(ship)} / ${ship.properties.resourceLimit}`))

        Linq.from(this.city.properties).where(kvp=>Properties.IsInventory(kvp.key)).forEach(kvp=> {
            var resourceName = Properties.InventoryResourceName(kvp.key);
            var resourceAmount = kvp.value;
            var resourceMeta = resourceMetas.get(resourceName);

            this.rowCache[resourceName] = this.rowCache[resourceName] || this.buildDataBoundResourceRow(ship, resourceMeta);

            let rowItem = this.rowCache[resourceName];
            rowItem.refreshDataBindings();
            this.cell({pixels:70}, rowItem);

        });

    }



    buildSellButton(){
        let button = new UIButton(this.resources.button, new UIText("Sell"),()=>{
            console.log("sell");
        });
        return button;
    }

    buildIcon(obj:{gid:number}, scale = 1):PIXI.DisplayObject{
        if(obj.gid){
            return this.buildIconFromTexture(this.resources.tileTextures[obj.gid]);
        }
        else{
            return new PIXI.Text(obj.gid+"")
        }
    }

    buildIconFromTexture(texture:PIXI.Texture, scale = 1){
        let sprite = new UISprite(texture);
        sprite.sprite.scale.set(scale,scale);
        sprite.relayout();
        return sprite;
    }



}