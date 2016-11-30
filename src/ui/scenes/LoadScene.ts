import * as PIXI from 'pixi.js'
import Resources from "../Resources";
import World from "../../engine/World";
import DebugDraw from "../controls/DebugDraw";
import {NinePatchButton} from "../Resources";
import {ImageButton} from "../Resources";

export default class LoadScene extends PIXI.Container{
    private loadingSprite:PIXI.Sprite;
    private renderRect:{x:number,y:number,width:number,height:number};
    public minimumLoadingPageShown = 1000;
    public skipLoadingPageTimeout = 200;

    constructor(loaded:(Resources)=>void){
        super();

        //some quick loading to show a nice loading screen
        PIXI.loader.add('loadingImage','/assets/loading.png').load((loader, loadedResources)=>{

            //we will show the page soon, we dont show it immediatly as our loading might
            //be very quick, and we dont want to show the loading page unless we have to
            var pageIsShown = false;
            var showPageTimeout = setTimeout(()=>{
                this.loadingSprite = new PIXI.Sprite(loadedResources.loadingImage.texture);
                this.loadingSprite.anchor.set(0.5,0.5);
                this.addChild(this.loadingSprite);

                this.setRenderRect(this.renderRect); //resize to position our sprite
                pageIsShown = true;
            },this.skipLoadingPageTimeout)



            var startTime = new Date().getTime();

            //now we start loading the real content
            PIXI.loader
                .add('gameState', '/assets/maps/demo.json')
                .add('menuBackground', '/assets/images/backgrounds/parchment.png')
                .add('menuBorder', '/assets/images/backgrounds/shadow.png')
                .add('squareButtonUp', '/assets/images/ui/square-buySellButton.9.png')
                .add('squareButtonDown', '/assets/images/ui/square-buySellButton-down.9.png')
                .add('moveButtonUp', '/assets/images/ui/move-button-up.png')
                .add('moveButtonDown', '/assets/images/ui/move-button-down.png')
                .load((loader, loadedResources)=> {

                var resources = new Resources();
                resources.world = new World(loadedResources.gameState.data);
                resources.menuBackground = loadedResources.menuBackground.texture;
                resources.menuBorder = loadedResources.menuBorder.texture;
                resources.buySellButton = new NinePatchButton(
                    loadedResources.squareButtonUp.texture,
                    loadedResources.squareButtonDown.texture
                );
                resources.moveButton = new ImageButton(
                    loadedResources.moveButtonUp.texture,
                    loadedResources.moveButtonDown.texture
                );


                    
                    
                    

                //we now know the tilests, so we will load each of hte tilesets
                var baseDirectory = '/assets/maps/';
                resources.world.state.tilesets.forEach(tileset=>{
                    PIXI.loader.add(tileset.name,baseDirectory + tileset.image);
                });


                PIXI.loader.load((loader, loadedResources)=>{

                    resources.world.state.tilesets.forEach(tileset=>{
                        resources.tileSets[tileset.name] = loadedResources[tileset.name].texture
                    });

                    resources.tileTextures = this.generateTileMap(resources);
                    resources.cityIcon = resources.tileTextures[21];

                    var endTime = new Date().getTime();
                    var elapsedTime = endTime-startTime;
                    console.debug('Loaded resources in '+elapsedTime+'ms',loadedResources);

                    clearTimeout(showPageTimeout)





                    if(pageIsShown){
                        //if we have started showing the page we have to show it for the minimum time
                        var additionalWait = Math.max(0, this.minimumLoadingPageShown - elapsedTime);
                        setTimeout(()=>{
                            loaded(resources);
                        }, additionalWait);
                    }
                    else{
                        console.debug('resources loaded fast, will not show the loading page')
                        loaded(resources);
                    }
                });
            });


        });
    }

    public setRenderRect(rect:{x:number, y:number, width:number, height:number}){
        this.renderRect = rect;
        if(this.loadingSprite != null) {

            this.loadingSprite.x = rect.width /2;
            this.loadingSprite.y = rect.height /2;
        }
    }



    generateTileMap(resources:Resources):{[gid:number]:PIXI.Texture}{
        var tileMap:{[gid:number]:PIXI.Texture} = {};

        resources.world.state.tilesets.forEach(tileset=>{
            var baseTexture = resources.tileSets[tileset.name];
            PIXI.Texture
            baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;

            var subImageIndex = 0;
            for(var y=tileset.margin
                ; y+tileset.tileheight <= tileset.imageheight
                ; y+=tileset.tileheight+tileset.spacing) {

                for (var x = tileset.margin
                    ; x + tileset.tilewidth <= tileset.imagewidth
                    ; x += tileset.tilewidth + tileset.spacing) {

                    var subImageRectangle = new PIXI.Rectangle(x,y,tileset.tilewidth, tileset.tileheight);
                    tileMap[tileset.firstgid+subImageIndex] = new PIXI.Texture(baseTexture, subImageRectangle);

                    subImageIndex++;
                }
            }

        });

        return tileMap;
    }
}