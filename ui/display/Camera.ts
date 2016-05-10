import Resources from "../Resources";
import Util from "../../util/Util";
import {ChangeMonitor} from "../../util/Monitor";
import CameraTranslateInteraction from "../interactions/CameraTranslateInteraction";
import PlayerViewSet from "../../engine/commands/PlayerViewSet";
import {pinchable, panable} from "../../util/Interactions";
import {XYUtil} from "../../util/Coordinates";

export default class Camera extends PIXI.Container{

    debugGraphics = new PIXI.Graphics();

    screenWidth:number;
    screenHeight:number;

    constructor(public resources:Resources,
                public target:PIXI.Container,
                public minZoom:number = 0.3,
                public maxZoom:number = 3){
        super();
        this.addChild(target);
        this.addChild(this.debugGraphics);

        //makre sure we update whenever hte player view changes
        new ChangeMonitor(()=>{
            var player = resources.world.player();
            return {x:player.x, y:player.y,width:player.width,height:player.height}
        }, ()=>this.updateCamera());


        //setup the panning
        panable(this);
        this.on('panmove', (event)=> {
            var world = this.resources.world;
            var player = world.player();

            var scaleX = this.screenWidth / player.width;
            var scaleY = this.screenHeight / player.height;

            var newViewRect = this.adjustViewRectToFitScreen({
                x:player.x  - event.deltaX / scaleX,
                y:player.y  - event.deltaY / scaleY,
                width:player.width,
                height:player.height});
            
            world.IssueCommand(new PlayerViewSet(newViewRect));
        });


        //setup the zooming
        pinchable(this);
        this.on('pinchmove', (event)=> {
           //TODO: need to get on phone to implment and test this
        });
        var onWheel = ( event )=> {
           let delta    = event.wheelDelta || -event.detail;
           let local_pt = new PIXI.Point();
           let point    = new PIXI.Point(event.pageX, event.pageY);

            PIXI.interaction.InteractionData.prototype.getLocalPosition(this, local_pt, point);

            let factor = delta < 0 ? 1.1 : 1/1.1;

            var world = this.resources.world;
            var player = world.player();

            var newViewRect = this.adjustViewRectToFitScreen(XYUtil.scaleRect(
                player,
                factor,
                local_pt
            ));

            world.IssueCommand(new PlayerViewSet(newViewRect));
        }
        document.addEventListener('DOMMouseScroll', onWheel.bind(this)); // Firefox
        document.addEventListener('mousewheel', onWheel.bind(this));     // Not Firefox

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
        screenWidth = screenWidth || this.screenWidth;
        screenHeight = screenHeight || this.screenHeight;
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

    resize(width:number, height:number){
        this.screenWidth = width;
        this.screenHeight = height;

        var player = this.resources.world.player();

        //screen has changed so we need to update our vie to fit the screen
        var newViewRect = this.adjustViewRectToFitScreen(player);
        this.resources.world.IssueCommand(new PlayerViewSet(newViewRect));
    }

    updateCamera(){
        //center our screen on the player
        var player = this.resources.world.player();

        //pivot around the center of our view box, this makes
        //zooming a bit simpler
        this.pivot.x = player.x + player.width/2;
        this.pivot.y = player.y + player.height /2;

        //center it on the screen
        this.x = this.screenWidth/2;
        this.y = this.screenHeight/2;


        //scale so get at least the players view area in
        var scaleX = this.screenWidth / player.width;
        var scaleY = this.screenHeight / player.height;
        this.scale.x = scaleX;
        this.scale.y = scaleY;


        // this.debugGraphics.clear();
        // this.debugGraphics.lineStyle(2, 0xFF0000);
        //
        // this.debugGraphics.beginFill(0xFF0000, 0.5);
        // this.debugGraphics.drawRect(player.x,player.y,player.width,player.height);
        // this.debugGraphics.endFill();
    }
}