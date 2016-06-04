var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "pixi.js"], function (require, exports, PIXI) {
    "use strict";
    var UIImageButton = (function (_super) {
        __extends(UIImageButton, _super);
        function UIImageButton(textures, clickAction) {
            _super.call(this, textures.up);
            this.textures = textures;
            this.buttonMode = true;
            this.interactive = true;
            this.anchor.x = 0.5;
            this.anchor.y = 0.5;
            if (clickAction != null)
                this.on("fire", clickAction, this);
            this.on("mousedown", this.fire, this);
        }
        UIImageButton.prototype.fire = function () {
            this.emit("fire");
            this.texture = this.textures.down;
        };
        return UIImageButton;
    }(PIXI.Sprite));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UIImageButton;
});
//# sourceMappingURL=UIImageButton.js.map