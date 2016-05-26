define(["require", "exports", 'pixi.js', "../../util/Util", "../controls/DebugDraw"], function (require, exports, PIXI, Util_1, DebugDraw_1) {
    "use strict";
    var SceneManager = (function () {
        function SceneManager(htmlContainer) {
            var _this = this;
            this.htmlContainer = htmlContainer;
            this.renderer = PIXI.autoDetectRenderer(htmlContainer.clientWidth, htmlContainer.clientHeight);
            this.renderer.backgroundColor = 0xFF0000;
            htmlContainer.appendChild(this.renderer.view);
            this.container = new PIXI.Container();
            this.container.addChild(DebugDraw_1.default.Global);
            this.animate();
            window.addEventListener('resize', function () {
                if (htmlContainer.clientWidth != _this.renderer.width
                    || htmlContainer.clientHeight != _this.renderer.height) {
                    _this.renderer.resize(htmlContainer.clientWidth, htmlContainer.clientHeight);
                    _this.setScene(_this.currentScene);
                }
            });
        }
        SceneManager.prototype.setScene = function (scene) {
            this.container.removeChild(this.currentScene);
            this.currentScene = this.container.addChildAt(scene, 0);
            Util_1.default.TrySetRenderRect(scene, { x: 0, y: 0, width: this.renderer.width, height: this.renderer.height });
        };
        SceneManager.prototype.animate = function () {
            var _this = this;
            this.renderer.render(this.container);
            window.requestAnimationFrame(function () { return _this.animate(); });
        };
        return SceneManager;
    }());
    exports.SceneManager = SceneManager;
});
//# sourceMappingURL=SceneManager.js.map