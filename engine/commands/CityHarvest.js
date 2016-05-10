define(["require", "exports", "engine/commands/Command", "../objectTypes/City", "linq", "../objectTypes/Properties"], function (require, exports, Command_1, City_1, Enumerable, Properties_1) {
    "use strict";
    var CityHarvest = (function () {
        function CityHarvest() {
        }
        CityHarvest.TryApplyProduction = function (productionProps, targetProperties) {
            var productionPropertyEnumerable = Enumerable.from(productionProps)
                .where(function (kvp) { return Properties_1.Properties.IsProduction(kvp.key); });
            //if our production requires consumption we will not create anything
            //unless we have the inventory to do so
            var canApply = productionPropertyEnumerable
                .where(function (kvp) { return kvp.value < 0; })
                .all(function (kvp) {
                var resource = Properties_1.Properties.ProductionResourceName(kvp.key);
                return targetProperties[Properties_1.Properties.InventoryPropertyName(resource)] + kvp.value > 0;
            });
            if (!canApply) {
                return false;
            }
            //add all the production values to hte inventory
            productionPropertyEnumerable.forEach(function (kvp) {
                var resource = Properties_1.Properties.ProductionResourceName(kvp.key);
                return targetProperties[Properties_1.Properties.InventoryPropertyName(resource)] = (targetProperties[Properties_1.Properties.InventoryPropertyName(resource)] || 0) + kvp.value;
            });
            return true;
        };
        CityHarvest.prototype.execute = function (world) {
            world.objectsOfType(City_1.CityType).forEach(function (city) {
                Enumerable.from(world.tileLayers())
                    .selectMany(function (layer) { return world.tileGidsInRect(layer, city); })
                    .select(function (gid) { return world.tileProperties(gid); })
                    .forEach(function (prop) {
                    city.properties = city.properties || {};
                    CityHarvest.TryApplyProduction(prop, city.properties);
                });
            });
            return Command_1.SuccessResult;
        };
        CityHarvest.prototype.canExecute = function (world) {
            return Command_1.SuccessResult;
        };
        return CityHarvest;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CityHarvest;
});
//# sourceMappingURL=CityHarvest.js.map