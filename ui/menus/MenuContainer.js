var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../util/Util", "./CityMenu", "pixi.js"], function (require, exports, Util_1, CityMenu_1, PIXI) {
    "use strict";
    var MenuContainer = (function (_super) {
        __extends(MenuContainer, _super);
        function MenuContainer(resources) {
            _super.call(this);
            this.resources = resources;
            this.background = new PIXI.extras.TilingSprite(resources.menuBackground, this.width, this.height);
            this.addChild(this.background);
            this.backgroundEdge = new PIXI.extras.TilingSprite(resources.menuBorder, resources.menuBorder.width, this.height);
            this.addChild(this.backgroundEdge);
        }
        MenuContainer.prototype.setRenderRect = function (rect) {
            this.renderRect = rect;
            //we will add some padding to the right to make room for hte shadow line
            var paddingRight = this.backgroundEdge.texture.width;
            this.background.width = rect.width - paddingRight;
            this.background.height = rect.height;
            this.backgroundEdge.height = rect.height;
            this.backgroundEdge.width = paddingRight;
            this.backgroundEdge.x = this.background.width;
            Util_1.default.TrySetRenderRect(this.currentMenu, { x: 0, y: 0, width: this.background.width, height: rect.height });
        };
        MenuContainer.prototype.showMenu = function (newMenu) {
            this.removeChild(this.currentMenu);
            this.currentMenu = newMenu;
            this.addChild(newMenu);
            Util_1.default.TrySetRenderRect(this.currentMenu, { x: 0, y: 0, width: this.background.width, height: this.renderRect.height });
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