import {
    Command, CommandResult, SuccessResult, CityDoesNotHaveRequiredResource,
    ShipDoesNotHaveCapacity
} from "./Command";
import World from "../World";
import {Ship, ShipUtil} from "../objectTypes/Ship";
import {City} from "../objectTypes/City";
import {Properties} from "../objectTypes/Properties";
import {Resource} from "../objectTypes/Resource";
import * as Linq from "linq"

export default class ShipBuyResource implements Command{
    constructor(public ship:Ship, public city:City, public resource:Resource){

    }

    execute(world:World):CommandResult{

        let canExecute = this.canExecute(world);
        if(!canExecute.isSuccessful)
            return canExecute;


        let inventoryName = Properties.InventoryPropertyName(this.resource.name);

        let shipInventory = this.ship.properties[inventoryName] || 0;
        let cityInventory = this.city.properties[inventoryName] || 0;

        this.city.properties[inventoryName] = cityInventory-1;
        this.ship.properties[inventoryName] = shipInventory+1;

        return SuccessResult;
    }
    canExecute(world:World):CommandResult{
        let inventoryName = Properties.InventoryPropertyName(this.resource.name);

        let cityInventory = this.city.properties[inventoryName] || 0;
        if(cityInventory <= 0)
            return new CityDoesNotHaveRequiredResource(this.city, this.resource.name);


        let shipTotalResources = ShipUtil.TotalResources(this.ship);
        if(shipTotalResources >= this.ship.properties.resourceLimit)
            return new ShipDoesNotHaveCapacity(this.ship);

        
        return SuccessResult;
    }
}

