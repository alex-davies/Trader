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

export default class CityMenu extends VContainer{
    content:PIXI.Container;
    textOptions = {font: "bold 20px Tahoma, Geneva, sans-serif", fill: "#333", align: "center"};

    constructor(public resources:Resources, public city:City){
        super(20);

        this.content = new VContainer();
        this.addChild(this.content);


        var updateFn = this.update.bind(this);
        this.on("added",()=>{
            this.update();
            //this.resources.world.onCommand(CityHarvest, updateFn)
        });

        this.on("removed", ()=>{
            this.resources.world.offCommand(CityHarvest, updateFn)
        })


        this.update();

    }

    update() {

        let resourceMetas = this.resources.world.objectsOfType<Resource>(ResourceUtil.TypeName).toDictionary(r=>r.name);

        let ship = this.resources.world.objectOfType<Ship>(ShipUtil.TypeName);
        let textOptions = {font: "bold 20px Tahoma, Geneva, sans-serif", fill: "#333", align: "center"};
        this.removeChildren();


        if (this.city) {
            this.addChild(new PIXI.Text(this.city.name, textOptions));

            // let hcontainer = this.addChild(new HContainer(),{pixels:200}).withChildren([
            //     new PIXI.Text("Hello"),
            //     [new VContainer().withChildren([
            //         [new FillContainer(), {weight:1}],
            //         [new FillContainer(), {weight:1}]
            //     ]),{weight:1}]
            // ]);


            Linq.from(this.city.properties).where(kvp=>Properties.IsInventory(kvp.key)).take(1).forEach(kvp=> {
                var resourceName = Properties.InventoryResourceName(kvp.key);
                var resourceAmount = kvp.value;
                var resourceMeta = resourceMetas.get(resourceName);

                // this.cell({pixels: 100}, new HContainer().cells([
                //     [{weight: 1}, new PIXI.Text("one")],
                //     [{weight: 1}, new PIXI.Text("two")]
                // ]));

               this.cell(
                   {pixels:70}, new HContainer().cells([
                       [{flexible:true}, this.buildIcon(resourceMeta, 2)],
                       [{pixels:20}, new Spacer()],
                       [{weight:1}, new VContainer().cells([
                           [{weight:1}, new HContainer().cells([
                               [{flexible:true},new FillContainer().withChild(this.buildIcon(this.city))],
                               [{weight:1}, new FillContainer().withChild(new PIXI.Text(resourceAmount, textOptions))],
                               [{weight:2}, this.buildSellButton()]
                           ])],
                           [{weight:1}, new HContainer().cells([
                               [{flexible:true},new FillContainer().withChild(this.buildIcon(ship))],
                               [{weight:1}, new FillContainer().withChild(new PIXI.Text("???", textOptions))],
                               [{weight:2}, this.buildBuyButton()]
                           ])]
                       ])]
               ]));


            });
            //    this.cell(
            //        {pixels:70}, new HContainer().cells([
            //            [{flexible:true}, this.buildIcon(resourceMeta, 2)],
            //            [{pixels:20}, new Spacer()],
            //            [{weight:1}, new VContainer().cells([
            //                [{weight:1}, new HContainer().cells([
            //                    [{flexible:true},this.buildIcon(this.city)],
            //                    [{weight:1}, new PIXI.Text(resourceAmount, textOptions)],
            //                    [{weight:2}, this.buildSellButton()]
            //                ])],
            //                [{weight:1}, new HContainer().cells([
            //                    [{flexible:true},this.buildIcon(ship)],
            //                    [{weight:1}, new PIXI.Text("???", textOptions)],
            //                    [{weight:2}, this.buildBuyButton()]
            //                ])]
            //            ])]
            //    ]));
            //
            // });


            //this.relayout();
        }
    }

    buildBuyButton(){
        var button = new NinePatch().loadFromAndroidImage(this.resources.buttonNinePatch);
        var text = new PIXI.Text("-$5", this.textOptions);
        
        var fillContaienr = new FillContainer();
        fillContaienr.addChild(text);

        //return fillContaienr;
        button.addChild(fillContaienr);

        button.relayout();
        
        //button.relayout();
        //button.addChild(text);


       return button;
    }

    buildSellButton(){
        // var button = new NinePatch().loadFromAndroidImage(this.resources.buttonNinePatch);
        // button.addChild(new PIXI.Text("$5", this.textOptions));

        // return button;

        return new PIXI.Text("$5", this.textOptions);
    }

    buildIcon(obj:{gid:number}, scale = 1):PIXI.DisplayObject{
        if(obj.gid){
            let sprite = new PIXI.Sprite(this.resources.tileTextures[obj.gid]);
            sprite.scale.set(scale,scale);
            return sprite;
        }
        else{
            return new PIXI.Text(obj.gid+"")
        }
    }



}