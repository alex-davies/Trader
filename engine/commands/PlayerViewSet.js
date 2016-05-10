define(["require", "exports", "engine/commands/Command"], function (require, exports, Command_1) {
    "use strict";
    var PlayerViewSet = (function () {
        function PlayerViewSet(viewRect) {
            this.viewRect = viewRect;
        }
        PlayerViewSet.prototype.execute = function (world) {
            var player = world.player();
            player.x = this.viewRect.x;
            player.y = this.viewRect.y;
            player.width = this.viewRect.width;
            player.height = this.viewRect.height;
            return Command_1.SuccessResult;
        };
        PlayerViewSet.prototype.canExecute = function (world) {
            return Command_1.SuccessResult;
        };
        return PlayerViewSet;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PlayerViewSet;
});
//# sourceMappingURL=PlayerViewSet.js.map