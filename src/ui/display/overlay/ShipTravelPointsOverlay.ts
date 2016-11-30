import * as PIXI from 'pixi.js'
import {Ship} from "../../../engine/objectTypes/Ship";
import * as TWEEN from "tween.js"
import {XY, XYUtil} from "../../../util/Coordinates";
import {ImageButton, default as Resources} from "../../Resources";
import {City, CityUtil} from "../../../engine/objectTypes/City";
import ShipMove from "../../../engine/commands/ShipMove";
import * as Linq from "linq"

export default class ShipTravelPointsOverlay extends PIXI.Container{

    private _ship;
    public get ship(){
        return this._ship;
    }

    private static Shadow = (function(){
        // let filter = new PIXI.filters.DropShadowFilter();
        // filter.distance = 4;
        // filter.color = 0x333333;
        // return filter
        return null;
    })();

    private static Blur = (function(){
        let filter = new PIXI.filters.BlurFilter();
        filter.blur = 0;
        return filter
    })();

    constructor(public resources:Resources, ship:Ship){
        super();
        this._ship = ship;

        this.on("added", this.startListening, this);
        this.on("removed", this.stopListening, this);
    }

    startListening(){
        this.resources.world.onCommand(ShipMove, this.refreshIfShipMoveIsThisShip, this);
        PIXI.ticker.shared.add(this.refresh, this);
    }

    stopListening(){
        this.resources.world.offCommand(ShipMove, this.refreshIfShipMoveIsThisShip, this);
        PIXI.ticker.shared.remove(this.refresh, this);
    }

    refreshIfShipMoveIsThisShip(shipMove:ShipMove){
        if(shipMove.ship === this.ship)
            this.refresh();
    }

    public animateIn(){
        this.refresh();
        return this;
    }

    public animateOut(complete?:()=>void){
        let childCount = this.children.length;
        let onChildRemove = ()=>{
            if(--childCount === 0) {
                this.parent.removeChild(this);
                if(complete)
                    complete();
            }
        }
        this.children.forEach((child)=>{
            let anyChild = <any>child;
            if(anyChild.animateOut) {
                anyChild.animateOut(onChildRemove);
            }
            else{
                this.removeChild(child);
                onChildRemove();
            }
        });
        return this;
    }

    public refresh(){
        let world = this.resources.world;


        world.objectsOfType<City>(CityUtil.TypeName).forEach(city=>{

            let cityTileIndex = world.getTileIndex(city);

            let shouldBeHidden = false;

            //we wont draw travel items to places where the ship already is
            shouldBeHidden = shouldBeHidden || world.getTileIndex(this.ship) === cityTileIndex

            //if the boat is already travelling to the location we will also not show the button
            let destinationPoint = this.ship.properties._moveToPoints[this.ship.properties._moveToPoints.length -1];
            shouldBeHidden = shouldBeHidden || (destinationPoint && world.getTileIndex(destinationPoint)=== cityTileIndex);

           let children = Linq.from(this.children).cast<TravelToButton>();

            //remove children that are there but shouldnt be
            children.where(child=>child.x === city.x && child.y === city.y && shouldBeHidden && !child.removing).forEach(child=>{
                child.animateOut()
            });

            //add children that are not there but should be
            if(!children.any(child=>child.x === city.x && child.y === city.y && !child.removing) && !shouldBeHidden){
                let travelButton = this.addChild(new TravelToButton(this.resources.moveButton,()=>{
                    world.issueCommand(new ShipMove(this.ship,city))
                })).animateIn();
                travelButton.x = city.x;
                travelButton.y = city.y;
            }

        })

    }
}

export class TravelToButton extends PIXI.Sprite{
removing:boolean = false;


    constructor(public textures:ImageButton, clickAction?:()=>void) {
        super(textures.up);
        this.buttonMode = true;
        this.interactive = true;

        this.anchor.x = 0.5;
        this.anchor.y = 0.5;



        if(clickAction != null)
            this.on("fire",clickAction,this);


        let preventDefault = function(e){e.stopPropagation();};
        this.on("mousedown", preventDefault);
        this.on("mouseup", preventDefault);
        this.on("click", preventDefault);

        this.on("mouseup", this.fire, this);

    }

    fire(e){
        this.emit("fire")
        this.texture = this.textures.down;
    }


    animateIn(){
        this.alpha = 0;
        let alpha = {alpha:0}
        new TWEEN.Tween(alpha).to({alpha:1}, 150)
            .onUpdate(k=>this.alpha = alpha.alpha)
            .start();

        return this;
    }

    animateOut(complete?:()=>void){
        this.removing = true;
        let alpha = {alpha:1}
        new TWEEN.Tween(alpha).to({alpha:0}, 150)
            .onUpdate(k=>this.alpha = alpha.alpha)
            .onComplete(()=>{
                this.parent.removeChild(this);
                if(complete)
                    complete.call(this);
            })
            .start();

        return this;
    }

}