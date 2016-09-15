import * as PIXI from 'pixi.js'
import {Ship} from "../../../engine/objectTypes/Ship";
import * as TWEEN from "tween.js"
import {XY, XYUtil} from "../../../util/Coordinates";
import ShipMove from "../../../engine/commands/ShipMove";
import Resources from "../../Resources";


export default class ShipPathOverlay extends PIXI.Container {
    constructor(public resources:Resources, public ship:Ship) {
        super();

        this.on("added", this.startListening, this);
        this.on("removed", this.stopListening, this);

        this.addChild(new ShipPath(resources,ship));

    }

    startListening() {
        this.resources.world.onCommand(ShipMove, this.recreatePathIfShipMoveIsThisShip, this);
    }

    stopListening() {
        this.resources.world.offCommand(ShipMove, this.recreatePathIfShipMoveIsThisShip, this);
    }


    recreatePathIfShipMoveIsThisShip(shipMove:ShipMove) {
        if (shipMove.ship === this.ship) {
            this.children.forEach(child=>(<ShipPath>child).animateOut())
            this.addChild(new ShipPath(this.resources, this.ship)).animateIn();
        }
    }

    animateIn() {
        this.alpha = 0;
        let alpha = {alpha: 0}
        new TWEEN.Tween(alpha).to({alpha: 1}, 100)
            .onUpdate(k=>this.alpha = alpha.alpha)
            .start();

        return this;
    }

    animateOut(complete?:()=>void) {
        let alpha = {alpha: 1}
        new TWEEN.Tween(alpha).to({alpha: 0}, 100)
            .onUpdate(k=>this.alpha = alpha.alpha)
            .onComplete(()=> {
                this.parent.removeChild(this)
                if (complete)
                    complete();
            })
            .start();

        return this;
    }
}


class ShipPath extends PIXI.Container{
    private _ship;
    public get ship() {
        return this._ship;
    }

    private static Shadow = (function () {
        let filter = new PIXI.filters.DropShadowFilter();
        filter.distance = 4;
        filter.color = 0x333333;
        return filter
    })();

    private static Blur = (function () {
        let filter = new PIXI.filters.BlurFilter();
        filter.blur = 1;
        return filter
    })();

    private moveFromPath:PIXI.Graphics;
    private moveFromPathMask:PIXI.Graphics;
    private moveToPath:PIXI.Graphics;
    private moveToPathMask:PIXI.Graphics;
    removing:boolean = false;

    constructor(public resources:Resources, ship:Ship) {
        super();
        this._ship = ship;

        this.moveFromPath = this.addChild(new PIXI.Graphics());
        this.moveFromPath.filters = [ShipPath.Blur, ShipPath.Shadow];
        this.moveFromPathMask = this.addChild(new PIXI.Graphics());
        this.moveFromPath.mask = this.moveFromPathMask;

        this.moveToPath = this.addChild(new PIXI.Graphics());
        this.moveToPath.filters = [ShipPath.Blur, ShipPath.Shadow];
        this.moveToPathMask = this.addChild(new PIXI.Graphics());
        this.moveToPath.mask = this.moveToPathMask;

        this.on("added", this.startListening, this);
        this.on("removed", this.stopListening, this);

        this.refreshPath();

    }

    startListening() {
        PIXI.ticker.shared.add(this.refreshPathProgress, this);
    }

    stopListening() {
        PIXI.ticker.shared.remove(this.refreshPathProgress, this);
    }


    refreshPathIfShipMoveIsThisShip(shipMove:ShipMove) {
        if (shipMove.ship === this.ship)
            this.refreshPath();
    }

    animateIn() {
        this.alpha = 0;
        let alpha = {alpha: 0}
        new TWEEN.Tween(alpha).to({alpha: 1}, 200)
            .onUpdate(k=>this.alpha = alpha.alpha)
            .start();

        return this;
    }

    animateOut(complete?:()=>void) {
        let alpha = {alpha: this.alpha};
        this.removing = true;
        new TWEEN.Tween(alpha).to({alpha: 0}, 200)
            .onUpdate(k=>this.alpha = alpha.alpha)
            .onComplete(()=> {
                this.parent.removeChild(this)
                if (complete)
                    complete();
            })
            .start();

        return this;
    }


    refreshPath() {
        let fullPath = this.ship.properties._moveFromPoints.concat(this.ship.properties._moveToPoints);

        //we will draw the line back ward so the end can always hav a dot and a space
        fullPath.reverse();
        this.moveToPath.clear();
        this.moveToPath.lineStyle(12, 0x00FF00, 1);
        this.drawDashedSpline(this.moveToPath, fullPath);
        if (fullPath.length > 0) {
            let lastPoint = fullPath[0];
            this.moveToPath.beginFill(0x00FF00);
            this.moveToPath.drawCircle(lastPoint.x, lastPoint.y, 4);
            this.moveToPath.endFill();
        }


        this.moveFromPath.clear();
        this.moveFromPath.lineStyle(12, 0x00FF00, 0.3);
        this.drawDashedSpline(this.moveFromPath, fullPath);


        this.refreshPathProgress();
    }

    refreshPathProgress() {

        //if there is no path to draw we will remove ourselves
        if (this.ship.properties._moveToPoints.length === 0 && this.ship.properties._moveFromPoints.length === 0) {
            if(!this.removing)
                this.animateOut();
            return;
        }

        this.moveFromPathMask.clear();
        this.moveFromPathMask.lineStyle(24, 0xFFFFFF, 1);
        this.drawSolidLine(this.moveFromPathMask, this.ship.properties._moveFromPoints, null, this.ship);

        this.moveToPathMask.clear();
        this.moveToPathMask.lineStyle(24, 0xFFFFFF, 1);
        this.drawSolidLine(this.moveToPathMask, this.ship.properties._moveToPoints, this.ship, null);
        if (this.ship.properties._moveToPoints.length > 0) {
            let lastPoint = this.ship.properties._moveToPoints[this.ship.properties._moveToPoints.length - 1];
            this.moveToPathMask.beginFill(0xFFFFFF);
            this.moveToPathMask.drawCircle(lastPoint.x, lastPoint.y, 4);
            this.moveToPathMask.endFill();
        }
    }

    private drawSolidLine(graphics:PIXI.Graphics, path:{x:number,y:number}[], firstPoint?:XY, lastPoint?:XY) {
        //its a bit odd to have first and last point arguments. This was done prevent having to build a new
        //array when calling this method. this method is called on every animation frame

        if (path.length === 0)
            return;

        let iStart = 0;
        if (firstPoint != null) {
            graphics.moveTo(firstPoint.x, firstPoint.y);
            iStart = 0;
        } else {
            graphics.moveTo(path[0].x, path[0].y);
            iStart = 1;
        }

        for (let i = iStart; i < path.length; i++) {
            graphics.lineTo(path[i].x, path[i].y);
        }

        if (lastPoint != null)
            graphics.lineTo(lastPoint.x, lastPoint.y);
    }

    private drawDashedSpline(graphics:PIXI.Graphics, path:{x:number,y:number}[]) {

        if (path.length === 0)
            return;

        //high resolution will give nicer turns in the line and make the line
        //segments more equal in length, but slows down processing
        let resolution = 4;

        let dashLineSize = 20;
        let gapLineSize = 10;

        //we are abusing a tween to do all the interpolation here for us
        //we set up the tween and manually update its time and draw the lines
        let point = {x: path[0].x, y: path[0].y};
        let totalProgress = path.length * resolution;
        let abusedTween = new TWEEN.Tween(point)
            .to({x: path.map(p=>p.x), y: path.map(p=>p.y)}, totalProgress)
            .interpolation(TWEEN.Interpolation.CatmullRom);
        TWEEN.remove(abusedTween);


        graphics.moveTo(point.x, point.y);
        let isLineDrawing = false;
        let drawingLength = 0;
        let previousPoint = {x: point.x, y: point.y};

        for (let progress = 1; progress < totalProgress; progress++) {

            abusedTween.update(progress);
            if (isLineDrawing) {
                graphics.lineTo(point.x, point.y);
            }
            else {
                graphics.moveTo(point.x, point.y);
            }
            drawingLength += XYUtil.distance(previousPoint, point);
            if (drawingLength > (isLineDrawing ? dashLineSize : gapLineSize)) {
                isLineDrawing = !isLineDrawing;
                drawingLength = 0;
            }


            previousPoint.x = point.x;
            previousPoint.y = point.y;
        }
    }


}
