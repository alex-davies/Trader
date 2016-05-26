define(["require", "exports"], function (require, exports) {
    "use strict";
    var ShipUtil = (function () {
        function ShipUtil() {
        }
        ShipUtil.IsShip = function (layerObj) {
            return layerObj && layerObj.type === this.TypeName;
        };
        ShipUtil.TypeName = "Ship";
        return ShipUtil;
    }());
    exports.ShipUtil = ShipUtil;
});
//# sourceMappingURL=Ship.js.map