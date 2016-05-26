define(["require", "exports"], function (require, exports) {
    "use strict";
    var ResourceUtil = (function () {
        function ResourceUtil() {
        }
        ResourceUtil.IsResource = function (layerObj) {
            return layerObj && layerObj.type === this.TypeName;
        };
        ResourceUtil.TypeName = "Resource";
        return ResourceUtil;
    }());
    exports.ResourceUtil = ResourceUtil;
});
//# sourceMappingURL=Resource.js.map