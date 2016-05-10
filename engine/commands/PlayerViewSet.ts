import {Command, CommandResult, SuccessResult} from "engine/commands/Command";
import World from "../World";
export default class PlayerViewSet implements Command{
    constructor(public viewRect:{x:number,y:number,width:number,height:number}){

    }

    execute(world:World):CommandResult{

        var player = world.player();
        player.x = this.viewRect.x;
        player.y = this.viewRect.y;
        player.width = this.viewRect.width;
        player.height = this.viewRect.height;

        return SuccessResult;
    }
    canExecute(world:World):CommandResult{
        return SuccessResult;
    }
}

