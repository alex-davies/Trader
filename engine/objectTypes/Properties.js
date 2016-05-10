define(["require", "exports"], function (require, exports) {
    "use strict";
    var Properties = (function () {
        function Properties() {
        }
        Properties.ProductionPropertyName = function (resource) {
            return this.Production + resource;
        };
        Properties.ProductionResourceName = function (property) {
            return property.indexOf(this.Production) === 0
                ? property.substring(this.Production.length)
                : null;
        };
        Properties.IsProduction = function (property) {
            return property.indexOf(this.Production) === 0;
        };
        Properties.InventoryPropertyName = function (resource) {
            return this.Inventory + resource;
        };
        Properties.ResourceName = function (propertyName) {
            var seperatorIndex = propertyName.indexOf(".");
            return propertyName.substring(seperatorIndex);
        };
        Properties.Production = "production.";
        Properties.Inventory = "inventory.";
        return Properties;
    }());
    exports.Properties = Properties;
});
//# sourceMappingURL=Properties.js.map