var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../util/Util", "../../util/Interactions", "../../util/Coordinates", "../../engine/commands/PlayerLookAt"], function (require, exports, Util_1, Interactions_1, Coordinates_1, PlayerLookAt_1) {
    "use strict";
    var Camera = (function (_super) {
        __extends(Camera, _super);
        function Camera(resources, target, minZoom, maxZoom) {
            var _this = this;
            if (minZoom === void 0) { minZoom = 1; }
            if (maxZoom === void 0) { maxZoom = 1; }
            _super.call(this);
            this.resources = resources;
            this.target = target;
            this.minZoom = minZoom;
            this.maxZoom = maxZoom;
            this.debugGraphics = new PIXI.Graphics();
            this.addChild(target);
            this.addChild(this.debugGraphics);
            this.renderRect = { x: 0, y: 0, width: this.width, height: this.height };
            this.resources.world.onCommand(PlayerLookAt_1.default, function () { return _this.lookAtPlayer(); });
            //setup the panning
            Interactions_1.panable(this);
            this.on('panmove', function (event) {
                var newLookAt = _this.constrainLookAt({
                    x: _this.target.pivot.x - event.deltaX,
                    y: _this.target.pivot.y - event.deltaY
                });
                _this.resources.world.IssueCommand(new PlayerLookAt_1.default(newLookAt));
            });
        }
        Camera.prototype.lookAtPlayer = function () {
            //center our screen on the player
            var player = this.resources.world.player();
            this.lookAt({
                x: player.x + player.width / 2,
                y: player.y + player.height / 2
            });
            //this.lookAt({x:0,y:0});
            // this.target.pivot.x = Math.floor(player.x + player.width / 2);
            // this.target.pivot.y = Math.floor(player.y + player.height / 2);
            //
            // this.target.x = Math.floor(this.renderRect.width / 2) ;
            // this.target.y = Math.floor(this.renderRect.height / 2) ;
        };
        Camera.prototype.lookAt = function (point) {
            //console.log(point);
            point = this.constrainLookAt(point);
            this.target.pivot.x = Math.floor(point.x);
            this.target.pivot.y = Math.floor(point.y);
            this.target.x = Math.floor(this.renderRect.width / 2);
            this.target.y = Math.floor(this.renderRect.height / 2);
            this.setChildRenderRect();
        };
        Camera.prototype.constrainLookAt = function (point) {
            var viewRect = {
                x: point.x - this.renderRect.width / 2,
                y: point.y - this.renderRect.height / 2,
                width: this.renderRect.width,
                height: this.renderRect.height
            };
            var worldRect = {
                x: 0,
                y: 0,
                width: this.target.width,
                height: this.target.height
            };
            viewRect = this.constrainRect(viewRect, worldRect);
            return {
                x: viewRect.x + viewRect.width / 2,
                y: viewRect.y + viewRect.height / 2
            };
        };
        Camera.prototype.constrainRect = function (rect, constraint) {
            if (rect.width < constraint.width) {
                //view rect is within the constraint
                if (rect.x < constraint.x)
                    rect.x = constraint.x;
                if (rect.x + rect.width > constraint.x + constraint.width)
                    rect.x = constraint.x + constraint.width - rect.width;
            }
            else if (rect.width >= constraint.width) {
                //view rect contains the constract
                if (rect.x > constraint.x)
                    rect.x = constraint.x;
                if (rect.x + rect.width < constraint.x + constraint.width)
                    rect.x = constraint.x + constraint.width - rect.width;
            }
            if (rect.height < constraint.height) {
                //view rect is within the constraint
                if (rect.y < constraint.y)
                    rect.y = constraint.y;
                if (rect.y + rect.height > constraint.y + constraint.height)
                    rect.y = constraint.y + constraint.height - rect.height;
            }
            else if (rect.height >= constraint.height) {
                //view rect contains the constraint
                if (rect.y > constraint.y)
                    rect.y = constraint.y;
                if (rect.y + rect.height < constraint.y + constraint.height)
                    rect.y = constraint.y + constraint.height - rect.height;
            }
            return rect;
        };
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
            screenWidth = screenWidth || this.renderRect.width;
            screenHeight = screenHeight || this.renderRect.height;
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
        Camera.prototype.setRenderRect = function (rect) {
            this.renderRect = rect;
            this.lookAtPlayer();
            this.lookAtPlayer();
        };
        Camera.prototype.setChildRenderRect = function () {
            Util_1.default.TrySetRenderRect(this.target, {
                x: this.target.pivot.x - this.target.x,
                y: this.target.pivot.y - this.target.y,
                width: this.renderRect.width, height: this.renderRect.height });
        };
        return Camera;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Camera;
});
//# sourceMappingURL=Camera.js.map