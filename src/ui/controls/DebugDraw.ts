import Util from "../../util/Util";

interface DebugObject{
    displayObject:PIXI.DisplayObject;
    color:number;
}

export default class DebugDraw extends PIXI.Container{
    static Global:DebugDraw = new DebugDraw();

    graphics:PIXI.Graphics;
    debugObjects:DebugObject[] = [];

    constructor(){
        super();

        this.graphics = this.addChild(new PIXI.Graphics());

        PIXI.ticker.shared.add(this.redraw.bind(this));
    }

    // getLocalBounds(){
    //
    //     return new PIXI.Rectangle(0,0,0,0);
    // }

    redraw(){
        this.graphics.clear();
        this.debugObjects.forEach((obj,i)=>{

            if(!this.isRelatedToDebugDraw(obj.displayObject)){
                this.debugObjects.slice(i,1);
                return;
            }

            var bounds = obj.displayObject.getBounds();

            var p1 = this.toLocal(new PIXI.Point(bounds.x,bounds.y), obj.displayObject);
            var p2 = this.toLocal(new PIXI.Point(bounds.x + bounds.width,bounds.y+bounds.height), obj.displayObject);

            this.graphics.lineStyle(2,obj.color, 1);
            this.graphics.drawRect(p1.x, p1.y, p2.x - p1.x, p2.y-p1.y);
        })
    }

    drawBounds(displayObject:PIXI.DisplayObject, color:number = this.defaultColor(displayObject)){
        let debugObj = {
            displayObject:displayObject,
            color:color
        };

        this.debugObjects.push(debugObj);
    }

    isRelatedToDebugDraw(item:PIXI.DisplayObject){
        let thisAncestors = DebugDraw.getAncestors(this);
        let itemAncestors = DebugDraw.getAncestors(item);

        for(let i=0;i<thisAncestors.length;i++){
            if(itemAncestors.indexOf(thisAncestors[i]) >= 0)
                return true;
        }

        return false
    }

    static getAncestors(item:PIXI.DisplayObject):PIXI.DisplayObject[]{
        let ancestors = [];
        let currentItem = item;
        while(currentItem = currentItem.parent) {
            ancestors.push(currentItem);
        }
        return ancestors;
    }

    static DrawBounds(displayObject:PIXI.DisplayObject, color?:number){
        DebugDraw.Global.drawBounds(displayObject, color);
    }

    private defaultColor(obj:any){
        let constructorName = Util.FunctionName(obj.constructor) || "";
        let hashedName = Util.HashCodeString(constructorName);
        let color = Math.abs(hashedName % 16777216);
        return color;


    }
}