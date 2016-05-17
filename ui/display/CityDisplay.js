var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./tiled/LayerObjectDisplay"], function (require, exports, LayerObjectDisplay_1) {
    "use strict";
    var CityDisplay = (function (_super) {
        __extends(CityDisplay, _super);
        function CityDisplay(city, tileMap) {
            var _this = this;
            _super.call(this, city, tileMap);
            this.city = city;
            this.tileMap = tileMap;
            this.interactive = true;
            this.on("click", function () {
                _this.emit("click-city", city);
            });
        }
        return CityDisplay;
    }(LayerObjectDisplay_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CityDisplay;
});
//# sourceMappingURL=CityDisplay.js.map