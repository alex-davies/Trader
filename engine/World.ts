import Event from "util/Event";
import {Command} from 'engine/commands/Command';
import {PlayerType, Player} from "engine/objectTypes/Player";
import {CityType, City, CityUtil} from "./objectTypes/City";
import {Rect, default as Util} from "../util/Util";
import * as Linq from "linq"
import {Properties} from "./objectTypes/Properties";
import CityHarvest from "./commands/CityHarvest";
import * as EventEmitter from "eventemitter3"
import DataCleanse from "./commands/DataCleanse";
import {TileProperties} from "./objectTypes/TileProperties";
import {ShipUtil, Ship} from "./objectTypes/Ship";
import TweenGroup from "../util/TweenGroup";
import {XYUtil} from "../util/Coordinates";

export default class World {

    public commandIssuingDepth = 0;
    public tickNumber:number = 0;
    public clock = new Clock();
    private commandEmitter = new EventEmitter();
    public tweens:TweenGroup = new TweenGroup();
    
    constructor(public state:Tiled.Map){
        this.clock.every(2000, ()=>{
           this.issueCommand(new CityHarvest());
        });

        // this.clock.every(50, ()=>{
        //     this.objectsOfType<Ship>(ShipUtil.TypeName).forEach(ship=>{
        //         let targetPoint = this.getTilePoint(ship.properties.moveToTileIndex);
        //
        //         ship.x += Math.max(-1,Math.min(1, targetPoint.x - ship.x));
        //         ship.y += Math.max(-1,Math.min(1, targetPoint.y - ship.y));
        //
        //         if(targetPoint.x === ship.x && targetPoint.y === ship.y)
        //             ship.properties.moveToTileIndex = null;
        //     });
        // })


        this.issueCommand(new DataCleanse());
    }
    
    
    public player():Player{
        var existingPlayer = this.objectOfType<Player>(PlayerType);
        if(existingPlayer){
            return existingPlayer
        }
    }
    
    public objectsOfType<T extends Tiled.LayerObject>(type:string) : Linq.IEnumerable<T>{
        return Linq.from(this.state.layers)
            .where(layer=>layer.type === "objectgroup")
            .selectMany(layer=><T[]>layer.objects)
            .where(obj=>obj.type === type)
    }

    public objectOfType<T extends Tiled.LayerObject>(type:string):T{
        return this.objectsOfType<T>(type).firstOrDefault();
    }

    public tileLayers(){
        return Linq.from(this.state.layers).where(layer=>layer.type === "tilelayer")
    }


    public getNeighbourIndexes(tileIndex:number){
        var neighbours = [];

        var currentRow = Math.floor(tileIndex / this.state.width);
        var currentCol = tileIndex  % this.state.width;

        var fromRow = Math.max(currentRow -1, 0);
        var toRow = Math.min(currentRow+1, this.state.height-1);
        var fromCol = Math.max(currentCol-1,0);
        var toCol = Math.min(currentCol+1,this.state.width-1);

        for(let row = fromRow; row<=toRow; row++){
            for(let col = fromCol; col<=toCol; col++){
                if(!(row == currentRow && col == currentCol))
                    neighbours.push(this.state.width * row + col);
            }
        }

        return neighbours;
    }

    public getExtendedNeighbours(startTileIndex:number, segmentPredicate:(tileIndex:number)=>boolean):Linq.IEnumerable<number>{
        var processedIndexes:{[index:number]:boolean} = {};
        var toProcessIndexes = [startTileIndex];
        var partOfSegment = [];

        while(toProcessIndexes.length > 0){
            let toProcessIndex = toProcessIndexes.pop();
            if(processedIndexes[toProcessIndex])
                continue;

            processedIndexes[toProcessIndex] = true;

            if(!segmentPredicate(toProcessIndex))
                continue;

            partOfSegment.push(toProcessIndex);
            toProcessIndexes.push.apply(toProcessIndexes, this.getNeighbourIndexes(toProcessIndex))
        }

        return Linq.from(partOfSegment);
    }

    getTileIndex(point:{x:number, y:number, width?:number, height?:number}){
        point = {
            x: point.x + (point.width || 0)/2,
            y: point.y - (point.height || 0)/2
        }
        var row = Math.floor(point.y / this.state.tileheight);
        var col = Math.floor(point.x / this.state.tilewidth);

        return this.state.width * row + col;
    }

    getTilePoint(tileIndex:number){
        let row = Math.floor(tileIndex / this.state.width);
        let col = tileIndex % this.state.width;
        return {
            x:col * this.state.tilewidth + this.state.tilewidth/2,
            y:row * this.state.tileheight + this.state.tileheight/2
        }
    }



    getTileIndexesInRect(rect:Rect){
        var startTilePosition = {
            x:Math.round(rect.x / this.state.tilewidth),
            y:Math.round(rect.y / this.state.tileheight)
        };

        var endTilePosition = {
            x:Math.round((rect.x + rect.width) / this.state.tilewidth),
            y:Math.round((rect.y + rect.height) / this.state.tileheight)
        };

        var result = [];
        for(var row = startTilePosition.y;row<endTilePosition.y;row++) {
            for (var col = startTilePosition.x; col < endTilePosition.x; col++) {
                result.push(this.state.width * row + col);
            }
        }

        return Linq.from(result);
    }



    public getTilePropertiesFromIndex<T>(layer:Tiled.Layer, tileIndex:number):T{
        return this.getTilePropertiesFromGid<T>(layer.data[tileIndex])
    }

    public getTilePropertiesFromGid<T>(gid:number):T{
        //TODO: this gets called a lot, should cache gid->properties
        
        var tilesetsWithGid = Linq.from(this.state.tilesets).where(tileset=> tileset.tileproperties && tileset.tileproperties.hasOwnProperty(gid-tileset.firstgid+""))

        return Linq.from(this.state.tilesets)
            .where(tileset=> tileset.tileproperties && tileset.tileproperties.hasOwnProperty(gid-tileset.firstgid+""))
            .select(tileset=><T>tileset.tileproperties[gid-tileset.firstgid+""])
            .firstOrDefault() || <T>{};
    }

    public getGidStack(tileIndex:number){
        return this.tileLayers().select(layer=>{
            return layer.data[tileIndex];
        }).where(gid=>gid!==0);
    }

    findPointRoute(start:{x:number,y:number}, end:{x:number,y:number},canTravelOnTileIndex:(tileIndex:number)=>boolean):{path:{x:number,y:number}[], distance:number}{
        let startTile = this.getTileIndex(start);
        let endTile = this.getTileIndex(end);

        let tileRoute = this.findTileRoute(startTile,endTile, canTravelOnTileIndex);
        let tilePath = tileRoute.path;
        let distance = tileRoute.distance;

        //no path can be found
        if(tilePath.length == 0){
            return {path:[],distance:0}
        }

        //we will do some smart adjustment we do not need to go to the first tile if it is not on the way
        if(tilePath.length >= 2){

            //if its shorter to move from start to second tile than move to first then second we will do the shorter
            let firstTilePoint = this.getTilePoint(tilePath[0]);
            let secondTilePoint = this.getTilePoint(tilePath[1]);
            let distStartToFirstTile = XYUtil.distance(start, firstTilePoint);
            let distStartToSecondTile = XYUtil.distance(start, secondTilePoint);
            let distFirstTileToSecondTile = XYUtil.distance(firstTilePoint, secondTilePoint);

            if(distStartToSecondTile < distStartToFirstTile + distFirstTileToSecondTile) {
                tilePath.shift();
                distance -= distFirstTileToSecondTile;
            }

            //if its shorter to go from second last tile to end, we will do that rather than go through last tile
            let lastTilePoint = this.getTilePoint(tilePath[tilePath.length-1]);
            let secondLastTilePoint = this.getTilePoint(tilePath[tilePath.length-2]);
            let distEndToLastTile = XYUtil.distance(end, lastTilePoint);
            let distEndToSecondLastTile = XYUtil.distance(end, secondLastTilePoint);
            let distLastTileToSecondLastTile = XYUtil.distance(lastTilePoint, secondLastTilePoint);

            if(distEndToSecondLastTile < distEndToLastTile + distLastTileToSecondLastTile) {
                tilePath.pop();
                distance -= distLastTileToSecondLastTile;
            }
        }


        let pointPath = tilePath.map(ti=>this.getTilePoint(ti));

        //make sure our start and end points are part of the path
        if(!XYUtil.equals(pointPath[0], start)){
            pointPath.unshift(start);
            distance += XYUtil.distance(pointPath[0], start);
        }
        if(!XYUtil.equals(pointPath[pointPath.length-1], end)){
            pointPath.push(end);
            distance += XYUtil.distance(pointPath[pointPath.length-1], end);
        }

        return {
            path:pointPath,
            distance:distance
        }

    }

    findTileRoute(startTileIndex:number, endTileIndex:number, canTravelOnTileIndex:(tileIndex:number)=>boolean):{path:number[],distance:number}{
        let distance = (tileIndex1:number, tileIndex2:number)=>{
            let p1 = this.getTilePoint(tileIndex1);
            let p2 = this.getTilePoint(tileIndex2);
            return XYUtil.distance(p1,p2);
        }

        let open = [startTileIndex];
        let closed = [];

        //g_score is actual distance from start to that tile
        let g_score:{[tileIndex:number]:number}={};
        g_score[startTileIndex] = 0;

        //f_score is the estimated liklihood this is on the correct path. its made from
        //the distance from start to that tile plus estimation of that tile to the end
        let f_score:{[tileIndex:number]:number}={};
        f_score[startTileIndex] = g_score[startTileIndex] + distance(startTileIndex, endTileIndex);

        let came_from:{[tileIndex:number]:number}={};

        while(open.length > 0){

            //find the node that has the lowest f-score, i.e. will
            //be the most likely to lead to the shortest part
            let lowest_index = 0;
            let lowest_node = open[lowest_index];
            let lowest_f_score = f_score[lowest_node];
            for(let i=1;i<open.length;i++) {
                let current_node = open[i];
                let current_f_score = f_score[current_node];
                if(lowest_f_score > current_f_score){
                    lowest_index = i;
                    lowest_f_score = current_f_score;
                    lowest_node = current_node;
                }
            }
            let current_node = lowest_node;

            //close our node
            open.splice(lowest_index, 1);
            closed.push(lowest_node);

            //if we cant travel on this node, forget about it
            if(!canTravelOnTileIndex(lowest_node))
                continue;

            //if we have reached the end node, we are done, we just need
            //to rebuild the path
            if(current_node === endTileIndex){
                var path = [lowest_node];
                var source = came_from[lowest_node];
                while(source){
                    path.push(source);
                    source = came_from[source];
                }
                path.reverse();
                return {
                    path:path,
                    distance:g_score[current_node]
                };
            }


            this.getNeighbourIndexes(current_node).forEach(neighbour=>{
                //don't touch nodes we have processed before
                if(closed.indexOf(neighbour) != -1)
                    return;

                var tentative_g_score = g_score[current_node] + distance(current_node, neighbour);

                if(open.indexOf(neighbour) === -1){
                    open.push(neighbour)
                }
                else if(tentative_g_score >= g_score[neighbour]){
                    return; //this is not a better path
                }

                came_from[neighbour] = current_node;
                g_score[neighbour] = tentative_g_score;
                f_score[neighbour] = tentative_g_score + distance(current_node, neighbour);
            });
        }

    }

    // findPath(sourceMarkerIds:string[], targetMarkerId:string):string[]{
    //
    //     var open = sourceMarkerIds;
    //
    //     var came_from = {};
    //
    //     var g_score = {};
    //     for(var i=0;i<sourceMarkerIds.length;i++){
    //         g_score[sourceMarkerIds[i]] = 0;
    //     }
    //
    //     var f_score = {};
    //     for(var i=0;i<sourceMarkerIds.length;i++) {
    //         f_score[sourceMarkerIds[i]]= g_score[sourceMarkerIds[i]] + this.distance(sourceMarkerIds[i], targetMarkerId);
    //     }
    //
    //
    //     var closedSet = [];
    //
    //     while(open.length > 0){
    //
    //         var lowest_index = 0;
    //         var lowest_node = open[lowest_index];
    //         var lowest_f_score = f_score[lowest_node];
    //
    //         for(var i=1;i<open.length;i++) {
    //             var current_node = open[i];
    //             var current_f_score = f_score[current_node];
    //             if(lowest_f_score > current_f_score){
    //                 lowest_index = i;
    //                 lowest_f_score = current_f_score;
    //                 lowest_node = current_node;
    //             }
    //         }
    //
    //         if(lowest_node == targetMarkerId){
    //             var path = [lowest_node];
    //             var source = came_from[lowest_node];
    //             while(source){
    //                 path.push(source);
    //                 source = came_from[source];
    //             }
    //             path.reverse();
    //             return path;
    //         }
    //
    //         open.splice(lowest_index, 1);
    //         closedSet.push(lowest_node);
    //
    //         var neighbours = this.neighbours(lowest_node)
    //         for(var i=0;i<neighbours.length;i++){
    //             var neighbour = neighbours[i];
    //
    //             //dont touch nodes we have processed before
    //             if(closedSet.indexOf(neighbour) != -1)
    //                 continue;
    //
    //             var tentative_g_score = g_score[current_node] + this.distance(lowest_node, neighbour);
    //
    //             if(open.indexOf(neighbour) === -1){
    //                 open.push(neighbour)
    //             }
    //             else if(tentative_g_score >= g_score[neighbour]){
    //                 continue; //this is not a better path
    //             }
    //
    //             came_from[neighbour] = lowest_node;
    //             g_score[neighbour] = tentative_g_score;
    //             f_score[neighbour] = tentative_g_score + this.distance(lowest_node, neighbour);
    //         }
    //     }
    // }



    isIndexPartOfCity(tileIndex:number){
        return this.getGidStack(tileIndex)
            .select(gid=>this.getTilePropertiesFromGid<TileProperties>(gid))
            .any(prop=>prop.isPartOfCity);
    }

    isMovementAllowed(tileIndex:number){
        return this.getGidStack(tileIndex)
            .select(gid=>this.getTilePropertiesFromGid<TileProperties>(gid))
            .all(prop=>prop.allowMovement);
    }





    public onCommand<T>(clazz: {new (...args : any[]): T, prototype: Command; }, callback:(command:T)=>void){

        var typeName = Util.FunctionName(<any>clazz);
        this.commandEmitter.on(typeName, callback);
    }

    public offCommand<T>(clazz: {new (...args : any[]): T, prototype: Command; }, callback:(command:T)=>void){

        var typeName = Util.FunctionName(<any>clazz);
        this.commandEmitter.off(typeName, callback);

    }

    public onCommands(clazzes: {new (...args : any[]): any, prototype: Command; }[], callback:(command:Command)=>void){
        clazzes.forEach(clazz=>this.onCommand(clazz,callback));
    }

    public offCommands(clazzes: {new (...args : any[]): any, prototype: Command; }[], callback:(command:Command)=>void){
        clazzes.forEach(clazz=>this.offCommand(clazz,callback));
    }


    public issueCommand(...commands: Command[]){

        for(var i=0;i<commands.length;i++){
            var command = commands[i];

            console.debug(Array(this.commandIssuingDepth).join(">") + 'executing command', command);
            this.commandIssuingDepth++;
            var result = command.execute(this);
            this.commandIssuingDepth--;
            if(!result.isSuccessful)
                console.debug(Array(this.commandIssuingDepth).join(">") +'unable to execute command', command, result);
        }

        commands.forEach(command=>{
            var typeName = Util.FunctionName(command.constructor);
            this.commandEmitter.emit(typeName,command);
        })

    }

    public tick(elapsedMilliseconds:number){
        this.clock.tick(elapsedMilliseconds);
        this.tweens.update(this.clock.time);
    }



}


class Clock{
    time:number = 0;

    private _listeners: { (elapsed:number):void ;}[] = [];


    public tick(elapsedMilliseconds:number){
        this.time+=elapsedMilliseconds;

        var listeners = this._listeners.slice(0);
        for (var i = 0, l = listeners.length; i < l; i++) {
            listeners[i].call(this, elapsedMilliseconds);
        }
    }

    every(everyMillisecons, fn:()=>void){

        this._listeners.push(elapsed=>{
            var previousTime = this.time - elapsed;
            var currentTime = this.time;

            var numberOfOccurances = Math.floor(currentTime / everyMillisecons) - Math.floor(previousTime / everyMillisecons);
            for(var i=0; i<numberOfOccurances; i++){
                fn();
            }
        });
    }
}





