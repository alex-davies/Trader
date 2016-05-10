var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react'], function (require, exports, React) {
    "use strict";
    var PortView = (function (_super) {
        __extends(PortView, _super);
        function PortView(props) {
            _super.call(this, props);
            this.foo = 42;
        }
        PortView.prototype.render = function () {
            return React.createElement("div", null, this.props.name, " - ", this.props.age);
        };
        return PortView;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = PortView;
});
//# sourceMappingURL=PortView.js.map