define(["require", "exports"], function (require, exports) {
    "use strict";
    var NinePatchButton = (function () {
        function NinePatchButton(up, down, hover) {
            if (down === void 0) { down = up; }
            if (hover === void 0) { hover = up; }
            this.up = up;
            this.down = down;
            this.hover = hover;
        }
        return NinePatchButton;
    }());
    exports.NinePatchButton = NinePatchButton;
    var ImageButton = (function () {
        function ImageButton(up, down, hover) {
            if (down === void 0) { down = up; }
            if (hover === void 0) { hover = up; }
            this.up = up;
            this.down = down;
            this.hover = hover;
        }
        return ImageButton;
    }());
    exports.ImageButton = ImageButton;
    var Resources = (function () {
        function Resources() {
            this.tileSets = {};
        }
        return Resources;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = Resources;
});
//# sourceMappingURL=Resources.js.map