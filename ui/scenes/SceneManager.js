define(["require", "exports", 'pixi.js'], function (require, exports, PIXI) {
    "use strict";
    var SceneManager = (function () {
        function SceneManager(container) {
            var _this = this;
            this.container = container;
            this.renderer = PIXI.autoDetectRenderer(container.clientWidth, container.clientHeight);
            this.renderer.backgroundColor = 0x2F8136;
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
            var duckScene = scene;
            if (duckScene.resize) {
                duckScene.resize(this.renderer.width, this.renderer.height);
            }
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