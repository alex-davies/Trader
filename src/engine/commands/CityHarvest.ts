import {Command, CommandResult, SuccessResult} from "./Command";
import World from "../World";
import {CityType} from "../objectTypes/City";
import * as Enumerable from "linq"
import {Properties} from "../objectTypes/Properties";
import {TileProperties} from "../objectTypes/TileProperties";


export default class CityHarvest implements Command{
    static TypeName = "CityHarvest";

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

    executeXXX(world:World):CommandResult{
        // world.objectsOfType(CityType).forEach(city=>{
        //     Enumerable.from(world.tileLayers())
        //         .selectMany(layer=>world.tileGidsInRect(layer,city))
        //         .select(gid=>world.tileProperties(gid))
        //         .forEach(prop=>{
        //             city.properties = city.properties || {};
        //             CityHarvest.TryApplyProduction(prop, city.properties);
        //         });
        // });

        return SuccessResult;
    }

    execute(world:World):CommandResult{
        world.objectsOfType(CityType).forEach(city=>{

            var cityCenter = {
                x:city.x+city.width / 2,
                y:city.y-city.height / 2
            }
            var cityTileIndex = world.getTileIndex(cityCenter);
            world.getExtendedNeighbours(cityTileIndex, function(){return true}).toArray()
            Enumerable.from(world.tileLayers())
                .selectMany(layer=>world
                    .getExtendedNeighbours(cityTileIndex,tileIndex=>{

                        return tileIndex === cityTileIndex || world.getTilePropertiesFromIndex<TileProperties>(layer,tileIndex).isPartOfCity
                    })
                    .select(tileIndex=>world.getTilePropertiesFromIndex(layer, tileIndex)))
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

