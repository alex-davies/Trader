var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    var CommandResult = (function () {
        function CommandResult(isSuccessful, failureReason) {
            this.isSuccessful = isSuccessful;
            this.failureReason = failureReason;
        }
        return CommandResult;
    }());
    exports.CommandResult = CommandResult;
    exports.SuccessResult = new CommandResult(true);
    var ShipIdNotFoundResult = (function (_super) {
        __extends(ShipIdNotFoundResult, _super);
        function ShipIdNotFoundResult(shipId) {
            _super.call(this, false, "Ship with id '" + shipId + "' not found");
        }
        return ShipIdNotFoundResult;
    }(CommandResult));
    exports.ShipIdNotFoundResult = ShipIdNotFoundResult;
    var PortIdNotFoundResult = (function (_super) {
        __extends(PortIdNotFoundResult, _super);
        function PortIdNotFoundResult(portId) {
            _super.call(this, false, "Port with id '" + portId + "' not found");
        }
        return PortIdNotFoundResult;
    }(CommandResult));
    exports.PortIdNotFoundResult = PortIdNotFoundResult;
    var ResourceIdNotFoundResult = (function (_super) {
        __extends(ResourceIdNotFoundResult, _super);
        function ResourceIdNotFoundResult(resourceId) {
            _super.call(this, false, "Resource with id '" + resourceId + "' not found");
        }
        return ResourceIdNotFoundResult;
    }(CommandResult));
    exports.ResourceIdNotFoundResult = ResourceIdNotFoundResult;
    var MarkerIdNotFoundResult = (function (_super) {
        __extends(MarkerIdNotFoundResult, _super);
        function MarkerIdNotFoundResult(markerId) {
            _super.call(this, false, "Marker with id '" + markerId + "' not found");
        }
        return MarkerIdNotFoundResult;
    }(CommandResult));
    exports.MarkerIdNotFoundResult = MarkerIdNotFoundResult;
    var BalanceTooLowResult = (function (_super) {
        __extends(BalanceTooLowResult, _super);
        function BalanceTooLowResult() {
            _super.call(this, false, "Balance too low");
        }
        return BalanceTooLowResult;
    }(CommandResult));
    exports.BalanceTooLowResult = BalanceTooLowResult;
});
//# sourceMappingURL=Command.js.map