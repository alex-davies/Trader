var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "../display/MapDisplay", "../display/Camera", "../../engine/objectTypes/City", "../controls/StackContainer", "../menus/MenuContainer", "../../engine/objectTypes/Ship", "../../engine/commands/ShipMove", "../display/MapOverlayDisplay"], function (require, exports, PIXI, MapDisplay_1, Camera_1, City_1, StackContainer_1, MenuContainer_1, Ship_1, ShipMove_1, MapOverlayDisplay_1) {
    "use strict";
    var PlayScene = (function (_super) {
        __extends(PlayScene, _super);
        function PlayScene(resources) {
            var _this = this;
            _super.call(this, -resources.menuBorder.width);
            PIXI.ticker.shared.add(function () {
                resources.world.tick(PIXI.ticker.shared.elapsedMS * PIXI.ticker.shared.speed);
            });
            this.mapDisplay = new MapDisplay_1.default(resources);
            this.mapOverlay = new MapOverlayDisplay_1.default(resources, this.mapDisplay);
            this.camera = new Camera_1.default(resources, this.mapOverlay);
            this.menuContainer = new MenuContainer_1.default(resources);
            this.mapOverlay.showMoveButtons();
            var ship = resources.world.objectOfType(Ship_1.ShipUtil.TypeName);
            resources.world.issueCommand(new ShipMove_1.default(ship, 188));
            //this.mapOverlay.showMovePath(ship);
            // let f1 = new UIContainer({horizontalAlign:"right"});
            // f1.width = 600;
            // f1.height = 900;
            // f1.addChild(new PIXI.Text("hi"));
            // this.addChild(f1, {pixels:300});
            // let c = this.addChild(new Container());
            // let t = c.addChild(new PIXI.Text("hi"));
            //
            // let bounds = c.getBounds();
            // let localBounds = c.getLocalBounds();
            //
            // t.x = 100;
            // t.y = 100;
            // let bounds2 = c.getBounds();
            // let localBounds2 = c.getLocalBounds();
            // debugger;
            this.addChild(this.menuContainer, { pixels: 300, z: 1 });
            this.addChild(this.camera, { weight: 1 });
            this.mapDisplay.on("click", function (e) {
                var objSelection = e.data.selection;
                if (City_1.CityUtil.IsCity(objSelection)) {
                    _this.menuContainer.showCityMenu(e.data.selection);
                }
            });
            setInterval(function () {
                var camera = _this.camera;
                //debugger;
            }, 5000);
        }
        return PlayScene;
    }(StackContainer_1.HContainer));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlayScene;
});
//# sourceMappingURL=PlayScene.js.map