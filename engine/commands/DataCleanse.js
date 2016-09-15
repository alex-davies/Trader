define(["require", "exports", "engine/commands/Command", "linq", "../objectTypes/Ship"], function (require, exports, Command_1, Linq, Ship_1) {
    "use strict";
    var DataCleanse = (function () {
        function DataCleanse() {
        }
        DataCleanse.prototype.execute = function (world) {
            Linq.from(world.state.layers)
                .where(function (layer) { return layer.type === "objectgroup"; })
                .selectMany(function (layer) { return layer.objects; })
                .forEach(function (obj) {
                obj.properties = obj.properties || {};
            });
            world.objectsOfType(Ship_1.ShipUtil.TypeName).forEach(function (ship) {
                ship.properties._moveFromPoints = ship.properties._moveFromPoints || [];
                ship.properties._moveToPoints = ship.properties._moveToPoints || [];
            });
            return Command_1.SuccessResult;
        };
        DataCleanse.prototype.canExecute = function (world) {
            return Command_1.SuccessResult;
        };
        return DataCleanse;
    }());
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = DataCleanse;
});
//# sourceMappingURL=DataCleanse.js.map