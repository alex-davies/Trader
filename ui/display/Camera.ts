import Resources from "../Resources";
import Util from "../../util/Util";
import {ChangeMonitor} from "../../util/Monitor";
import {pinchable, panable} from "../../util/Interactions";
import {XYUtil} from "../../util/Coordinates";
import PlayerLookAt from "../../engine/commands/PlayerLookAt";

export default class Camera extends PIXI.Container{

    debugGraphics = new PIXI.Graphics();

    renderRect:{x:number, y:number, width:number, height:number};

    constructor(public resources:Resources,
                public target:PIXI.Container,
                public minZoom:number = 1,
                public maxZoom:number = 1){
        super();
        
        this.addChild(target);
        this.addChild(this.debugGraphics);

        this.renderRect = {x:0,y:0,width:this.width, height:this.height};

        this.resources.world.onCommand(PlayerLookAt, ()=>this.lookAtPlayer());

        //setup the panning
        panable(this);
        this.on('panmove', (event)=> {

            let newLookAt = this.constrainLookAt({
                x:this.target.pivot.x - event.deltaX,
                y:this.target.pivot.y - event.deltaY
            });
            
            this.resources.world.IssueCommand(new PlayerLookAt(newLookAt));
        });

    }

    public lookAtPlayer(){
        //center our screen on the player
        var player = this.resources.world.player();

        this.lookAt({
            x: player.x + player.width / 2,
            y: player.y + player.height / 2
        });

        //this.lookAt({x:0,y:0});

        // this.target.pivot.x = Math.floor(player.x + player.width / 2);
        // this.target.pivot.y = Math.floor(player.y + player.height / 2);
        //
        // this.target.x = Math.floor(this.renderRect.width / 2) ;
        // this.target.y = Math.floor(this.renderRect.height / 2) ;
    }

    public lookAt(point:{x:number,y:number}){
        //console.log(point);
        point = this.constrainLookAt(point);
        this.target.pivot.x = Math.floor(point.x);
        this.target.pivot.y = Math.floor(point.y);

        this.target.x = Math.floor(this.renderRect.width / 2) ;
        this.target.y = Math.floor(this.renderRect.height / 2);

        this.setChildRenderRect();
    }

    public constrainLookAt(point:{x:number,y:number}){
        let viewRect = {
            x: point.x - this.renderRect.width / 2,
            y: point.y - this.renderRect.height / 2,
            width:this.renderRect.width,
            height:this.renderRect.height
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


    /***
     * creates a new rectangle that meets the following criteria
     *  * matches the screen width/height ratio
     *  * total zoom is between min and max zoom
     *  * fits inside the world rect
     * @param viewRect
     * @param worldRect
     * @param screenWidth
     * @param screenHeight
     * @param minZoom
     * @param maxZoom
     * @returns {{x: number, y: number, width: number, height: number}}
     */
    adjustViewRectToFitScreen(
        viewRect:{x:number,y:number,width:number,height:number},
        worldRect?:{x:number,y:number,width:number,height:number},
        screenWidth?:number,
        screenHeight?:number,
        minZoom?:number,
        maxZoom?:number
    ):{x:number,y:number,width:number,height:number}{

        worldRect = worldRect || {x:0, y:0, width:this.target.width, height:this.target.height};
        screenWidth = screenWidth || this.renderRect.width;
        screenHeight = screenHeight || this.renderRect.height;
        minZoom = minZoom || this.minZoom;
        maxZoom = maxZoom || this.maxZoom;

        var newViewRect = {x:viewRect.x, y:viewRect.y, width:viewRect.width, height:viewRect.height};

        //make our view box the same ratio as the screen
        var screenHeightToWidthRatio = screenWidth/screenHeight;
        var viewRectHeightToWidthRatio = newViewRect.width/newViewRect.height;
        if(screenHeightToWidthRatio !== viewRectHeightToWidthRatio){
            //ratios not hte same we need tochagne either height or width
            var diffWidth = Math.abs(screenWidth - newViewRect.width);
            var diffHeight = Math.abs(screenHeight - newViewRect.height);
            if(diffWidth > diffHeight){
                newViewRect = XYUtil.scaleRect(
                    newViewRect,
                    { x: newViewRect.height * screenHeightToWidthRatio / newViewRect.width, y: 1});
            }
            else{
                newViewRect = XYUtil.scaleRect(
                    newViewRect,
                    {x:1 ,y:  newViewRect.width / screenHeightToWidthRatio / newViewRect.height});
            }
        }

        //make sure we are within our zoom bounds
        var scaleX = screenWidth / newViewRect.width;
        var scaleY = screenHeight / newViewRect.height;
        var requiredZoom = Math.min(scaleX, scaleY);

        if(requiredZoom > maxZoom) {
            newViewRect = XYUtil.scaleRect(
                newViewRect,
                requiredZoom/maxZoom);
        }
        if(requiredZoom < minZoom) {
            newViewRect = XYUtil.scaleRect(
                newViewRect,
                requiredZoom/minZoom);
        }

        //move hte view box around so it fits within the world
        //i.e we cant see outside of the map
        if(newViewRect.width > worldRect.width)
            newViewRect.width = worldRect.width;
        if(newViewRect.height > worldRect.height)
            newViewRect.height = worldRect.height;
        if(newViewRect.x < worldRect.x)
            newViewRect.x = worldRect.x;
        if(newViewRect.y < worldRect.y)
            newViewRect.y = worldRect.y;
        if(newViewRect.x+newViewRect.width > worldRect.x + worldRect.width)
            newViewRect.x = worldRect.x + worldRect.width - newViewRect.width;
        if(newViewRect.y+newViewRect.height > worldRect.y + worldRect.height)
            newViewRect.y = worldRect.y + worldRect.height - newViewRect.height;


        //console.debug("",screenWidth,  newViewRect.width);
        return newViewRect;

    }

    public setRenderRect(rect:{x:number, y:number, width:number, height:number}){
        this.renderRect = rect;

        this.lookAtPlayer();
        this.lookAtPlayer();
    }

    private setChildRenderRect(){
        Util.TrySetRenderRect(this.target, {
            x:this.target.pivot.x-this.target.x,
            y:this.target.pivot.y-this.target.y,
            width:this.renderRect.width, height:this.renderRect.height});
    }

}