var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", "./UIContainer"], function (require, exports, UIContainer_1) {
    "use strict";
    var AlignContainer = (function (_super) {
        __extends(AlignContainer, _super);
        function AlignContainer(options) {
            if (options === void 0) { options = {}; }
            _super.call(this);
            this.options = options;
            this.options = options;
        }
        AlignContainer.prototype.relayout = function () {
            var childrenBounds = this.getChildrenBounds();
            var thisBounds = this.getBounds();
            switch (this.options.horizontalAlign) {
                case "left":
                    this.pivot.x = 0;
                    break;
                case "right":
                    this.pivot.x = -(thisBounds.width - childrenBounds.width);
                    break;
                case "center":
                default:
                    this.pivot.x = -Math.floor((thisBounds.width - childrenBounds.width) / 2);
                    break;
            }
            switch (this.options.verticalAlign) {
                case "top":
                    this.pivot.y = 0;
                    break;
                case "bottom":
                    this.pivot.y = -(thisBounds.height - childrenBounds.height);
                    break;
                case "middle":
                default:
                    this.pivot.y = -Math.floor((thisBounds.height - childrenBounds.height) / 2);
                    break;
            }
        };
        return AlignContainer;
    }(UIContainer_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = AlignContainer;
});
//# sourceMappingURL=AlignContainer.js.map