import {XY} from "../../util/Coordinates";
import {XYUtil} from "../../util/Coordinates";
import {PlayerViewTranslate} from "../../engine/commands/PlayerViewTranslate";
import Camera from "../display/Camera";
import PlayerViewSet from "../../engine/commands/PlayerViewSet";
export default class CameraTranslateInteraction{
    private isDragging = false;

    private startDragPoint:XY

    constructor(public camera:Camera){

        //for some reason the camera doesnt play nice with events
        //so we will attach the event to the world itself
        camera.interactive = true;

        camera.on('mousedown', e=>this.startDrag(e));
        camera.on('touchstart', e=>this.startDrag(e));


        camera.on('mouseup', e=>this.stopDrag(e));
        camera.on('touchend', e=>this.stopDrag(e));
        camera.on('mouseupoutside', e=>this.stopDrag(e));
        camera.on('touchendoutside', e=>this.stopDrag(e));

        camera.on('mousemove', e=>this.doDrag(e));
        camera.on('touchmove', e=>this.doDrag(e));
    }

    private startDrag(e){
        this.isDragging = true;
        this.startDragPoint = e.data.global.clone()
    }

    private stopDrag(e){
        this.isDragging = false;
        this.startDragPoint = null;
    }

    private doDrag(e){
        if(this.startDragPoint){
            var world = this.camera.resources.world;
            var player = world.player();

            var scaleX = this.camera.screenWidth / player.width;
            var scaleY = this.camera.screenHeight / player.height;

            var newPoint = e.data.global.clone();
            var pointDiffX = (newPoint.x - this.startDragPoint.x) / scaleX//this.camera.zoom;
            var pointDiffY = (newPoint.y - this.startDragPoint.y) / scaleY//this.camera.zoom;


            var newViewRect = this.camera.adjustViewRectToFitScreen({
                x:player.x  - pointDiffX,
                y:player.y  - pointDiffY,
                width:player.width,
                height:player.height});


            world.IssueCommand(new PlayerViewSet(newViewRect));
            
            this.startDragPoint = newPoint.clone();
        }
    }


}