import World from 'engine/World';
export interface Command{
    execute(board:World):CommandResult;
    canExecute(board:World):CommandResult;
}

export class CommandResult{
   constructor(public isSuccessful:boolean, public failureReason?:string){

   }
}

export var SuccessResult = new CommandResult(true);

export class ShipIdNotFoundResult extends CommandResult{
    constructor(shipId:string){
        super(false, "Ship with id '"+shipId+"' not found");
    }
}

export class PortIdNotFoundResult extends CommandResult{
    constructor(portId:string){
        super(false, "Port with id '"+portId+"' not found");
    }
}

export class ResourceIdNotFoundResult extends CommandResult{
    constructor(resourceId:string){
        super(false, "Resource with id '"+resourceId+"' not found");
    }
}

export class MarkerIdNotFoundResult extends CommandResult{
    constructor(markerId:string){
        super(false, "Marker with id '"+markerId+"' not found");
    }
}

export class BalanceTooLowResult extends CommandResult{
    constructor(){
        super(false, "Balance too low");
    }
}