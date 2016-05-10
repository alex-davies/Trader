var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../util/Monitor", "../../engine/commands/PlayerViewSet", "../../util/Interactions", "../../util/Coordinates"], function (require, exports, Monitor_1, PlayerViewSet_1, Interactions_1, Coordinates_1) {
    "use strict";
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera(resources, target, minZoom, maxZoom) {
            var _this = this;
            if (minZoom === void 0) { minZoom = 0.3; }
            if (maxZoom === void 0) { maxZoom = 3; }
            _super.call(this);
            this.resources = resources;
            this.target = target;
            this.minZoom = minZoom;
            this.maxZoom = maxZoom;
            this.debugGraphics = new PIXI.Graphics();
            this.addChild(target);
            this.addChild(this.debugGraphics);
            //makre sure we update whenever hte player view changes
            new Monitor_1.ChangeMonitor(function () {
                var player = resources.world.player();
                return { x: player.x, y: player.y, width: player.width, height: player.height };
            }, function () { return _this.updateCamera(); });
            //setup the panning
            Interactions_1.panable(this);
            this.on('panmove', function (event) {
                var world = _this.resources.world;
                var player = world.player();
                var scaleX = _this.screenWidth / player.width;
                var scaleY = _this.screenHeight / player.height;
                var newViewRect = _this.adjustViewRectToFitScreen({
                    x: player.x - event.deltaX / scaleX,
                    y: player.y - event.deltaY / scaleY,
                    width: player.width,
                    height: player.height });
                world.IssueCommand(new PlayerViewSet_1.default(newViewRect));
            });
            //setup the zooming
            Interactions_1.pinchable(this);
            this.on('pinchmove', function (event) {
                //TODO: need to get on phone to implment and test this
            });
            var onWheel = function (event) {
                var delta = event.wheelDelta || -event.detail;
                var local_pt = new PIXI.Point();
                var point = new PIXI.Point(event.pageX, event.pageY);
                PIXI.interaction.InteractionData.prototype.getLocalPosition(_this, local_pt, point);
                var factor = delta < 0 ? 1.1 : 1 / 1.1;
                var world = _this.resources.world;
                var player = world.player();
                var newViewRect = _this.adjustViewRectToFitScreen(Coordinates_1.XYUtil.scaleRect(player, factor, local_pt));
                world.IssueCommand(new PlayerViewSet_1.default(newViewRect));
            };
            document.addEventListener('DOMMouseScroll', onWheel.bind(this)); // Firefox
            document.addEventListener('mousewheel', onWheel.bind(this)); // Not Firefox
        }
        /***
         * creates a new rectangle that meets the following criteria
         *  * matches the screen width/height ratio
         *  * total zoom is between min and max zoom
         *  * fits inside the world rect
         * @param viewRect
         * @param worldRect
         * @param screenWidth
         * @param screenHeight
         * @param minZoom
         * @param maxZoom
         * @returns {{x: number, y: number, width: number, height: number}}
         */
        Camera.prototype.adjustViewRectToFitScreen = function (viewRect, worldRect, screenWidth, screenHeight, minZoom, maxZoom) {
            worldRect = worldRect || { x: 0, y: 0, width: this.target.width, height: this.target.height };
            screenWidth = screenWidth || this.screenWidth;
            screenHeight = screenHeight || this.screenHeight;
            minZoom = minZoom || this.minZoom;
            maxZoom = maxZoom || this.maxZoom;
            var newViewRect = { x: viewRect.x, y: viewRect.y, width: viewRect.width, height: viewRect.height };
            //make our view box the same ratio as the screen
            var screenHeightToWidthRatio = screenWidth / screenHeight;
            var viewRectHeightToWidthRatio = newViewRect.width / newViewRect.height;
            if (screenHeightToWidthRatio !== viewRectHeightToWidthRatio) {
                //ratios not hte same we need tochagne either height or width
                var diffWidth = Math.abs(screenWidth - newViewRect.width);
                var diffHeight = Math.abs(screenHeight - newViewRect.height);
                if (diffWidth > diffHeight) {
                    newViewRect = Coordinates_1.XYUtil.scaleRect(newViewRect, { x: newViewRect.height * screenHeightToWidthRatio / newViewRect.width, y: 1 });
                }
                else {
                    newViewRect = Coordinates_1.XYUtil.scaleRect(newViewRect, { x: 1, y: newViewRect.width / screenHeightToWidthRatio / newViewRect.height });
                }
            }
            //make sure we are within our zoom bounds
            var scaleX = screenWidth / newViewRect.width;
            var scaleY = screenHeight / newViewRect.height;
            var requiredZoom = Math.min(scaleX, scaleY);
            if (requiredZoom > maxZoom) {
                newViewRect = Coordinates_1.XYUtil.scaleRect(newViewRect, requiredZoom / maxZoom);
            }
            if (requiredZoom < minZoom) {
                newViewRect = Coordinates_1.XYUtil.scaleRect(newViewRect, requiredZoom / minZoom);
            }
            //move hte view box around so it fits within the world
            //i.e we cant see outside of the map
            if (newViewRect.width > worldRect.width)
                newViewRect.width = worldRect.width;
            if (newViewRect.height > worldRect.height)
                newViewRect.height = worldRect.height;
            if (newViewRect.x < worldRect.x)
                newViewRect.x = worldRect.x;
            if (newViewRect.y < worldRect.y)
                newViewRect.y = worldRect.y;
            if (newViewRect.x + newViewRect.width > worldRect.x + worldRect.width)
                newViewRect.x = worldRect.x + worldRect.width - newViewRect.width;
            if (newViewRect.y + newViewRect.height > worldRect.y + worldRect.height)
                newViewRect.y = worldRect.y + worldRect.height - newViewRect.height;
            //console.debug("",screenWidth,  newViewRect.width);
            return newViewRect;
        };
        Camera.prototype.resize = function (width, height) {
            this.screenWidth = width;
            this.screenHeight = height;
            var player = this.resources.world.player();
            //screen has changed so we need to update our vie to fit the screen
            var newViewRect = this.adjustViewRectToFitScreen(player);
            this.resources.world.IssueCommand(new PlayerViewSet_1.default(newViewRect));
        };
        Camera.prototype.updateCamera = function () {
            //center our screen on the player
            var player = this.resources.world.player();
            //pivot around the center of our view box, this makes
            //zooming a bit simpler
            this.pivot.x = player.x + player.width / 2;
            this.pivot.y = player.y + player.height / 2;
            //center it on the screen
            this.x = this.screenWidth / 2;
            this.y = this.screenHeight / 2;
            //scale so get at least the players view area in
            var scaleX = this.screenWidth / player.width;
            var scaleY = this.screenHeight / player.height;
            this.scale.x = scaleX;
            this.scale.y = scaleY;
            // this.debugGraphics.clear();
            // this.debugGraphics.lineStyle(2, 0xFF0000);
            //
            // this.debugGraphics.beginFill(0xFF0000, 0.5);
            // this.debugGraphics.drawRect(player.x,player.y,player.width,player.height);
            // this.debugGraphics.endFill();
        };
        return Camera;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Camera;
});
//# sourceMappingURL=Camera.js.map