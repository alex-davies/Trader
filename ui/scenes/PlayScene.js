var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "linq", 'pixi.js', "../display/MapDisplay", "../display/Camera", "../controls/StackContainer", "../menus/MenuContainer", "../../engine/objectTypes/Ship", "../display/overlay/ShipPathOverlay", "../display/overlay/ShipTravelPointsOverlay"], function (require, exports, Linq, PIXI, MapDisplay_1, Camera_1, StackContainer_1, MenuContainer_1, Ship_1, ShipPathOverlay_1, ShipTravelPointsOverlay_1) {
    "use strict";
    var PlayScene = (function (_super) {
        __extends(PlayScene, _super);
        function PlayScene(resources) {
            _super.call(this, -resources.menuBorder.width);
            PIXI.ticker.shared.add(function () {
                //we will prevent hte world from skipping ahead if tab not in focus
                var elapsedTime = Math.min(200, PIXI.ticker.shared.elapsedMS * PIXI.ticker.shared.speed);
                resources.world.tick(elapsedTime);
            });
            this.mapDisplay = new MapDisplay_1.default(resources);
            this.camera = new Camera_1.default(resources, this.mapDisplay);
            this.menuContainer = new MenuContainer_1.default(resources);
            this.addChild(this.menuContainer, { pixels: 300, z: 1 });
            this.addChild(this.camera, { weight: 1 });
            //for now we will treat the players ship as always selected
            var player = resources.world.player();
            var playerShip = resources.world.objectsOfType(Ship_1.ShipUtil.TypeName).firstOrDefault(function (s) { return s.properties.playerId === player.id; });
            if (playerShip) {
                this.mapDisplay.underObjectsOverlay.addChild(new ShipPathOverlay_1.default(resources, playerShip)).animateIn();
                this.mapDisplay.underObjectsOverlay.addChild(new ShipTravelPointsOverlay_1.default(resources, playerShip)).animateIn();
            }
            this.mapDisplay.on("selection", function (selectedItems) {
                selectedItems = selectedItems.push(playerShip);
                var items = Linq.from(selectedItems);
            });
        }
        return PlayScene;
    }(StackContainer_1.HContainer));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlayScene;
});
//# sourceMappingURL=PlayScene.js.map