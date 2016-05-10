define(["require", "exports", "../../engine/commands/PlayerViewSet"], function (require, exports, PlayerViewSet_1) {
    "use strict";
    var CameraTranslateInteraction = (function () {
        function CameraTranslateInteraction(camera) {
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
        CameraTranslateInteraction.prototype.startDrag = function (e) {
            this.isDragging = true;
            this.startDragPoint = e.data.global.clone();
        };
        CameraTranslateInteraction.prototype.stopDrag = function (e) {
            this.isDragging = false;
            this.startDragPoint = null;
        };
        CameraTranslateInteraction.prototype.doDrag = function (e) {
            if (this.startDragPoint) {
                var world = this.camera.resources.world;
                var player = world.player();
                var scaleX = this.camera.screenWidth / player.width;
                var scaleY = this.camera.screenHeight / player.height;
                var newPoint = e.data.global.clone();
                var pointDiffX = (newPoint.x - this.startDragPoint.x) / scaleX; //this.camera.zoom;
                var pointDiffY = (newPoint.y - this.startDragPoint.y) / scaleY; //this.camera.zoom;
                var newViewRect = this.camera.adjustViewRectToFitScreen({
                    x: player.x - pointDiffX,
                    y: player.y - pointDiffY,
                    width: player.width,
                    height: player.height });
                world.IssueCommand(new PlayerViewSet_1.default(newViewRect));
                this.startDragPoint = newPoint.clone();
            }
        };
        return CameraTranslateInteraction;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CameraTranslateInteraction;
});
//# sourceMappingURL=CameraTranslateInteraction.js.map