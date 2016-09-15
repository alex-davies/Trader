import {Command, CommandResult, SuccessResult} from "engine/commands/Command";
import World from "../World";
import * as Linq from "linq"
import {ShipUtil, Ship} from "../objectTypes/Ship";

export default class DataCleanse implements Command{
    constructor(){

    }

    execute(world:World):CommandResult{

        Linq.from(world.state.layers)
            .where(layer=>layer.type === "objectgroup")
            .selectMany(layer=>layer.objects)
            .forEach(obj=>{
                obj.properties = obj.properties || {};
            });

        world.objectsOfType<Ship>(ShipUtil.TypeName).forEach(ship=>{
            ship.properties._moveFromPoints = ship.properties._moveFromPoints || [];
            ship.properties._moveToPoints = ship.properties._moveToPoints || [];
        });

        return SuccessResult;
    }
    canExecute(world:World):CommandResult{
        return SuccessResult;
    }
}

