var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../engine/objectTypes/Properties", "linq", "../controls/StackContainer", "../../engine/commands/CityHarvest", "../../engine/objectTypes/Resource", "../controls/StackContainer", "../controls/StackContainer", "../../engine/objectTypes/Ship", "../controls/UIText", "../controls/UISprite", "../controls/UINinePatchButton", "../../engine/commands/ShipBuyResource"], function (require, exports, Properties_1, Linq, StackContainer_1, CityHarvest_1, Resource_1, StackContainer_2, StackContainer_3, Ship_1, UIText_1, UISprite_1, UINinePatchButton_1, ShipBuyResource_1) {
    "use strict";
    var CityMenu = (function (_super) {
        __extends(CityMenu, _super);
        function CityMenu(resources, city) {
            var _this = this;
            _super.call(this, 20);
            this.resources = resources;
            this.city = city;
            this.rowCache = {};
            var updateFn = this.refreshDataBindings.bind(this);
            this.on("added", function () {
                _this.refreshDataBindings();
                _this.resources.world.onCommands([CityHarvest_1.default, ShipBuyResource_1.default], updateFn);
            });
            this.on("removed", function () {
                _this.resources.world.offCommands([CityHarvest_1.default, ShipBuyResource_1.default], updateFn);
            });
            this.refreshDataBindings();
        }
        CityMenu.prototype.buildDataBoundResourceRow = function (ship, resourceMeta) {
            var _this = this;
            var cityAmountText;
            var shipAmountText;
            var buyButton = new UINinePatchButton_1.default(this.resources.buySellButton, new UIText_1.default("Buy"), function () {
                _this.resources.world.issueCommand(new ShipBuyResource_1.default(ship, _this.city, resourceMeta));
            });
            var sellButton = new UINinePatchButton_1.default(this.resources.buySellButton, new UIText_1.default("Sell"), function () {
                _this.resources.world.issueCommand(new ShipBuyResource_1.default(ship, _this.city, resourceMeta));
            });
            ;
            var row = new StackContainer_2.HContainer().cells([
                [{ flexible: true }, this.buildIcon(resourceMeta, 1.8)],
                [{ pixels: 20 }, new StackContainer_3.Spacer()],
                [{ weight: 1 }, new StackContainer_1.VContainer().cells([
                        [{ weight: 1 }, new StackContainer_2.HContainer().cells([
                                [{ flexible: true }, this.buildIconFromTexture(this.resources.cityIcon)],
                                [{ weight: 1 }, cityAmountText = new UIText_1.default("")],
                                [{ weight: 2 }, sellButton]
                            ])],
                        [{ weight: 1 }, new StackContainer_2.HContainer().cells([
                                [{ flexible: true }, this.buildIcon(ship)],
                                [{ weight: 1 }, shipAmountText = new UIText_1.default("")],
                                [{ weight: 2 }, buyButton]
                            ])]
                    ])]
            ]);
            row.refreshDataBindings = function () {
                var inventoryName = Properties_1.Properties.InventoryPropertyName(resourceMeta.name);
                cityAmountText.text.text = _this.city.properties[inventoryName] || 0 + "";
                shipAmountText.text.text = ship.properties[inventoryName] || 0 + "";
                cityAmountText.relayout();
                shipAmountText.relayout();
            };
            return row;
        };
        CityMenu.prototype.refreshDataBindings = function () {
            var _this = this;
            var resourceMetas = this.resources.world.objectsOfType(Resource_1.ResourceUtil.TypeName).toDictionary(function (r) { return r.name; });
            var ship = this.resources.world.objectOfType(Ship_1.ShipUtil.TypeName);
            this.removeChildren();
            this.addChild(new UIText_1.default(Ship_1.ShipUtil.TotalResources(ship) + " / " + ship.properties.resourceLimit));
            Linq.from(this.city.properties).where(function (kvp) { return Properties_1.Properties.IsInventory(kvp.key); }).forEach(function (kvp) {
                var resourceName = Properties_1.Properties.InventoryResourceName(kvp.key);
                var resourceAmount = kvp.value;
                var resourceMeta = resourceMetas.get(resourceName);
                _this.rowCache[resourceName] = _this.rowCache[resourceName] || _this.buildDataBoundResourceRow(ship, resourceMeta);
                var rowItem = _this.rowCache[resourceName];
                rowItem.refreshDataBindings();
                _this.cell({ pixels: 70 }, rowItem);
            });
        };
        CityMenu.prototype.buildSellButton = function () {
            var button = new UINinePatchButton_1.default(this.resources.buySellButton, new UIText_1.default("Sell"), function () {
                console.log("sell");
            });
            return button;
        };
        CityMenu.prototype.buildIcon = function (obj, scale) {
            if (scale === void 0) { scale = 1; }
            if (obj.gid) {
                return this.buildIconFromTexture(this.resources.tileTextures[obj.gid]);
            }
            else {
                return new PIXI.Text(obj.gid + "");
            }
        };
        CityMenu.prototype.buildIconFromTexture = function (texture, scale) {
            if (scale === void 0) { scale = 1; }
            var sprite = new UISprite_1.default(texture);
            sprite.sprite.scale.set(scale, scale);
            sprite.relayout();
            return sprite;
        };
        return CityMenu;
    }(StackContainer_1.VContainer));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CityMenu;
});
//# sourceMappingURL=CityMenu.js.map