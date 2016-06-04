import {
    Command, CommandResult, SuccessResult, CityDoesNotHaveRequiredResource,
    ShipDoesNotHaveCapacity
} from "engine/commands/Command";
import World from "../World";
import {Ship, ShipUtil} from "../objectTypes/Ship";
import {City} from "../objectTypes/City";
import {Properties} from "../objectTypes/Properties";
import {Resource} from "../objectTypes/Resource";
import * as Linq from "linq"
import * as TWEEN from "tween.js";
export default class ShipMove implements Command{
    constructor(public ship:Ship, public destinationTileIndex:number){

    }

    execute(world:World):CommandResult{

        let canExecute = this.canExecute(world);
        if(!canExecute.isSuccessful)
            return canExecute;

        let destinationPoint = world.getTilePoint(this.destinationTileIndex);
        let pointRoute = world.findPointRoute(this.ship,destinationPoint, (tileIndex)=>world.isMovementAllowed(tileIndex));

        this.ship.properties._moveToPoints = pointRoute.path;
        this.ship.properties._moveFromPoints = this.ship.properties._moveFromPoints || [];

        let xPoints = pointRoute.path.map(p=>p.x);
        let yPoints = pointRoute.path.map(p=>p.y);
        let pointsTravelled = 0
        let tween = world.tweens.add(new TWEEN.Tween(this.ship).to({x:xPoints,y:yPoints},pointRoute.distance * 30)
            .easing(TWEEN.Easing.Linear.None)
            .interpolation(TWEEN.Interpolation.CatmullRom)
            .onUpdate(progress=>{
                let pointsTravelledOnUpdate = Math.floor(progress * xPoints.length);
                let newPointsTravelled = pointsTravelledOnUpdate - pointsTravelled;

                let travelledPoints = this.ship.properties._moveToPoints.splice(0,newPointsTravelled);
                this.ship.properties._moveFromPoints.push.apply(this.ship.properties._moveFromPoints,travelledPoints);

                pointsTravelled = pointsTravelledOnUpdate;
            })
            .start(world.clock.time));

        //
        // let points = tileIndexPath.map(tileIndex=>world.getTilePoint(tileIndex));
        // this.ship.properties._movePointPath = points;
        // //our ship is anchored at bottom left, so we need to move our x/y points away from center tile
        // let xPoints = points.map(p=>p.x-this.ship.width/2);
        // let yPoints = points.map(p=>p.y+this.ship.width/2);
        //
        //
        //
        // let tween = world.tweens.add(new TWEEN.Tween(this.ship).to({x:xPoints,y:yPoints},points.length * 1000)
        //     .easing(TWEEN.Easing.Linear.None)
        //     .interpolation(TWEEN.Interpolation.CatmullRom)
        //     .onUpdate(progress=>this.ship.properties._moveProgress = progress)
        //     .start(world.clock.time));
        //
        //

        // let tileIndexes = [100,1];
        //
        // let firstTween;
        // let previousTween;
        // for(let i=0;i<tileIndexes.length;i++){
        //     let destinationTileIndex = tileIndexes[i];
        //     let targetPoint = world.getTilePoint(destinationTileIndex);
        //
        //     let tween = new TWEEN.Tween(this.ship).to(targetPoint,10000);
        //     if(firstTween == null){
        //         tween = tween.easing(TWEEN.Easing.Quadratic.In);
        //         firstTween = tween;
        //     }
        //     if(previousTween != null){
        //         previousTween.chain(tween);
        //     }
        //
        //     previousTween = tween;
        //
        // }
        //
        // world.tweens.add(firstTween.start(world.clock.time));


        return SuccessResult;
    }
    canExecute(world:World):CommandResult{
        
        
        return SuccessResult;
    }
}

