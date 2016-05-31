define(["require", "exports", "engine/commands/Command", "linq"], function (require, exports, Command_1, Linq) {
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