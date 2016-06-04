var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js'], function (require, exports, PIXI) {
    "use strict";
    var ShipDisplay = (function (_super) {
        __extends(ShipDisplay, _super);
        function ShipDisplay(ship, tileMap) {
            var _this = this;
            _super.call(this, tileMap[37]);
            this.ship = ship;
            this.tileMap = tileMap;
            this.pivot.x = this.texture.width / 2;
            this.pivot.y = this.texture.height / 2;
            this.x = ship.x;
            this.y = ship.y;
            PIXI.ticker.shared.add(function () {
                var newx = ship.x;
                var newy = ship.y;
                if (_this.x > newx)
                    _this.scale.x = 1;
                else if (_this.x < newy)
                    _this.scale.x = -1;
                _this.x = newx;
                _this.y = newy;
            });
            // this.interactive = true;
            // this.on("click", (e)=>{
            //     e.data.selection = (e.data.selection || [])
            //     e.data.selection.push(this.ship);
            // })
        }
        return ShipDisplay;
    }(PIXI.Sprite));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipDisplay;
});
//# sourceMappingURL=ShipDisplay.js.map