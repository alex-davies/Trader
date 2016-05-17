define(["require", "exports"], function (require, exports) {
    "use strict";
    var Properties = (function () {
        function Properties() {
        }
        Properties.ProductionPropertyName = function (resource) {
            return this.ProductionPrefix + resource;
        };
        Properties.ProductionResourceName = function (property) {
            return property.indexOf(this.ProductionPrefix) === 0
                ? property.substring(this.ProductionPrefix.length)
                : null;
        };
        Properties.IsProduction = function (property) {
            return property.indexOf(this.ProductionPrefix) === 0;
        };
        Properties.InventoryPropertyName = function (resource) {
            return this.InventoryPrefix + resource;
        };
        Properties.InventoryResourceName = function (property) {
            return property.indexOf(this.InventoryPrefix) === 0
                ? property.substring(this.InventoryPrefix.length)
                : null;
        };
        Properties.IsInventory = function (property) {
            return property.indexOf(this.InventoryPrefix) === 0;
        };
        Properties.ProductionPrefix = "production.";
        Properties.InventoryPrefix = "inventory.";
        return Properties;
    }());
    exports.Properties = Properties;
});
//# sourceMappingURL=Properties.js.map