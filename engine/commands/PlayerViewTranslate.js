define(["require", "exports", "./Command"], function (require, exports, Command_1) {
    "use strict";
    var PlayerViewTranslate = (function () {
        function PlayerViewTranslate(dx, dy) {
            this.dx = dx;
            this.dy = dy;
        }
        PlayerViewTranslate.prototype.execute = function (world) {
            var player = world.player();
            player.x += this.dx;
            player.y += this.dy;
            return Command_1.SuccessResult;
        };
        PlayerViewTranslate.prototype.canExecute = function (world) {
            return Command_1.SuccessResult;
        };
        return PlayerViewTranslate;
    }());
    exports.PlayerViewTranslate = PlayerViewTranslate;
});
//# sourceMappingURL=PlayerViewTranslate.js.map