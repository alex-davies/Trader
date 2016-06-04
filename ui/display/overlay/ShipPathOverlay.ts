import * as PIXI from 'pixi.js'
import {Ship} from "../../../engine/objectTypes/Ship";
import * as TWEEN from "tween.js"
import {XY, XYUtil} from "../../../util/Coordinates";

export default class ShipPathOverlay extends PIXI.Container{

    private _ship;
    public get ship(){
        return this._ship;
    }

    private static Shadow = (function(){
        let filter = new PIXI.filters.DropShadowFilter();
        filter.distance = 4;
        filter.color = 0x333333;
        return filter
    })();

    private static Blur = (function(){
        let filter = new PIXI.filters.BlurFilter();
        filter.blur = 1;
        return filter
    })();

    private moveFromPath:PIXI.Graphics;
    private moveToPath:PIXI.Graphics;

    constructor(ship:Ship){
        super();
        this._ship = ship;

        this.on("added", ()=>{
            this.setUp();

            this.alpha = 0;
            let alpha = {alpha:0}
            new TWEEN.Tween(alpha).to({alpha:1}, 100)
                .onUpdate(k=>this.alpha = alpha.alpha)
                .start();
        },this);

        this.on("requestRemove", ()=>{
            let alpha = {alpha:1}
            new TWEEN.Tween(alpha).to({alpha:0}, 100)
                .onUpdate(k=>this.alpha = alpha.alpha)
                .onComplete(()=>this.parent.removeChild(this))
                .start();
        })
        this.on("removed", this.tearDown, this);


    }

    public setUp(){
        this.removeChildren();


        this.moveFromPath = this.addChild(new PIXI.Graphics());
        this.moveToPath = this.addChild(new PIXI.Graphics());
        this.moveToPath.filters = [ShipPathOverlay.Blur, ShipPathOverlay.Shadow];
        this.moveFromPath.filters = [ShipPathOverlay.Blur, ShipPathOverlay.Shadow];

        let fullPath = this.ship.properties._moveFromPoints.concat(this.ship.properties._moveToPoints);

        this.moveToPath.clear();
        this.moveToPath.lineStyle(16, 0x00FF00, 1);
        this.drawDashedSpline(this.moveToPath, fullPath);
        let movePathToTravelMask = new PIXI.Graphics();
        this.moveToPath.mask = this.addChild(movePathToTravelMask);

        this.moveFromPath.clear();
        this.moveFromPath.lineStyle(16, 0x00FF00, 0.3);
        this.drawDashedSpline(this.moveFromPath, fullPath);
        let movePathTravelledMask = this.addChild(new PIXI.Graphics());
        this.moveFromPath.mask = this.addChild(movePathTravelledMask);

        PIXI.ticker.shared.add(this.refreshTravelMasks, this);
    }

    public tearDown(){
        PIXI.ticker.shared.remove(this.refreshTravelMasks, this);
    }


    private refreshTravelMasks(){
        let moveFromPathMask = <PIXI.Graphics>this.moveFromPath.mask;
        moveFromPathMask.clear();
        moveFromPathMask.lineStyle(24,0xFFFFFF, 1);
        this.drawSolidLine(moveFromPathMask, this.ship.properties._moveFromPoints, null, this.ship);

        let moveToPathMask = <PIXI.Graphics>this.moveToPath.mask;
        moveToPathMask.clear();
        moveToPathMask.lineStyle(24,0xFFFFFF, 1);
        this.drawSolidLine(moveToPathMask, this.ship.properties._moveToPoints, this.ship, null);
    }

    private drawSolidLine(graphics:PIXI.Graphics, path:{x:number,y:number}[], firstPoint?:XY, lastPoint?:XY){
        //its a bit odd to have first and last point arguments. This was done prevent having to build a new
        //array when calling this method. this method is called on every animation frame

        if(path.length === 0)
            return;

        let iStart = 0;
        if(firstPoint != null){
            graphics.moveTo(firstPoint.x, firstPoint.y);
            iStart = 0;
        }else{
            graphics.moveTo(path[0].x,path[0].y);
            iStart = 1;
        }

        for(let i=iStart;i<path.length;i++){
            graphics.lineTo(path[i].x, path[i].y);
        }

        if(lastPoint != null)
            graphics.lineTo(lastPoint.x, lastPoint.y);
    }

    private drawDashedSpline(graphics:PIXI.Graphics, path:{x:number,y:number}[]){

        if(path.length === 0)
            return;

        //high resolution will give nicer turns in the line and make the line
        //segments more equal in length, but slows down processing
        let resolution = 4;

        let dashLineSize = 30;
        let gapLineSize = 10;

        //we are abusing a tween to do all the interpolation here for us
        //we set up the tween and manually update its time and draw the lines
        let point = {x:path[0].x,y:path[0].y};
        let totalProgress = path.length * resolution;
        let abusedTween = new TWEEN.Tween(point)
            .to({x:path.map(p=>p.x),y:path.map(p=>p.y)},totalProgress)
            .interpolation(TWEEN.Interpolation.CatmullRom);
        TWEEN.remove(abusedTween);


        graphics.moveTo(point.x,point.y);
        let isLineDrawing = true;
        let drawingLength = 0;
        let previousPoint = {x:point.x,y:point.y};

        for(let progress=1;progress<totalProgress;progress++){

            abusedTween.update(progress);
            if(isLineDrawing) {
                graphics.lineTo(point.x, point.y);
            }
            else{
                graphics.moveTo(point.x, point.y);
            }
            drawingLength += XYUtil.distance(previousPoint, point);
            if(drawingLength > (isLineDrawing?dashLineSize:gapLineSize)){
                isLineDrawing = !isLineDrawing;
                drawingLength = 0;
            }


            previousPoint.x = point.x;
            previousPoint.y = point.y;
        }
    }



}