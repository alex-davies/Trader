var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "./tiled/TileLayerDisplay"], function (require, exports, PIXI, TileLayerDisplay_1) {
    "use strict";
    var TraderTileLayerDisplay = (function (_super) {
        __extends(TraderTileLayerDisplay, _super);
        function TraderTileLayerDisplay(map, layer, tileMap) {
            _super.call(this);
            for (var i = 0; i < layer.data.length; i++) {
                var gid = layer.data[i];
                var texture = tileMap[gid];
                //let properties = 
                //only draw the item if we actuall yhave a texture
                if (texture) {
                    var tileCol = i % layer.width;
                    var tileRow = Math.floor(i / layer.height);
                    var sprite = new PIXI.Sprite(texture);
                    //we will position based on the bottom right tile when the tileset is multiple tiles high
                    sprite.pivot.y = texture.height - map.tileheight;
                    sprite.x = map.tilewidth * tileCol;
                    sprite.y = map.tileheight * tileRow;
                    this.addChild(sprite);
                }
            }
        }
        return TraderTileLayerDisplay;
    }(TileLayerDisplay_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = TraderTileLayerDisplay;
});
//# sourceMappingURL=TraderTileLayerDisplay.js.map