var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./CityMenu", "pixi.js", "../controls/PaddedContainer"], function (require, exports, CityMenu_1, PIXI, PaddedContainer_1) {
    "use strict";
    var MenuContainer = (function (_super) {
        __extends(MenuContainer, _super);
        function MenuContainer(resources) {
            _super.call(this);
            this.resources = resources;
            this.background = this.addChild(new PIXI.extras.TilingSprite(resources.menuBackground, this.width, this.height));
            this.backgroundEdge = this.addChild(new PIXI.extras.TilingSprite(resources.menuBorder, resources.menuBorder.width, this.height));
            this.content = this.addChild(new PaddedContainer_1.default(10, 10, 10, 10));
        }
        MenuContainer.prototype.setRenderRect = function (rect) {
            this.renderRect = rect;
            //we will add some padding to the right to make room for hte shadow line
            var edgeWidth = this.backgroundEdge.texture.width;
            this.background.width = rect.width - edgeWidth;
            this.background.height = rect.height;
            this.backgroundEdge.height = rect.height;
            this.backgroundEdge.width = edgeWidth;
            this.backgroundEdge.x = this.background.width;
            this.content.setRenderRect(rect);
        };
        MenuContainer.prototype.showMenu = function (newMenu) {
            this.content.removeChildren();
            this.content.addChild(newMenu);
        };
        MenuContainer.prototype.showCityMenu = function (city) {
            this.showMenu(new CityMenu_1.default(this.resources, city));
        };
        return MenuContainer;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = MenuContainer;
});
//# sourceMappingURL=MenuContainer.js.map