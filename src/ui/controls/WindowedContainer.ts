export default class WindowedContainer extends PIXI.Container{
    graphicsMask:PIXI.Graphics
    window:{x:number,y:number,width:number,height:number};

    constructor(window:{x:number,y:number,width:number,height:number}){
        super();
        this.graphicsMask = new PIXI.Graphics();
        this.mask = this.graphicsMask;

        this.updateWindow(window);
    }

    updateWindow(window:{x:number,y:number,width:number,height:number}){
        this.window = window;
        this.graphicsMask.clear();
        this.graphicsMask.beginFill(0x000000);
        this.graphicsMask.drawRect(window.x, window.y, window.width, window.height);
        this.graphicsMask.endFill();
    }
}