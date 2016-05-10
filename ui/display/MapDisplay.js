var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./TileLayerDisplay"], function (require, exports, TileLayerDisplay_1) {
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
            //load up all our tile layers
            var tileMap = this.generateTileMap(resources);
            resources.world.tileLayers().forEach(function (layer) {
                var layerDisplay = new TileLayerDisplay_1.default(layer, tileMap);
                _this.addChild(layerDisplay);
            });
        }
        MapDisplay.prototype.generateTileMap = function (resources) {
            var tileMap = {};
            this.resources.world.state.tilesets.forEach(function (tileset) {
                var baseTexture = resources.tileSets[tileset.name];
                var subImageIndex = 0;
                for (var y = tileset.margin; y + tileset.tileheight <= tileset.imageheight; y += tileset.tileheight + tileset.spacing) {
                    for (var x = tileset.margin; x + tileset.tilewidth <= tileset.imagewidth; x += tileset.tilewidth + tileset.spacing) {
                        var subImageRectangle = new PIXI.Rectangle(x, y, tileset.tilewidth, tileset.tileheight);
                        tileMap[tileset.firstgid + subImageIndex] = new PIXI.Texture(baseTexture, subImageRectangle);
                        var test;
                        subImageIndex++;
                    }
                }
            });
            return tileMap;
        };
        return MapDisplay;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapDisplay;
});
//# sourceMappingURL=MapDisplay.js.map