import DisplayObject = PIXI.DisplayObject;
import Rectangle = PIXI.Rectangle;
export class PixiCamera extends PIXI.Container{

    public scene:DisplayObject;

    public center:PIXI.Point = new PIXI.Point();
    public zoom:number = 1;

    public viewport:PIXI.Rectangle;
    public targetViewport:PIXI.Rectangle;



    constructor(scene:PIXI.DisplayObject, viewportWidth:number, viewportHeight:number){
        super()
        this.scene = scene;

        this.viewport = new Rectangle(0, 0, viewportWidth, viewportHeight);
        this.targetViewport = new Rectangle(0, 0, viewportWidth / 2, viewportHeight / 2);

        this.addChild(this.scene);
    }

    update(){
        this.scene.x = this.viewport.x - this.targetViewport.x;
        this.scene.y = this.viewport.y - this.targetViewport.y;

        this.scene.scale.x = this.viewport.width / this.targetViewport.width;
        this.scene.scale.y = this.viewport.height / this.targetViewport.height;

    }


}

export class PixiCameraTranslateInteraction{
    private isDragging = false;

    private startDragPoint:{x:number, y:number}

    private startTargetViewport:{x:number, y:number}
    constructor(public camera:PixiCamera){

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
        console.log(e);
        this.isDragging = true;
        this.startDragPoint = e.state.global.clone();
        this.startTargetViewport = {x:this.camera.targetViewport.x, y:this.camera.targetViewport.y}
    }

    private stopDrag(e){
        this.isDragging = false;
        this.startDragPoint = null;
    }

    private doDrag(e){
        if(this.startDragPoint){

            var newPoint = e.state.global.clone();
            var pointDiffX = (newPoint.x - this.startDragPoint.x);
            var pointDiffY = (newPoint.y - this.startDragPoint.y);

            this.camera.targetViewport.x = this.startTargetViewport.x - pointDiffX;
            this.camera.targetViewport.y = this.startTargetViewport.y - pointDiffY;

            this.camera.update();
            //
            // var currentTarget = this.camera.target
            // this.camera.target = new PIXI.Point(currentTarget.x - pointDiffX, currentTarget.y - pointDiffY);
            // this.camera.update();
            // this.startDragPoint = newPoint.clone();
        }
    }


}