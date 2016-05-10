var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "../display/MapDisplay", "../display/Camera"], function (require, exports, PIXI, MapDisplay_1, Camera_1) {
    "use strict";
    var PlayScene = (function (_super) {
        __extends(PlayScene, _super);
        function PlayScene(resources) {
            _super.call(this);
            this.viewWidth = 0;
            this.viewHeight = 0;
            this.mapDisplay = new MapDisplay_1.default(resources);
            this.camera = new Camera_1.default(resources, this.mapDisplay);
            this.addChild(this.camera);
        }
        PlayScene.prototype.resize = function (width, height) {
            this.viewWidth = width;
            this.viewHeight = height;
            this.camera.resize(width, height);
        };
        return PlayScene;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlayScene;
});
//# sourceMappingURL=PlayScene.js.map