import {Command, CommandResult, SuccessResult} from "engine/commands/Command";
import World from "../World";
import {CityType} from "../objectTypes/City";
import * as Enumerable from "linq"
import {Properties} from "../objectTypes/Properties";

export default class CityHarvest implements Command{
    constructor(){

    }

    public static TryApplyProduction(productionProps:{[key:string]:any}, targetProperties:{[key:string]:any}){
        var productionPropertyEnumerable = Enumerable.from(productionProps)
            .where(kvp=>Properties.IsProduction(kvp.key));

        //if our production requires consumption we will not create anything
        //unless we have the inventory to do so
        var canApply = productionPropertyEnumerable
            .where(kvp=>kvp.value < 0)
            .all(kvp=>{
                var resource = Properties.ProductionResourceName(kvp.key);
                return targetProperties[Properties.InventoryPropertyName(resource)] + kvp.value > 0
            });
        if(!canApply){
            return false
        }

        //add all the production values to hte inventory
        productionPropertyEnumerable.forEach(kvp=>{
            var resource = Properties.ProductionResourceName(kvp.key);
            return targetProperties[Properties.InventoryPropertyName(resource)] = (targetProperties[Properties.InventoryPropertyName(resource)] || 0) + kvp.value;
        })


        return true;
    }

    execute(world:World):CommandResult{
        world.objectsOfType(CityType).forEach(city=>{
            Enumerable.from(world.tileLayers())
                .selectMany(layer=>world.tileGidsInRect(layer,city))
                .select(gid=>world.tileProperties(gid))
                .forEach(prop=>{
                    city.properties = city.properties || {};
                    CityHarvest.TryApplyProduction(prop, city.properties);
                });
        });

        return SuccessResult;
    }
    canExecute(world:World):CommandResult{
        return SuccessResult;
    }
}

