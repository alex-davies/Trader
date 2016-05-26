define(["require", "exports"], function (require, exports) {
    "use strict";
    exports.CityType = "City";
    var CityUtil = (function () {
        function CityUtil() {
        }
        CityUtil.IsCity = function (layerObj) {
            return layerObj && layerObj.type === this.TypeName;
        };
        CityUtil.TypeName = "City";
        return CityUtil;
    }());
    exports.CityUtil = CityUtil;
});
//# sourceMappingURL=City.js.map