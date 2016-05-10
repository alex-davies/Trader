var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'react', "../WorldDisplay"], function (require, exports, React, WorldDisplay_1) {
    "use strict";
    var GameView = (function (_super) {
        __extends(GameView, _super);
        function GameView(props) {
            _super.call(this, props);
        }
        GameView.prototype.render = function () {
            return React.createElement("div", null, React.createElement("section", null, "Top Banner"), React.createElement(MapView, {world: this.props.world}), React.createElement("section", null, "Bottom Banner"));
        };
        return GameView;
    }(React.Component));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = GameView;
    var MapView = (function (_super) {
        __extends(MapView, _super);
        function MapView(props) {
            _super.call(this, props);
            // create a renderer instance.
            this.renderer = PIXI.autoDetectRenderer(1136, 640);
            this.renderer.backgroundColor = 0x1C6BA0;
            this.worldDisplay = new WorldDisplay_1.default(props.world);
        }
        MapView.prototype.render = function () {
            var _this = this;
            return React.createElement("div", {ref: function (domElement) {
                domElement.appendChild(_this.renderer.view);
                _this.animate();
            }});
        };
        MapView.prototype.animate = function () {
            var _this = this;
            this.renderer.render(this.worldDisplay);
            window.requestAnimationFrame(function () { return _this.animate(); });
        };
        return MapView;
    }(React.Component));
});
//# sourceMappingURL=GameView.js.map