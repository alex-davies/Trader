define(["require", "exports", "engine/commands/Command", "../objectTypes/Ship", "../objectTypes/Properties"], function (require, exports, Command_1, Ship_1, Properties_1) {
    "use strict";
    var ShipBuyResource = (function () {
        function ShipBuyResource(ship, city, resource) {
            this.ship = ship;
            this.city = city;
            this.resource = resource;
        }
        ShipBuyResource.prototype.execute = function (world) {
            var canExecute = this.canExecute(world);
            if (!canExecute.isSuccessful)
                return canExecute;
            var inventoryName = Properties_1.Properties.InventoryPropertyName(this.resource.name);
            var shipInventory = this.ship.properties[inventoryName] || 0;
            var cityInventory = this.city.properties[inventoryName] || 0;
            this.city.properties[inventoryName] = cityInventory - 1;
            this.ship.properties[inventoryName] = shipInventory + 1;
            return Command_1.SuccessResult;
        };
        ShipBuyResource.prototype.canExecute = function (world) {
            var inventoryName = Properties_1.Properties.InventoryPropertyName(this.resource.name);
            var cityInventory = this.city.properties[inventoryName] || 0;
            if (cityInventory <= 0)
                return new Command_1.CityDoesNotHaveRequiredResource(this.city, this.resource.name);
            var shipTotalResources = Ship_1.ShipUtil.TotalResources(this.ship);
            if (shipTotalResources >= this.ship.properties.resourceLimit)
                return new Command_1.ShipDoesNotHaveCapacity(this.ship);
            return Command_1.SuccessResult;
        };
        return ShipBuyResource;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = ShipBuyResource;
});
//# sourceMappingURL=ShipBuyResource.js.map