import {Command, CommandResult, SuccessResult} from "./Command";
import World from "../World";
export default class PlayerLookAt implements Command{
    constructor(public point:{x:number,y:number}, public zoom = 1){
        point.x = Math.floor(point.x);
        point.y = Math.floor(point.y);
    }

    execute(world:World):CommandResult{

        var player = world.player();
        player.x = this.point.x - player.width/2;
        player.y = this.point.y - player.height/2;


        return SuccessResult;
    }
    canExecute(world:World):CommandResult{
        return SuccessResult;
    }
}

