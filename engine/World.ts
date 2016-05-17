import Event from "util/Event";
import {Command} from 'engine/commands/Command';
import {PlayerType, Player} from "engine/objectTypes/Player";
import {CityType, City} from "./objectTypes/City";
import {Rect, default as Util} from "../util/Util";
import * as Linq from "linq"
import {Properties} from "./objectTypes/Properties";
import CityHarvest from "./commands/CityHarvest";
import * as EventEmitter from "eventemitter3"

export default class World {

    public commandIssuingDepth = 0;
    public tickNumber:number = 0;
    public clock = new Clock();
    private commandEmitter = new EventEmitter();
    
    
    constructor(public state:Tiled.Map){
        this.clock.every(2000, ()=>{
           this.IssueCommand(new CityHarvest());
        });
    }
    
    
    public player():Player{
        var existingPlayer = this.objectOfType<Player>(PlayerType);
        if(existingPlayer){
            return existingPlayer
        }
    }
    
    public objectsOfType<T extends Tiled.LayerObject>(type:string) : Array<T>{
        return <Array<T>>this.state.layers
            .filter(layer=>layer.type === "objectgroup")
            .map(layer=>layer.objects.filter(obj=>obj.type === type))
            .reduce((a1,a2)=>a1.concat(a2),[]);
    }

    public objectOfType<T extends Tiled.LayerObject>(type:string):T{
        return this.objectsOfType<T>(type)[0];
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

    getTileIndex(point:{x:number, y:number}){
        var row = Math.floor(point.y / this.state.tileheight);
        var col = Math.floor(point.x / this.state.tilewidth);

        return this.state.width * row + col;
    }


    public tileGidsInRect(tileLayer:Tiled.Layer, rect:Rect):Linq.IEnumerable<number>{
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
                result.push(tileLayer.data[this.state.width * row + col]);
            }
        }
        return Linq.from(result);
    }

    public getTilePropertiesFromIndex<T>(layer:Tiled.Layer, tileIndex:number):T{
        return this.getTilePropertiesFromGid<T>(layer.data[tileIndex])
    }

    public getTilePropertiesFromGid<T>(gid:number):T{
        var tilesetsWithGid = Linq.from(this.state.tilesets).where(tileset=> tileset.tileproperties && tileset.tileproperties.hasOwnProperty(gid-tileset.firstgid+""))

        return Linq.from(this.state.tilesets)
            .where(tileset=> tileset.tileproperties && tileset.tileproperties.hasOwnProperty(gid-tileset.firstgid+""))
            .select(tileset=><T>tileset.tileproperties[gid-tileset.firstgid+""])
            .firstOrDefault() || <T>{};
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


    public IssueCommand(...commands: Command[]){

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





