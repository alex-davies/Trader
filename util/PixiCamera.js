var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var Rectangle = PIXI.Rectangle;
    var PixiCamera = (function (_super) {
        __extends(PixiCamera, _super);
        function PixiCamera(scene, viewportWidth, viewportHeight) {
            _super.call(this);
            this.center = new PIXI.Point();
            this.zoom = 1;
            this.scene = scene;
            this.viewport = new Rectangle(0, 0, viewportWidth, viewportHeight);
            this.targetViewport = new Rectangle(0, 0, viewportWidth / 2, viewportHeight / 2);
            this.addChild(this.scene);
        }
        PixiCamera.prototype.update = function () {
            this.scene.x = this.viewport.x - this.targetViewport.x;
            this.scene.y = this.viewport.y - this.targetViewport.y;
            this.scene.scale.x = this.viewport.width / this.targetViewport.width;
            this.scene.scale.y = this.viewport.height / this.targetViewport.height;
        };
        return PixiCamera;
    }(PIXI.Container));
    exports.PixiCamera = PixiCamera;
    var PixiCameraTranslateInteraction = (function () {
        function PixiCameraTranslateInteraction(camera) {
            var _this = this;
            this.camera = camera;
            this.isDragging = false;
            //for some reason the camera doesnt play nice with events
            //so we will attach the event to the world itself
            camera.interactive = true;
            camera.on('mousedown', function (e) { return _this.startDrag(e); });
            camera.on('touchstart', function (e) { return _this.startDrag(e); });
            camera.on('mouseup', function (e) { return _this.stopDrag(e); });
            camera.on('touchend', function (e) { return _this.stopDrag(e); });
            camera.on('mouseupoutside', function (e) { return _this.stopDrag(e); });
            camera.on('touchendoutside', function (e) { return _this.stopDrag(e); });
            camera.on('mousemove', function (e) { return _this.doDrag(e); });
            camera.on('touchmove', function (e) { return _this.doDrag(e); });
        }
        PixiCameraTranslateInteraction.prototype.startDrag = function (e) {
            console.log(e);
            this.isDragging = true;
            this.startDragPoint = e.state.global.clone();
            this.startTargetViewport = { x: this.camera.targetViewport.x, y: this.camera.targetViewport.y };
        };
        PixiCameraTranslateInteraction.prototype.stopDrag = function (e) {
            this.isDragging = false;
            this.startDragPoint = null;
        };
        PixiCameraTranslateInteraction.prototype.doDrag = function (e) {
            if (this.startDragPoint) {
                var newPoint = e.state.global.clone();
                var pointDiffX = (newPoint.x - this.startDragPoint.x);
                var pointDiffY = (newPoint.y - this.startDragPoint.y);
                this.camera.targetViewport.x = this.startTargetViewport.x - pointDiffX;
                this.camera.targetViewport.y = this.startTargetViewport.y - pointDiffY;
                this.camera.update();
            }
        };
        return PixiCameraTranslateInteraction;
    }());
    exports.PixiCameraTranslateInteraction = PixiCameraTranslateInteraction;
});
//# sourceMappingURL=PixiCamera.js.map