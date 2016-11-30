import Resources from "../Resources";
import Util from "../../util/Util";
import {ChangeMonitor} from "../../util/Monitor";
import {pinchable, panable} from "../../util/Interactions";
import {XYUtil} from "../../util/Coordinates";
import PlayerLookAt from "../../engine/commands/PlayerLookAt";
import UIContainer from "../controls/UIContainer";

export default class Camera extends UIContainer{

    constructor(public resources:Resources,
                public target:PIXI.Container,
                public minZoom:number = 1,
                public maxZoom:number = 1){
        super();
        
        this.addChild(target);

        this.resources.world.onCommand(PlayerLookAt, ()=>this.lookAtPlayer());

        //setup the panning
        panable(this);
        this.on('panmove', (event)=> {

            let newLookAt = this.constrainLookAt({
                x:this.target.pivot.x - event.deltaX,
                y:this.target.pivot.y - event.deltaY
            });
            
            this.resources.world.issueCommand(new PlayerLookAt(newLookAt));
        });



    }

    relayout(){
        this.lookAtPlayer();
        this.setChildRenderRect();
    }

    public lookAtPlayer(){
        //center our screen on the player
        var player = this.resources.world.player();

        this.lookAt({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2
        });
    }

    public lookAt(point:{x:number,y:number}){
        //console.log(point);
        point = this.constrainLookAt(point);
        this.target.pivot.x = Math.floor(point.x);
        this.target.pivot.y = Math.floor(point.y);

        this.target.x = Math.floor(this.width / 2) ;
        this.target.y = Math.floor(this.height / 2);

        this.setChildRenderRect();
    }

    public constrainLookAt(point:{x:number,y:number}){
        let viewRect = {
            x: point.x - this.width / 2,
            y: point.y - this.height / 2,
            width:this.width,
            height:this.height
        }

        let worldRect = {
            x:0,
            y:0,
            width:this.target.width,
            height:this.target.height
        };

        viewRect = this.constrainRect(viewRect, worldRect);

        return {
            x:viewRect.x + viewRect.width / 2,
            y:viewRect.y + viewRect.height /2
        }

    }
    
    public constrainRect(
        rect:{x:number,y:number,width:number,height:number},
        constraint:{x:number,y:number,width:number,height:number}){

        if(rect.width < constraint.width){
            //view rect is within the constraint
            if(rect.x < constraint.x)
                rect.x = constraint.x;
            if(rect.x+rect.width > constraint.x+constraint.width)
                rect.x =constraint.x+constraint.width - rect.width;
        }
        else if(rect.width >= constraint.width){
            //view rect contains the constract
            if(rect.x > constraint.x)
                rect.x = constraint.x;
            if(rect.x+rect.width < constraint.x+constraint.width)
                rect.x =constraint.x+constraint.width - rect.width;
        }


        if(rect.height < constraint.height){
            //view rect is within the constraint
            if(rect.y < constraint.y)
                rect.y = constraint.y;
            if(rect.y+rect.height > constraint.y+constraint.height)
                rect.y =constraint.y+constraint.height - rect.height;
        }
        else if(rect.height >= constraint.height){
            //view rect contains the constraint
            if(rect.y > constraint.y)
                rect.y = constraint.y;
            if(rect.y+rect.height < constraint.y+constraint.height)
                rect.y =constraint.y+constraint.height - rect.height;
        }



        return rect
    }


    private setChildRenderRect(){
        Util.TrySetRenderRect(this.target, {
            x:this.target.pivot.x-this.target.x,
            y:this.target.pivot.y-this.target.y,
            width:this.width, height:this.height});
    }

}