var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "../../engine/objectTypes/Properties", "linq", "../controls/StackContainer", "../../engine/commands/CityHarvest", "../../engine/objectTypes/Resource", "../controls/StackContainer", "../controls/StackContainer", "../../engine/objectTypes/Ship", "../controls/NinePatch", "../controls/FillContainer"], function (require, exports, Properties_1, Linq, StackContainer_1, CityHarvest_1, Resource_1, StackContainer_2, StackContainer_3, Ship_1, NinePatch_1, FillContainer_1) {
    "use strict";
    var CityMenu = (function (_super) {
        __extends(CityMenu, _super);
        function CityMenu(resources, city) {
            var _this = this;
            _super.call(this, 20);
            this.resources = resources;
            this.city = city;
            this.textOptions = { font: "bold 20px Tahoma, Geneva, sans-serif", fill: "#333", align: "center" };
            this.content = new StackContainer_1.VContainer();
            this.addChild(this.content);
            var updateFn = this.update.bind(this);
            this.on("added", function () {
                _this.update();
                //this.resources.world.onCommand(CityHarvest, updateFn)
            });
            this.on("removed", function () {
                _this.resources.world.offCommand(CityHarvest_1.default, updateFn);
            });
            this.update();
        }
        CityMenu.prototype.update = function () {
            var _this = this;
            var resourceMetas = this.resources.world.objectsOfType(Resource_1.ResourceUtil.TypeName).toDictionary(function (r) { return r.name; });
            var ship = this.resources.world.objectOfType(Ship_1.ShipUtil.TypeName);
            var textOptions = { font: "bold 20px Tahoma, Geneva, sans-serif", fill: "#333", align: "center" };
            this.removeChildren();
            if (this.city) {
                this.addChild(new PIXI.Text(this.city.name, textOptions));
                // let hcontainer = this.addChild(new HContainer(),{pixels:200}).withChildren([
                //     new PIXI.Text("Hello"),
                //     [new VContainer().withChildren([
                //         [new FillContainer(), {weight:1}],
                //         [new FillContainer(), {weight:1}]
                //     ]),{weight:1}]
                // ]);
                Linq.from(this.city.properties).where(function (kvp) { return Properties_1.Properties.IsInventory(kvp.key); }).take(1).forEach(function (kvp) {
                    var resourceName = Properties_1.Properties.InventoryResourceName(kvp.key);
                    var resourceAmount = kvp.value;
                    var resourceMeta = resourceMetas.get(resourceName);
                    // this.cell({pixels: 100}, new HContainer().cells([
                    //     [{weight: 1}, new PIXI.Text("one")],
                    //     [{weight: 1}, new PIXI.Text("two")]
                    // ]));
                    _this.cell({ pixels: 70 }, new StackContainer_2.HContainer().cells([
                        [{ flexible: true }, _this.buildIcon(resourceMeta, 2)],
                        [{ pixels: 20 }, new StackContainer_3.Spacer()],
                        [{ weight: 1 }, new StackContainer_1.VContainer().cells([
                                [{ weight: 1 }, new StackContainer_2.HContainer().cells([
                                        [{ flexible: true }, new FillContainer_1.default().withChild(_this.buildIcon(_this.city))],
                                        [{ weight: 1 }, new FillContainer_1.default().withChild(new PIXI.Text(resourceAmount, textOptions))],
                                        [{ weight: 2 }, _this.buildSellButton()]
                                    ])],
                                [{ weight: 1 }, new StackContainer_2.HContainer().cells([
                                        [{ flexible: true }, new FillContainer_1.default().withChild(_this.buildIcon(ship))],
                                        [{ weight: 1 }, new FillContainer_1.default().withChild(new PIXI.Text("???", textOptions))],
                                        [{ weight: 2 }, _this.buildBuyButton()]
                                    ])]
                            ])]
                    ]));
                });
            }
        };
        CityMenu.prototype.buildBuyButton = function () {
            var button = new NinePatch_1.default().loadFromAndroidImage(this.resources.buttonNinePatch);
            var text = new PIXI.Text("-$5", this.textOptions);
            var fillContaienr = new FillContainer_1.default();
            fillContaienr.addChild(text);
            //return fillContaienr;
            button.addChild(fillContaienr);
            button.relayout();
            //button.relayout();
            //button.addChild(text);
            return button;
        };
        CityMenu.prototype.buildSellButton = function () {
            // var button = new NinePatch().loadFromAndroidImage(this.resources.buttonNinePatch);
            // button.addChild(new PIXI.Text("$5", this.textOptions));
            // return button;
            return new PIXI.Text("$5", this.textOptions);
        };
        CityMenu.prototype.buildIcon = function (obj, scale) {
            if (scale === void 0) { scale = 1; }
            if (obj.gid) {
                var sprite = new PIXI.Sprite(this.resources.tileTextures[obj.gid]);
                sprite.scale.set(scale, scale);
                return sprite;
            }
            else {
                return new PIXI.Text(obj.gid + "");
            }
        };
        return CityMenu;
    }(StackContainer_1.VContainer));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CityMenu;
});
//# sourceMappingURL=CityMenu.js.map