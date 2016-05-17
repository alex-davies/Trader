var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./tiled/TileLayerDisplay", "../../engine/objectTypes/City", "./CityDisplay"], function (require, exports, TileLayerDisplay_1, City_1, CityDisplay_1) {
    "use strict";
    var MapDisplay = (function (_super) {
        __extends(MapDisplay, _super);
        function MapDisplay(resources) {
            var _this = this;
            _super.call(this);
            this.resources = resources;
            //we dont support other render orders for now
            var renderOrder = resources.world.state.renderorder;
            if (renderOrder != "right-down") {
                throw Error("render order '${renderOrder}' is not supported. right-down is hte only supported render order");
            }
            var map = resources.world.state;
            //load up all our tile layers
            var tileMap = this.generateTileMap(resources);
            this.background = this.addChild(new PIXI.extras.TilingSprite(tileMap[1], this.width, this.height));
            resources.world.tileLayers().forEach(function (layer) {
                var layerDisplay = new TileLayerDisplay_1.default(map, layer, tileMap);
                _this.addChild(layerDisplay);
            });
            resources.world.objectsOfType(City_1.CityType).forEach(function (city) {
                var cityDisplay = new CityDisplay_1.default(city, tileMap);
                _this.addChild(cityDisplay);
                _this.propogate(cityDisplay, "click-city");
            });
            // var gx = new PIXI.Graphics();
            // gx.lineStyle(2,0xFFFFFF,0.1);
            // for(var row = 0; row<map.height;row++){
            //     for(var col = 0; col<map.width;col++){
            //         gx.drawRect(col*map.tilewidth, row*map.tileheight, map.tilewidth, map.tileheight);
            //     }
            // }
            //
            // this.addChild(gx);
            this.debugDraw = this.addChild(new PIXI.Graphics());
        }
        MapDisplay.prototype.propogate = function (emitter, event) {
            var _me = this;
            emitter.on(event, function () {
                [].splice.call(arguments, 0, 0, event);
                _me.emit.apply(_me, arguments);
            });
        };
        MapDisplay.prototype.generateTileMap = function (resources) {
            var tileMap = {};
            this.resources.world.state.tilesets.forEach(function (tileset) {
                var baseTexture = resources.tileSets[tileset.name];
                baseTexture.scaleMode = PIXI.SCALE_MODES.NEAREST;
                var subImageIndex = 0;
                for (var y = tileset.margin; y + tileset.tileheight <= tileset.imageheight; y += tileset.tileheight + tileset.spacing) {
                    for (var x = tileset.margin; x + tileset.tilewidth <= tileset.imagewidth; x += tileset.tilewidth + tileset.spacing) {
                        var subImageRectangle = new PIXI.Rectangle(x, y, tileset.tilewidth, tileset.tileheight);
                        tileMap[tileset.firstgid + subImageIndex] = new PIXI.Texture(baseTexture, subImageRectangle);
                        subImageIndex++;
                    }
                }
            });
            return tileMap;
        };
        MapDisplay.prototype.setRenderRect = function (rect) {
            //we will adjust our background in such a way that the tilings aligns wiht our drawn tiles
            //we will also need to modify the width/height to ensure we still cover the full render area
            var xTileAligned = Math.floor(rect.x / this.background.texture.width) * this.background.texture.width;
            var xAdjustment = rect.x - xTileAligned;
            var yTileAligned = Math.floor(rect.y / this.background.texture.height) * this.background.texture.height;
            var yAdjustment = rect.y - yTileAligned;
            this.background.x = xTileAligned;
            this.background.y = yTileAligned;
            this.background.width = rect.width + xAdjustment;
            this.background.height = rect.height + yAdjustment;
        };
        MapDisplay.prototype.getLocalBounds = function () {
            var worldState = this.resources.world.state;
            return new PIXI.Rectangle(0, 0, worldState.width * worldState.tilewidth, worldState.height * worldState.tileheight);
        };
        return MapDisplay;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapDisplay;
});
//# sourceMappingURL=MapDisplay.js.map