var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var TileLayerDisplay = (function (_super) {
        __extends(TileLayerDisplay, _super);
        function TileLayerDisplay(layer, tileMap) {
            _super.call(this);
            for (var i = 0; i < layer.data.length; i++) {
                var texture = tileMap[layer.data[i]];
                //only draw the item if we actuall yhave a texture
                if (texture) {
                    var tileCol = i % layer.width;
                    var tileRow = Math.floor(i / layer.height);
                    var sprite = new PIXI.Sprite(texture);
                    sprite.x = texture.width * tileCol;
                    sprite.y = texture.height * tileRow;
                    this.addChild(sprite);
                }
            }
        }
        return TileLayerDisplay;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TileLayerDisplay;
});
//# sourceMappingURL=TileLayerDisplay.js.map