import {Command, CommandResult, SuccessResult} from "./Command";
import World from "../World";
export class PlayerViewTranslate implements Command{
    constructor(public dx:number, public dy:number){

    }

    execute(world:World):CommandResult{

        var player = world.player();
        player.x += this.dx;
        player.y += this.dy;

        return SuccessResult;
    }
    canExecute(world:World):CommandResult{
        return SuccessResult;
    }
}