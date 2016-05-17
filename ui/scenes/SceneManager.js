define(["require", "exports", 'pixi.js', "../../util/Util"], function (require, exports, PIXI, Util_1) {
    "use strict";
    var SceneManager = (function () {
        function SceneManager(container) {
            var _this = this;
            this.container = container;
            this.renderer = PIXI.autoDetectRenderer(container.clientWidth, container.clientHeight);
            this.renderer.backgroundColor = 0xFF0000;
            container.appendChild(this.renderer.view);
            this.animate();
            window.addEventListener('resize', function () {
                if (container.clientWidth != _this.renderer.width
                    || container.clientHeight != _this.renderer.height) {
                    _this.renderer.resize(container.clientWidth, container.clientHeight);
                    _this.setScene(_this.currentScene);
                }
            });
        }
        SceneManager.prototype.setScene = function (scene) {
            this.currentScene = scene;
            Util_1.default.TrySetRenderRect(scene, { x: 0, y: 0, width: this.renderer.width, height: this.renderer.height });
        };
        SceneManager.prototype.animate = function () {
            var _this = this;
            if (this.currentScene != null)
                this.renderer.render(this.currentScene);
            window.requestAnimationFrame(function () { return _this.animate(); });
        };
        return SceneManager;
    }());
    exports.SceneManager = SceneManager;
});
//# sourceMappingURL=SceneManager.js.map