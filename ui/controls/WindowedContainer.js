var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var WindowedContainer = (function (_super) {
        __extends(WindowedContainer, _super);
        function WindowedContainer(window) {
            _super.call(this);
            this.graphicsMask = new PIXI.Graphics();
            this.mask = this.graphicsMask;
            this.updateWindow(window);
        }
        WindowedContainer.prototype.updateWindow = function (window) {
            this.window = window;
            this.graphicsMask.clear();
            this.graphicsMask.beginFill(0x000000);
            this.graphicsMask.drawRect(window.x, window.y, window.width, window.height);
            this.graphicsMask.endFill();
        };
        return WindowedContainer;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = WindowedContainer;
});
//# sourceMappingURL=WindowedContainer.js.map