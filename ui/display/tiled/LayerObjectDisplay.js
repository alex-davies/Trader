var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js'], function (require, exports, PIXI) {
    "use strict";
    var LayerObjectDisplay = (function (_super) {
        __extends(LayerObjectDisplay, _super);
        function LayerObjectDisplay(layerObject, tileMap) {
            _super.call(this);
            this.layerObject = layerObject;
            this.tileMap = tileMap;
            this.pivot.y = layerObject.height;
            this.x = layerObject.x;
            this.y = layerObject.y;
            if (layerObject.gid) {
                var texture = tileMap[layerObject.gid];
                var sprite = new PIXI.Sprite(texture);
                sprite.scale.x = layerObject.width / texture.width;
                sprite.scale.y = layerObject.height / texture.height;
                this.addChild(sprite);
            }
        }
        return LayerObjectDisplay;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = LayerObjectDisplay;
});
//# sourceMappingURL=LayerObjectDisplay.js.map