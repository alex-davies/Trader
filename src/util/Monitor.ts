import * as PIXI from "pixi.js"

export class Monitor{

    tick:()=>void;

    constructor(public predicate:()=>boolean, public action: ()=>void){
        this.tick = (()=>{
            if(predicate.call(this))
                action.call(this);
        }).bind(this);
        this.start();
    }

    start(){
        PIXI.ticker.shared.add(this.tick, this)
    }

    stop(){
        PIXI.ticker.shared.remove(this.tick, this);
    }
}

export class ChangeMonitor extends Monitor{
    public lastValue:any;

    constructor(public propertySelector:()=>any, public action: ()=>void) {
        super(()=>{
            return propertySelector() === this.lastValue;
        },()=>{
            this.lastValue = propertySelector();
            action();
        });
    }
}