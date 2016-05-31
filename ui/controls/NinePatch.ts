import * as PIXI from "pixi.js"
import Sprite = PIXI.Sprite;
import DisplayObject = PIXI.DisplayObject;
import Util from "../../util/Util";
import DebugDraw from "./DebugDraw";
import UIContainer from "./UIContainer";

export default class NinePatch extends PIXI.Container{



    private patchRowCount:number;
    private patchColCount:number;

    private patchSprites:PIXI.Sprite[][] = [];

    private totalStretchableWidth:number = 0;
    private totalFixedWidth:number = 0;

    private totalStretchableHeight:number = 0;
    private totalFixedHeight:number = 0;

    public content:PIXI.Container;

    private _paddingTop:number =0;
    public get paddingTop() { return this._paddingTop; }
    public set paddingTop(value:number){
        this.setPadding(value, this._paddingRight, this._paddingBottom, this._paddingLeft);
    }
    private _paddingRight:number =0;
    public get paddingRight() { return this._paddingRight; }
    public set paddingRight(value:number){
        this.setPadding(this._paddingTop, value, this._paddingBottom, this._paddingLeft);
    }
    private _paddingBottom:number =0;
    public get paddingBottom() { return this._paddingBottom; }
    public set paddingBottom(value:number){
        this.setPadding(this._paddingTop, this._paddingRight, value, this._paddingLeft);
    }
    private _paddingLeft:number =0;
    public get paddingLeft() { return this._paddingLeft; }
    public set paddingLeft(value:number){
        this.setPadding(this._paddingTop, this._paddingRight, this._paddingBottom, value);
    }

    private _patches;
    public get patches(){ return this._patches; }
    public set patches(patches:PIXI.Texture[][]){
        this.loadFromPatchArray(patches);
    }

    public get width() { return this.content.width + this.paddingLeft + this.paddingRight;}
    public set width(value:number) {
        this.content.width = Math.max(0,value - this.paddingLeft - this.paddingRight);
        this.relayout();
    }
    public get height() { return this.content.height + this.paddingTop + this.paddingBottom;}
    public set height(value:number) {
        this.content.height = Math.max(0,value - this.paddingTop - this.paddingBottom);
        this.relayout();
    }


    constructor(content:PIXI.Container = new PIXI.Container()){
        super();

        //add our content, this should always be the last child
        //we will also listen to new children on our content and
        //relayout, new children usually mean the size will change
        this.content = super.addChild(content);
        (<any>this.content).onChildrenChange = ()=>{
            this.relayout();
        };
    }

    public setPadding(paddingTop:number, paddingRight:number, paddingBottom:number, paddingLeft:number){
        this._paddingTop = paddingTop;
        this._paddingRight = paddingRight;
        this._paddingBottom = paddingBottom;
        this._paddingLeft = paddingLeft;

        this.relayout();

        return this;
    }

    loadFromPatchArray(patches:PIXI.Texture[][]):NinePatch{
        this._patches = patches;

        //textures changed so remove all sprites except our content
        if(this.children.length > 1)
            super.removeChildren(0, this.children.length-1);
        this.patchSprites = [];

        this.patchRowCount = patches.length;
        this.patchColCount = patches.length === 0 ? 0 : patches[0].length;

        //All rows must have same number of pathces
        for(let row=0;row<this.patchRowCount;row++){
            let colsInRow = patches[row].length;
            if(colsInRow != this.patchColCount)
                throw Error("All rows must have the same number of patches");
        }

        //to continue our processing we need to wait till all the textures are loaded.
        //if any one texture errors, or is not loading we will not show any border
        let patchesToLoad = this.patchRowCount * this.patchColCount;
        let markOnePatchLoaded = ()=>{
            if(--patchesToLoad <= 0)
                this.processLoadedTextures(patches)
        };
        let forgetAboutLoadingImages = function(){
            console.error("Failed to load NinePatch texture, keeping all images hidden", this);
            for(let row=0;row<this.patchRowCount;row++) {
                for (let col = 0; col < this.patchColCount; col++) {
                    let patch = patches[row][col];
                    patch.baseTexture.off("loaded", markOnePatchLoaded);
                    patch.baseTexture.off("error", forgetAboutLoadingImages);
                }
            }
        };

        for(let row=0;row<this.patchRowCount;row++) {
            for (let col = 0; col < this.patchColCount; col++) {
                let patch = patches[row][col];
                let baseTexture = patch.baseTexture;

                if(baseTexture.hasLoaded){
                    markOnePatchLoaded();
                }
                else if(baseTexture.isLoading){
                    baseTexture.once("loaded",markOnePatchLoaded);
                    baseTexture.once("error",forgetAboutLoadingImages);

                }
                else{
                    //not loaded and not going to, will clean up
                    //and forgot about showing any image
                    forgetAboutLoadingImages();

                    //Hacky double break;
                    row = this.patchRowCount;
                    col = this.patchColCount
                }
            }
        }

        return this;
    }



    public loadFromAndroidImage(android9PatchImage:PIXI.Texture):NinePatch {

        let baseTexture = android9PatchImage.baseTexture;
        if (baseTexture.hasLoaded) {
            let data = NinePatch.ExtractDataFromAndroidImageFormatWithLoadedTexture(android9PatchImage);
            this.loadFromPatchArray(data.textures);
            this.setPadding(data.paddingTop,data.paddingRight, data.paddingBottom,data.paddingLeft);

        }
        else if (baseTexture.isLoading) {
            baseTexture.once("loaded", ()=>{
                let data = NinePatch.ExtractDataFromAndroidImageFormatWithLoadedTexture(android9PatchImage);
                this.loadFromPatchArray(data.textures);
                this.setPadding(data.paddingTop,data.paddingRight, data.paddingBottom,data.paddingLeft);
            });
        }

        return this;
    }

    private processLoadedTextures(patches:PIXI.Texture[][]){
        //All patches in a row should have the same height
        for(let row=0;row<this.patchRowCount;row++){
            let rowHeight = this.patchColCount > 0 ? patches[row][0].height : 0;
            for(let col=0;col<this.patchColCount;col++){
                if(rowHeight !== patches[row][col].height)
                    throw Error("All patches in a row must have the same height");

            }
        }

        //All patches in a column must have the same width
        for(let col=0;col<this.patchColCount;col++){
            let colWidth = this.patchRowCount > 0 ? patches[0][col].width : 0;
            for(let row=0;row<this.patchRowCount;row++){
                if(colWidth !== patches[row][col].width)
                    throw Error("All patches in a column must have the same width");
            }
        }


        //we need to determine how much of the width is stretchable and how much is fixed
        this.totalStretchableWidth = 0;
        this.totalFixedWidth = 0;
        if(this.patchRowCount > 0) {
            for (let col = 0; col < this.patchColCount; col++) {
                let width = patches[0][col].width;
                let stretchX = col % 2 == 1;
                if (stretchX)
                    this.totalStretchableWidth += width;
                else
                    this.totalFixedWidth += width;
            }
        }


        //we need to determine how much of the height is stretchable and how much is fixed
        this.totalStretchableHeight = 0;
        this.totalFixedHeight = 0;
        if(this.patchColCount > 0) {
            for (let row = 0; row < this.patchRowCount; row++) {
                let height = patches[row][0].height;
                let stretchY = row % 2 == 1;
                if (stretchY)
                    this.totalStretchableHeight += height;
                else
                    this.totalFixedHeight += height;
            }
        }

        //Convert our textures into sprites, removing everything but the content
        if(this.children.length > 1)
            super.removeChildren(0,this.children.length-1);
        this.patchSprites = new Array(this.patchRowCount);
        for(let row=0;row<this.patchRowCount;row++){
            this.patchSprites[row] = new Array(this.patchColCount);
            for(let col=0;col<this.patchColCount;col++){
                let sprite = super.addChildAt(new Sprite(patches[row][col]),0); //insert the sprite before the content
                this.patchSprites[row][col] = sprite;
                sprite.anchor.set(0,0);
            }
        }

        this.relayout();
    }

    public relayout(){

        this.content.x = this.paddingLeft;
        this.content.y = this.paddingTop;

        let targetWidth = this.content.width + this.paddingLeft + this.paddingRight;
        let targetHeight = this.content.height + this.paddingTop + this.paddingBottom;

        //we wont let the target height be smaller than the original 9patches
        targetWidth = Math.max(targetWidth, this.totalFixedWidth + this.totalStretchableWidth);
        targetHeight = Math.max(targetHeight, this.totalFixedHeight + this.totalStretchableHeight);

        let runningYOffset = 0;
        for(let row=0;row< this.patchSprites.length;row++){
            let stretchY = row % 2 === 1;
            let runningXOffset = 0;
            for(let col=0;col<this.patchSprites[row].length;col++){
                let stretchX = col % 2 === 1;

                //stretch our image appropriatly
                let sprite = this.patchSprites[row][col];
                if(stretchX){
                    sprite.width = sprite.texture.width / this.totalStretchableWidth * (targetWidth - this.totalFixedWidth);
                }
                if(stretchY){
                    sprite.height = sprite.texture.height / this.totalStretchableHeight * (targetHeight - this.totalFixedHeight);
                }

                //position our sprite
                sprite.x = runningXOffset;
                sprite.y = runningYOffset;
                runningXOffset += sprite.width;
            }

            runningYOffset += this.patchColCount > 0 ? this.patchSprites[row][0].height : 0;
        }
    }

    getBounds(){
        return new PIXI.Rectangle(
            0,
            0,
            this.content.width + this.paddingLeft+this.paddingRight,
            this.content.height+this.paddingTop+this.paddingBottom);
    }


    get contentChildren(){
        //the children array is the only thing I cant forward requests as PIXI uses it internally
        //so when dealing with a NinePatch you should not access children array, instad access
        //the contentChildren array
        return this.content.children;
    }
    set contentChildren(children:PIXI.DisplayObject[]){
        this.content.children = children;
    }

    addChild<T extends PIXI.DisplayObject>(child:T):T{
        return this.content.addChild.apply(this.content, arguments);
    }
    addChildAt<T extends PIXI.DisplayObject>(child: T, index: number): T{
        return this.content.addChildAt.apply(this.content, arguments);
    }
    swapChildren(child: PIXI.DisplayObject, child2: DisplayObject): void{
        return this.content.swapChildren.apply(this.content, arguments);
    }
    getChildIndex(child: PIXI.DisplayObject): number{
        return this.content.getChildIndex.apply(this.content, arguments);
    }
    setChildIndex(child: PIXI.DisplayObject, index: number): void{
        return this.content.setChildIndex.apply(this.content, arguments);
    }
    getChildAt(index: number): PIXI.DisplayObject{
        return this.content.getChildAt.apply(this.content, arguments);
    }
    removeChild<T extends PIXI.DisplayObject>(child: T): T{
        return this.content.removeChild.apply(this.content, arguments);
    }
    removeChildAt(index: number): PIXI.DisplayObject{
        return this.content.removeChildAt.apply(this.content, arguments);
    }
    removeChildren(beginIndex?: number, endIndex?: number): PIXI.DisplayObject[]{
        return this.content.removeChildren.apply(this.content, arguments);
    }










    private static AndroidNinePatchDataCache:{[key:string]:NinePatchData} = {};

    private static ExtractDataFromAndroidImageFormatWithLoadedTexture(android9PatchImage:PIXI.Texture):NinePatchData {

        //try and get hte data out of a cache first, processing these images is not cheap
        let cacheKey = android9PatchImage.baseTexture.imageUrl+"?" +[
                "x="+android9PatchImage.frame.x,
                "y="+android9PatchImage.frame.y,
                "width="+android9PatchImage.frame.width,
                "heigh="+android9PatchImage.frame.height
            ].join("&");
        var cacheValue = this.AndroidNinePatchDataCache[cacheKey];
        if(cacheValue)
            return cacheValue;


        //we cant access Texture pixel data directly, but we can draw it out to a canvas
        //and access it there
        let canvasRenderer = new PIXI.CanvasRenderer(android9PatchImage.width, android9PatchImage.height, {transparent:true});
        canvasRenderer.render(new PIXI.Sprite(android9PatchImage));
        let ctx = canvasRenderer.context;


        let horizontalPixelData = ctx.getImageData(0,0, android9PatchImage.width, 1).data;
        let horizontalMarkers = this.CalculateMarkers(horizontalPixelData,1,1);

        let verticalPixelData = ctx.getImageData(0,0, 1, android9PatchImage.height).data;
        let verticalMarkers = this.CalculateMarkers(horizontalPixelData,1,1);

        let horizontalPaddingPixelData = ctx.getImageData(0,android9PatchImage.height-1, android9PatchImage.width, 1).data;
        let horizontalPaddingMarkers = this.CalculateMarkers(horizontalPaddingPixelData,1,1);
        if(horizontalPaddingMarkers.length < 4)
            horizontalPaddingMarkers = horizontalMarkers;

        let verticalPaddingPixelData = ctx.getImageData(android9PatchImage.width-1,0, 1,android9PatchImage.height).data;
        let verticalPaddingMarkers = this.CalculateMarkers(verticalPaddingPixelData,1,1);
        if(verticalPaddingMarkers.length < 4)
            verticalPaddingMarkers = verticalMarkers;


        //we can now turn our horizontal and vertical markers into rectangle frames
        //on the orignal base image
        let textures:PIXI.Texture[][] = new Array(verticalMarkers.length-1);
        for(let vMarkerIndex=0;vMarkerIndex<verticalMarkers.length-1;vMarkerIndex++) {
            textures[vMarkerIndex] = new Array(horizontalMarkers.length-1);
            for (let hMarkerIndex = 0; hMarkerIndex < horizontalMarkers.length - 1; hMarkerIndex++) {
                let rect = new PIXI.Rectangle(
                    horizontalMarkers[hMarkerIndex],
                    verticalMarkers[vMarkerIndex],
                    horizontalMarkers[hMarkerIndex + 1] - horizontalMarkers[hMarkerIndex],
                    verticalMarkers[vMarkerIndex + 1] - verticalMarkers[vMarkerIndex]
                );
                textures[vMarkerIndex][hMarkerIndex] = new PIXI.Texture(android9PatchImage, rect);
            }
        }


        //now we turn our padding markers into padding values

        let paddingTop = 0;
        let paddingRight = 0;
        let paddingBottom = 0;
        let paddingLeft = 0;

        if(horizontalPaddingMarkers.length >= 4){
            paddingLeft = horizontalPaddingMarkers[1] - horizontalPaddingMarkers[0];
            paddingRight = horizontalPaddingMarkers[horizontalPaddingMarkers.length - 1] - horizontalPaddingMarkers[horizontalPaddingMarkers.length - 2];
        }
        if(verticalPaddingMarkers.length >= 4){
            paddingTop = verticalPaddingMarkers[1] - verticalPaddingMarkers[0];
            paddingBottom = verticalPaddingMarkers[verticalPaddingMarkers.length - 1] - verticalPaddingMarkers[verticalPaddingMarkers.length - 2];
        }


        let data = {
            textures:textures,
            paddingTop:paddingTop,
            paddingRight:paddingRight,
            paddingBottom: paddingBottom,
            paddingLeft:paddingLeft
        }
        this.AndroidNinePatchDataCache[cacheKey] = data;
        return data;
    }

    private static CalculateMarkers(imageData:Uint8ClampedArray, pixelStartOffset:number, pixelEndOffset:number){
        //markers are just positions when the image starts or stops a black line
        //we also add one at the beggining and one at the end

        let markers = [pixelStartOffset];
        let previousActive = false;
        for(let i=pixelStartOffset*4;i<imageData.length - pixelEndOffset*4;i+=4){
            let isActive =  imageData[i] === 0 && imageData[i+1] === 0 && imageData[i+2] === 0 && imageData[i+3] === 255;
            if(isActive != previousActive)
                markers.push(i/4);
            previousActive = isActive;
        }
        markers.push((imageData.length / 4) - pixelEndOffset);

        return markers
    }

}

interface NinePatchData {textures:PIXI.Texture[][], paddingTop:number, paddingRight:number, paddingBottom:number, paddingLeft:number};