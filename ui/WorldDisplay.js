var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js'], function (require, exports, PIXI) {
    "use strict";
    var WorldDisplay = (function (_super) {
        __extends(WorldDisplay, _super);
        function WorldDisplay(world) {
            _super.call(this);
            this.world = world;
        }
        return WorldDisplay;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WorldDisplay;
});
//# sourceMappingURL=WorldDisplay.js.map