var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "../controls/NinePatch"], function (require, exports, PIXI, NinePatch_1) {
    "use strict";
    var DebugScene = (function (_super) {
        __extends(DebugScene, _super);
        function DebugScene() {
            _super.call(this);
            this.numberAdded = 0;
            this.spacePerPatch = 100;
            // this.addEmptyPatch();
            // this.addDynamicLoadPatch();
            // this.addFailedLoadPatch();
            //
            // this.addPreloadedPatch();
            //this.addAndroidPatch();
            this.addAndroidPatchWithHover();
        }
        DebugScene.prototype.addEmptyPatch = function () {
            var emptyPatch = new NinePatch_1.default().setPadding(20, 20, 20, 20);
            emptyPatch.addChild(new PIXI.Text("patch with no textures"));
            emptyPatch.y = (this.numberAdded++) * this.spacePerPatch;
            this.addChild(emptyPatch);
        };
        DebugScene.prototype.addDynamicLoadPatch = function () {
            var dynamicLoadPatch = new NinePatch_1.default().loadFromPatchArray([
                [
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_01.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_02.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_03.png")
                ],
                [
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_04.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_05.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_06.png")
                ],
                [
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_07.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_08.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_09.png")
                ]
            ]).setPadding(20, 20, 20, 20);
            dynamicLoadPatch.addChild(new PIXI.Text("dynamic load patch"));
            dynamicLoadPatch.y = (this.numberAdded++) * this.spacePerPatch;
            this.addChild(dynamicLoadPatch);
        };
        DebugScene.prototype.addFailedLoadPatch = function () {
            var failedLoadPatch = new NinePatch_1.default().loadFromPatchArray([
                [
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_01.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_02.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_03.png")
                ],
                [
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_04.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_05.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_06.png")
                ],
                [
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_07.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_xx.png"),
                    PIXI.Texture.fromImage("/assets/images/backgrounds/button_09.png")
                ]
            ]).setPadding(20, 20, 20, 20);
            failedLoadPatch.addChild(new PIXI.Text("failed load patch"));
            failedLoadPatch.y = (this.numberAdded++) * this.spacePerPatch;
            this.addChild(failedLoadPatch);
        };
        DebugScene.prototype.addPreloadedPatch = function () {
            var _this = this;
            var yValue = (this.numberAdded++) * this.spacePerPatch;
            PIXI.loader
                .add('b1', '/assets/images/backgrounds/button_01.png')
                .add('b2', '/assets/images/backgrounds/button_02.png')
                .add('b3', '/assets/images/backgrounds/button_03.png')
                .add('b4', '/assets/images/backgrounds/button_04.png')
                .add('b5', '/assets/images/backgrounds/button_05.png')
                .add('b6', '/assets/images/backgrounds/button_06.png')
                .add('b7', '/assets/images/backgrounds/button_07.png')
                .add('b8', '/assets/images/backgrounds/button_08.png')
                .add('b9', '/assets/images/backgrounds/button_09.png')
                .load(function (loader, res) {
                var preloadedPatch = new NinePatch_1.default().loadFromPatchArray([
                    [res.b1.texture, res.b2.texture, res.b3.texture],
                    [res.b4.texture, res.b5.texture, res.b6.texture],
                    [res.b7.texture, res.b8.texture, res.b9.texture]
                ]).setPadding(20, 20, 20, 20);
                preloadedPatch.addChild(new PIXI.Text("Preloaded patch"));
                preloadedPatch.y = yValue;
                _this.addChild(preloadedPatch);
            });
        };
        DebugScene.prototype.addAndroidPatch = function () {
            var _this = this;
            var yValue = (this.numberAdded++) * this.spacePerPatch;
            PIXI.loader
                .add('button', '/assets/images/backgrounds/button.9.png')
                .load(function (loader, res) {
                var androidPatch = new NinePatch_1.default().loadFromAndroidImage(res.button.texture);
                androidPatch.addChild(new PIXI.Text("android patch"));
                androidPatch.y = yValue;
                _this.addChild(androidPatch);
            });
        };
        DebugScene.prototype.addAndroidPatchWithHover = function () {
            var _this = this;
            var yValue = (this.numberAdded++) * this.spacePerPatch;
            PIXI.loader
                .add('button', '/assets/images/backgrounds/button.9.png')
                .add('buttonGreen', '/assets/images/backgrounds/button-green.9.png')
                .load(function (loader, res) {
                var androidPatch = new NinePatch_1.default().loadFromAndroidImage(res.button.texture);
                androidPatch.interactive = true;
                _this.buttonMode = true;
                androidPatch.on("mousedown", function () {
                    this.loadFromAndroidImage(res.buttonGreen.texture);
                });
                androidPatch.on("mouseup", function () {
                    this.loadFromAndroidImage(res.button.texture);
                });
                androidPatch.on("mouseupoutside", function () {
                    this.loadFromAndroidImage(res.button.texture);
                });
                androidPatch.on("mouseclick", function () {
                    alert('hi');
                });
                androidPatch.addChild(new PIXI.Text("android patch"));
                androidPatch.y = yValue;
                _this.addChild(androidPatch);
            });
        };
        return DebugScene;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DebugScene;
});
//# sourceMappingURL=DebugScene.js.map