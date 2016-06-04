import Resources from "../Resources";
import TileLayerDisplay from "./tiled/TileLayerDisplay";
import {CityType, City, CityUtil} from "../../engine/objectTypes/City";
import LayerObjectDisplay from "./tiled/LayerObjectDisplay";
import CityDisplay from "./CityDisplay";
import EventEmitter = PIXI.EventEmitter;
import Graphics = PIXI.Graphics;
import {ShipUtil, Ship} from "../../engine/objectTypes/Ship";
import ShipDisplay from "./ShipDisplay";
import {TileProperties} from "../../engine/objectTypes/TileProperties";
import MapDisplay from "./MapDisplay";
import UIImageButton from "../controls/UIImageButton";
import * as TWEEN from "tween.js"
import {XYUtil, XY} from "../../util/Coordinates";
import * as Linq from "linq"

export default class MapOverlayDisplay extends PIXI.Container{

    moveFromPath:PIXI.Graphics;
    moveToPath:PIXI.Graphics;

    constructor(public resources:Resources, public map:MapDisplay){
        super();
        this.addChild(map);
        this.moveFromPath = this.addChild(new PIXI.Graphics());
        this.moveToPath = this.addChild(new PIXI.Graphics());

        let shadow = new PIXI.filters.DropShadowFilter();
        shadow.distance = 4;
        shadow.color = 0x333333;

        let blur = new PIXI.filters.BlurFilter();
        blur.blur = 1;
        //blur.passes = 100;

        this.moveToPath.filters = [blur, shadow];
        this.moveFromPath.filters = [shadow];
    }



    public setRenderRect(rect:{x:number, y:number, width:number, height:number}) {
        this.map.setRenderRect(rect);
    }

    getBounds(){
        return this.map.getBounds();
    }


    
    showMoveButtons(){
        this.resources.world.objectsOfType<City>(CityUtil.TypeName).forEach(city=>{


            let moveButton = this.addChild(new UIImageButton(this.resources.moveButton,()=>{
                let  intermediate = {alpha:moveButton.alpha};
                new TWEEN.Tween(intermediate).to({alpha:0},200).onUpdate(()=>{
                    moveButton.alpha = intermediate.alpha;
                }).start();
            }));
            moveButton.alpha = 0.9;
            moveButton.x = city.x + city.width/2;
            moveButton.y = city.y + city.height/2
        });
    }

    showMovePath(ship:Ship){

        let fullPath = ship.properties._moveFromPoints.concat(ship.properties._moveToPoints);

        this.moveToPath.clear();
        this.moveToPath.lineStyle(16, 0x00FF00, 1);
        this.drawDashedSpline(this.moveToPath, fullPath);
        let movePathToTravelMask = new PIXI.Graphics();
        this.moveToPath.mask = this.addChild(movePathToTravelMask);

        this.moveFromPath.clear();
        this.moveFromPath.lineStyle(16, 0x00FF00, 0.3);
        this.drawDashedSpline(this.moveFromPath, fullPath);
        let movePathTravelledMask = this.addChild(new PIXI.Graphics());
        this.moveFromPath.mask = movePathTravelledMask;
        //
        PIXI.ticker.shared.add(()=>{
            movePathTravelledMask.clear();
            movePathTravelledMask.lineStyle(24,0xFFFFFF, 1);
            this.drawSolidLine(movePathTravelledMask, ship.properties._moveFromPoints, null, ship);
            //
            movePathToTravelMask.clear();
            movePathToTravelMask.lineStyle(24,0xFFFFFF, 1);
            this.drawSolidLine(movePathToTravelMask, ship.properties._moveToPoints, ship, null);
        });

    }

    isBoundedByPoint(testPoint:XY, p1:XY, p2:XY){
        return testPoint.x <= Math.max(p1.x,p2.x) && testPoint.x >= Math.min(p1.x,p2.x) &&
        testPoint.y <= Math.max(p1.y,p2.y) && testPoint.y >= Math.min(p1.y,p2.y);
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