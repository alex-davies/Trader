var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./tiled/TileLayerDisplay", "../../engine/objectTypes/City", "./CityDisplay", "../../engine/objectTypes/Ship", "./ShipDisplay"], function (require, exports, TileLayerDisplay_1, City_1, CityDisplay_1, Ship_1, ShipDisplay_1) {
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
            this.background = this.addChild(new PIXI.extras.TilingSprite(resources.tileTextures[1], this.width, this.height));
            resources.world.tileLayers().forEach(function (layer) {
                var layerDisplay = new TileLayerDisplay_1.default(map, layer, resources.tileTextures);
                _this.addChild(layerDisplay);
            });
            resources.world.objectsOfType(City_1.CityUtil.TypeName).forEach(function (city) {
                var cityDisplay = new CityDisplay_1.default(city, resources.tileTextures);
                _this.addChild(cityDisplay);
            });
            resources.world.objectsOfType(Ship_1.ShipUtil.TypeName).forEach(function (ship) {
                var cityDisplay = new ShipDisplay_1.default(ship, resources.tileTextures);
                _this.addChild(cityDisplay);
            });
            this.interactive = true;
            this.on("click", this.onClick, this);
        }
        MapDisplay.prototype.onClick = function (e) {
            var world = this.resources.world;
            var localPoint = this.toLocal(e.data.global);
            var tileIndex = this.resources.world.getTileIndex(localPoint);
            var partOfCityIndexes = world.getExtendedNeighbours(tileIndex, function (index) { return world.isIndexPartOfCity(index); });
            if (!partOfCityIndexes.any()) {
                return;
            }
            var city = world.objectsOfType(City_1.CityUtil.TypeName).firstOrDefault(function (city) {
                return world.getTileIndexesInRect(city).intersect(partOfCityIndexes).any();
            });
            e.data.selection = city;
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
        MapDisplay.prototype.getBounds = function () {
            var worldState = this.resources.world.state;
            return new PIXI.Rectangle(0, 0, worldState.width * worldState.tilewidth, worldState.height * worldState.tileheight);
        };
        return MapDisplay;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MapDisplay;
});
//# sourceMappingURL=MapDisplay.js.map