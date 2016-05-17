var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "../display/MapDisplay", "../display/Camera", "../controls/StackContainer", "../menus/MenuContainer"], function (require, exports, PIXI, MapDisplay_1, Camera_1, StackContainer_1, MenuContainer_1) {
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
            this.camera = new Camera_1.default(resources, this.mapDisplay);
            this.menuContainer = new MenuContainer_1.default(resources);
            this.addChild(this.menuContainer, { pixels: 200, z: 1 });
            this.addChild(this.camera, { weight: 1 });
            this.mapDisplay.on("click-city", function (city) {
                _this.menuContainer.showCityMenu(city);
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