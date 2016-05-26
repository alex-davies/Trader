var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./tiled/LayerObjectDisplay"], function (require, exports, LayerObjectDisplay_1) {
    "use strict";
    var ShipDisplay = (function (_super) {
        __extends(ShipDisplay, _super);
        function ShipDisplay(ship, tileMap) {
            var _this = this;
            _super.call(this, ship, tileMap);
            this.ship = ship;
            this.tileMap = tileMap;
            this.interactive = true;
            this.on("click", function (e) {
                e.data.selection = _this.ship;
            });
        }
        return ShipDisplay;
    }(LayerObjectDisplay_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipDisplay;
});
//# sourceMappingURL=ShipDisplay.js.map