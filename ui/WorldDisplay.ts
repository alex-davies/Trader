import * as PIXI from 'pixi.js'
import World from 'engine/World';
import DisplayObject = PIXI.DisplayObject;


export default class WorldDisplay extends PIXI.Container {

    constructor(public world: World) {
        super();

      

    }
}