var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "pixi.js", "./AlignContainer"], function (require, exports, PIXI, AlignContainer_1) {
    "use strict";
    var UISprite = (function (_super) {
        __extends(UISprite, _super);
        function UISprite(texture) {
            _super.call(this);
            this.sprite = new PIXI.Sprite(texture);
        }
        Object.defineProperty(UISprite.prototype, "sprite", {
            get: function () {
                return this._sprite;
            },
            set: function (sprite) {
                this.removeChild(this._sprite);
                this._sprite = this.addChild(sprite);
            },
            enumerable: true,
            configurable: true
        });
        return UISprite;
    }(AlignContainer_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UISprite;
});
//# sourceMappingURL=UISprite.js.map