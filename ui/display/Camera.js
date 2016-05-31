var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../util/Util", "../../util/Interactions", "../../engine/commands/PlayerLookAt", "../controls/UIContainer"], function (require, exports, Util_1, Interactions_1, PlayerLookAt_1, UIContainer_1) {
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
            this.addChild(target);
            this.resources.world.onCommand(PlayerLookAt_1.default, function () { return _this.lookAtPlayer(); });
            //setup the panning
            Interactions_1.panable(this);
            this.on('panmove', function (event) {
                var newLookAt = _this.constrainLookAt({
                    x: _this.target.pivot.x - event.deltaX,
                    y: _this.target.pivot.y - event.deltaY
                });
                _this.resources.world.issueCommand(new PlayerLookAt_1.default(newLookAt));
            });
        }
        Camera.prototype.relayout = function () {
            this.lookAtPlayer();
            this.setChildRenderRect();
        };
        Camera.prototype.lookAtPlayer = function () {
            //center our screen on the player
            var player = this.resources.world.player();
            this.lookAt({
                x: player.x + player.width / 2,
                y: player.y + player.height / 2
            });
        };
        Camera.prototype.lookAt = function (point) {
            //console.log(point);
            point = this.constrainLookAt(point);
            this.target.pivot.x = Math.floor(point.x);
            this.target.pivot.y = Math.floor(point.y);
            this.target.x = Math.floor(this.width / 2);
            this.target.y = Math.floor(this.height / 2);
            this.setChildRenderRect();
        };
        Camera.prototype.constrainLookAt = function (point) {
            var viewRect = {
                x: point.x - this.width / 2,
                y: point.y - this.height / 2,
                width: this.width,
                height: this.height
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
        Camera.prototype.setChildRenderRect = function () {
            Util_1.default.TrySetRenderRect(this.target, {
                x: this.target.pivot.x - this.target.x,
                y: this.target.pivot.y - this.target.y,
                width: this.width, height: this.height });
        };
        return Camera;
    }(UIContainer_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Camera;
});
//# sourceMappingURL=Camera.js.map