var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./NinePatch", "./UIContainer", "tween.js"], function (require, exports, NinePatch_1, UIContainer_1, TWEEN) {
    "use strict";
    var UINinePatchButton = (function (_super) {
        __extends(UINinePatchButton, _super);
        function UINinePatchButton(textures, text, clickAction) {
            _super.call(this);
            this.textures = textures;
            this.text = text;
            this.buttonMode = true;
            this.interactive = true;
            this.upNinePatch = this.addChildWithoutRelayout(new NinePatch_1.default(new UIContainer_1.default()).loadFromAndroidImage(textures.up));
            this.downNinePatch = this.addChildWithoutRelayout(new NinePatch_1.default(new UIContainer_1.default()).loadFromAndroidImage(textures.down));
            this.content = this.addChildWithoutRelayout(text);
            this.downNinePatch.alpha = 1;
            if (clickAction != null)
                this.on("fire", clickAction, this);
            this.on("mousedown", this.fire, this);
            this.relayout();
        }
        UINinePatchButton.prototype.fire = function () {
            this.downNinePatch.alpha = 0;
            this.emit("fire");
            new TWEEN.Tween(this.downNinePatch)
                .to({ alpha: 1 }, 300)
                .start();
        };
        UINinePatchButton.prototype.relayout = function () {
            this.upNinePatch.width = this.width;
            this.upNinePatch.height = this.height;
            this.downNinePatch.width = this.width;
            this.downNinePatch.height = this.height;
            this.content.width = this.upNinePatch.content.width;
            this.content.height = this.upNinePatch.content.height;
            this.content.x = this.upNinePatch.content.x;
            this.content.y = this.upNinePatch.content.y;
        };
        return UINinePatchButton;
    }(UIContainer_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = UINinePatchButton;
});
//# sourceMappingURL=UINinePatchButton.js.map