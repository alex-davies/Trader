import {Command, CommandResult, SuccessResult} from "engine/commands/Command";
import World from "../World";
import * as Linq from "linq"

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

        return SuccessResult;
    }
    canExecute(world:World):CommandResult{
        return SuccessResult;
    }
}

