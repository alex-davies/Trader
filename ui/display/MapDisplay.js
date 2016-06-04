var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./tiled/TileLayerDisplay", "../../engine/objectTypes/City", "./CityDisplay", "../../engine/objectTypes/Ship", "./ShipDisplay", "linq", "./overlay/ShipPathOverlay"], function (require, exports, TileLayerDisplay_1, City_1, CityDisplay_1, Ship_1, ShipDisplay_1, Linq, ShipPathOverlay_1) {
    "use strict";
    var Container = PIXI.Container;
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
            //1. background
            this.background = this.addChild(new PIXI.extras.TilingSprite(resources.tileTextures[1], this.width, this.height));
            //2. tiles
            this.tileContainer = this.addChild(new Container());
            resources.world.tileLayers().forEach(function (layer) {
                var layerDisplay = new TileLayerDisplay_1.default(map, layer, resources.tileTextures);
                _this.tileContainer.addChild(layerDisplay);
            });
            //3. under object overlay
            this.underObjectsOverlay = this.addChild(new PIXI.Container());
            //4. objects
            resources.world.objectsOfType(City_1.CityUtil.TypeName).forEach(function (city) {
                var cityDisplay = new CityDisplay_1.default(city, resources.tileTextures);
                _this.addChild(cityDisplay);
            });
            this.shipContainer = this.addChild(new PIXI.Container());
            resources.world.objectsOfType(Ship_1.ShipUtil.TypeName).forEach(function (ship) {
                var cityDisplay = new ShipDisplay_1.default(ship, resources.tileTextures);
                _this.shipContainer.addChild(cityDisplay);
            });
            //4. over object overlay
            this.overObjectsOverlay = this.addChild(new PIXI.Container());
            //5. grid
            // let grid = this.addChild(new PIXI.Graphics());
            // grid.lineStyle(1,0xFFFFFF, 0.5);
            // for(let row = 0 ; row <= resources.world.state.height; row++){
            //     grid.moveTo(row*resources.world.state.tileheight,0);
            //     grid.lineTo(row*resources.world.state.tileheight, resources.world.state.width * resources.world.state.tilewidth);
            //
            // }
            // for(let col=0;col<resources.world.state.width;col++){
            //     grid.moveTo(0,col*resources.world.state.tilewidth);
            //     grid.lineTo( resources.world.state.height * resources.world.state.tileheight,col*resources.world.state.tilewidth);
            // }
            this.interactive = true;
            this.on("click", this.onClick, this);
            this.on("selection", this.onSelection, this);
        }
        MapDisplay.prototype.onSelection = function (selectedItems) {
            var items = Linq.from(selectedItems);
            var ship = items.cast().firstOrDefault(function (x) { return x.type === Ship_1.ShipUtil.TypeName; });
            //this.underObjectsOverlay.children
            this.underObjectsOverlay.children
                .filter(function (x) { return x instanceof ShipPathOverlay_1.default; })
                .forEach(function (overlay) { return overlay.emit("requestRemove"); });
            if (ship) {
                var pathOverlay = this.underObjectsOverlay.addChild(new ShipPathOverlay_1.default(ship));
            }
        };
        MapDisplay.prototype.onClick = function (e) {
            var selectedItems = [];
            var city = this.findSelectedCity(e);
            if (city)
                selectedItems.push(city);
            var ship = this.findSelectedShip(e);
            if (ship)
                selectedItems.push(ship);
            this.emit("selection", selectedItems);
        };
        MapDisplay.prototype.findSelectedCity = function (e) {
            var world = this.resources.world;
            var localPoint = this.toLocal(e.data.global);
            var tileIndex = this.resources.world.getTileIndex(localPoint);
            var partOfCityIndexes = world.getExtendedNeighbours(tileIndex, function (index) { return world.isIndexPartOfCity(index); });
            if (!partOfCityIndexes.any()) {
                return null;
            }
            var city = world.objectsOfType(City_1.CityUtil.TypeName).firstOrDefault(function (city) {
                return world.getTileIndexesInRect(city).intersect(partOfCityIndexes).any();
            });
            return city;
        };
        MapDisplay.prototype.findSelectedShip = function (e) {
            var world = this.resources.world;
            var localPoint = this.shipContainer.toLocal(e.data.global);
            var selectedShipDisplay = Linq.from(this.shipContainer.children)
                .where(function (x) {
                var localPoint = e.data.getLocalPosition(x);
                return x.getLocalBounds().contains(localPoint.x, localPoint.y);
            })
                .cast()
                .firstOrDefault();
            if (selectedShipDisplay)
                return selectedShipDisplay.ship;
            return null;
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