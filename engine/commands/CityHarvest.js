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
        CityHarvest.prototype.executeXXX = function (world) {
            // world.objectsOfType(CityType).forEach(city=>{
            //     Enumerable.from(world.tileLayers())
            //         .selectMany(layer=>world.tileGidsInRect(layer,city))
            //         .select(gid=>world.tileProperties(gid))
            //         .forEach(prop=>{
            //             city.properties = city.properties || {};
            //             CityHarvest.TryApplyProduction(prop, city.properties);
            //         });
            // });
            return Command_1.SuccessResult;
        };
        CityHarvest.prototype.execute = function (world) {
            world.objectsOfType(City_1.CityType).forEach(function (city) {
                var cityCenter = {
                    x: city.x + city.width / 2,
                    y: city.y - city.height / 2
                };
                var cityTileIndex = world.getTileIndex(cityCenter);
                world.getExtendedNeighbours(cityTileIndex, function () { return true; }).toArray();
                Enumerable.from(world.tileLayers())
                    .selectMany(function (layer) { return world
                    .getExtendedNeighbours(cityTileIndex, function (tileIndex) {
                    return tileIndex === cityTileIndex || world.getTilePropertiesFromIndex(layer, tileIndex).isPartOfCity;
                })
                    .select(function (tileIndex) { return world.getTilePropertiesFromIndex(layer, tileIndex); }); })
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
        CityHarvest.TypeName = "CityHarvest";
        return CityHarvest;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = CityHarvest;
});
//# sourceMappingURL=CityHarvest.js.map