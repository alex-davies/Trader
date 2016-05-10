import Event from "util/Event";
import {Command} from 'engine/commands/Command';
import {PlayerType, Player} from "engine/objectTypes/Player";
import {CityType} from "./objectTypes/City";
import {Rect, default as Util} from "../util/Util";
import * as Linq from "linq"
import {Properties} from "./objectTypes/Properties";

export default class World {

    public commandIssuingDepth = 0;
    public tickNumber:number = 0;
    public clock = new Event<number>();
    
    
    constructor(public state:Tiled.Map){

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

    public tileProperties<T>(gid:number):Linq.IEnumerable<T>{
        return <Linq.IEnumerable<T>>Linq.from(this.state.tilesets)
            .where(tileset=> tileset.tileproperties && tileset.tileproperties.hasOwnProperty(gid+tileset.firstgid+""))
            .select(tileset=>tileset.tileproperties[gid+tileset.firstgid+""])
            .firstOrDefault()
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

    }

    public tick(){
        this.clock.trigger(this.tickNumber++);
    }
}





