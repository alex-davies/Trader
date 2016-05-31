var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "pixi.js", "./AlignContainer"], function (require, exports, PIXI, AlignContainer_1) {
    "use strict";
    var UIText = (function (_super) {
        __extends(UIText, _super);
        function UIText(text, style, resolution) {
            if (style === void 0) { style = UIText.DefaultTextStyle; }
            _super.call(this);
            this.text = new PIXI.Text(text, style, resolution);
        }
        Object.defineProperty(UIText.prototype, "text", {
            get: function () {
                return this._text;
            },
            set: function (text) {
                this.removeChild(this._text);
                this._text = this.addChild(text);
            },
            enumerable: true,
            configurable: true
        });
        UIText.DefaultTextStyle = { font: "bold 20px Tahoma, Geneva, sans-serif", fill: "#333", align: "center" };
        return UIText;
    }(AlignContainer_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UIText;
});
//# sourceMappingURL=UIText.js.map