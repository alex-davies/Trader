define(["require", "exports", "linq", "./Properties"], function (require, exports, Linq, Properties_1) {
    "use strict";
    var ShipUtil = (function () {
        function ShipUtil() {
        }
        ShipUtil.IsShip = function (layerObj) {
            return layerObj && layerObj.type === this.TypeName;
        };
        ShipUtil.TotalResources = function (ship) {
            return Linq.from(ship.properties).where(function (kvp) { return Properties_1.Properties.IsInventory(kvp.key); }).sum(function (kvp) { return kvp.value; });
        };
        ShipUtil.TypeName = "Ship";
        return ShipUtil;
    }());
    exports.ShipUtil = ShipUtil;
});
//# sourceMappingURL=Ship.js.map