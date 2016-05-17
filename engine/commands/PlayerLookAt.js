define(["require", "exports", "engine/commands/Command"], function (require, exports, Command_1) {
    "use strict";
    var PlayerLookAt = (function () {
        function PlayerLookAt(point, zoom) {
            if (zoom === void 0) { zoom = 1; }
            this.point = point;
            this.zoom = zoom;
            point.x = Math.floor(point.x);
            point.y = Math.floor(point.y);
        }
        PlayerLookAt.prototype.execute = function (world) {
            var player = world.player();
            player.x = this.point.x - player.width / 2;
            player.y = this.point.y - player.height / 2;
            return Command_1.SuccessResult;
        };
        PlayerLookAt.prototype.canExecute = function (world) {
            return Command_1.SuccessResult;
        };
        return PlayerLookAt;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlayerLookAt;
});
//# sourceMappingURL=PlayerLookAt.js.map