var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../engine/objectTypes/Properties", "linq", "../controls/StackContainer", "../../engine/commands/CityHarvest"], function (require, exports, Properties_1, Linq, StackContainer_1, CityHarvest_1) {
    "use strict";
    var CityMenu = (function (_super) {
        __extends(CityMenu, _super);
        function CityMenu(resources, city) {
            var _this = this;
            _super.call(this);
            this.resources = resources;
            this.city = city;
            this.content = new StackContainer_1.VContainer();
            this.addChild(this.content);
            var updateFn = this.update.bind(this);
            this.on("added", function () {
                _this.resources.world.onCommand(CityHarvest_1.default, updateFn);
            });
            this.on("removed", function () {
                _this.resources.world.offCommand(CityHarvest_1.default, updateFn);
            });
        }
        CityMenu.prototype.update = function () {
            var _this = this;
            var textOptions = { font: "bold 20px Tahoma, Geneva, sans-serif", fill: "#DDDDDD", align: "center", stroke: "#AAAAAA", strokeThickness: 2 };
            this.content.removeChildren();
            if (this.city) {
                this.content.addChild(new PIXI.Text(this.city.name, textOptions));
                Linq.from(this.city.properties)
                    .where(function (kvp) { return Properties_1.Properties.IsInventory(kvp.key); }).forEach(function (kvp) {
                    var resourceName = Properties_1.Properties.InventoryResourceName(kvp.key);
                    _this.content.addChild(new PIXI.Text(resourceName + ":" + kvp.value, textOptions));
                });
            }
        };
        CityMenu.prototype.resize = function (width, height) {
            this.screenWidth = width;
            this.screenHeight = height;
            this.update();
        };
        return CityMenu;
    }(PIXI.Container));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CityMenu;
});
//# sourceMappingURL=CityMenu.js.map