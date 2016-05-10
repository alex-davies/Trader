import * as PIXI from "pixi.js"
import * as _ from "lodash"

export class Monitor{

    tick:()=>void;

    constructor(public predicate:()=>boolean, public action: ()=>void){
        this.tick = ()=>{
            if(predicate())
                action();
        };
        this.start();
    }

    start(){
        PIXI.ticker.shared.add(this.tick)
    }

    stop(){
        PIXI.ticker.shared.remove(this.tick);
    }
}

export class ChangeMonitor extends Monitor{
    public lastValue:any;

    constructor(public propertySelector:()=>any, public action: ()=>void) {
        super(()=>{
            return !_.isEqual(propertySelector(), this.lastValue);
        },()=>{
            this.lastValue = propertySelector();
            action();
        });
    }
}