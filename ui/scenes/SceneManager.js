define(["require", "exports", 'pixi.js', "../controls/DebugDraw", "tween.js"], function (require, exports, PIXI, DebugDraw_1, TWEEN) {
    "use strict";
    var SceneManager = (function () {
        function SceneManager(htmlContainer) {
            var _this = this;
            this.htmlContainer = htmlContainer;
            this.renderer = PIXI.autoDetectRenderer(htmlContainer.clientWidth, htmlContainer.clientHeight, { antialias: true });
            this.renderer.backgroundColor = 0xFF0000;
            htmlContainer.appendChild(this.renderer.view);
            //Hack: interaction data objects are reused making it difficult to store info on them
            //this is a hack to remove the "selection" property on every click so it can be used
            //by the rest of hte system to bubble what has been clicked in
            // let plugins = ((<any>this.renderer).plugins);
            // let interactionManager = (<InteractionManager>plugins.interaction);
            // let clearData = function(displayObject, eventString, eventData){
            //     debugger;
            //     delete (<any>interactionManager.eventData.data).selection;
            // }
            // this.interceptBefore(interactionManager, "onMouseUp",clearData)
            // this.interceptBefore(interactionManager, "onMouseDown",clearData)
            // interactionManager.setTargetElement(interactionManager.interactionDOMElement, interactionManager.resolution);
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
            scene.width = this.renderer.width;
            scene.height = this.renderer.height;
            //Util.TrySetRenderRect(scene, {x:0,y:0,width:this.renderer.width, height:this.renderer.height});
        };
        SceneManager.prototype.animate = function () {
            var _this = this;
            TWEEN.update();
            this.renderer.render(this.container);
            window.requestAnimationFrame(function () { return _this.animate(); });
        };
        SceneManager.prototype.interceptBefore = function (target, method, intercept) {
            var originalMethod = target[method];
            target[method] = function () {
                intercept.apply(this, arguments);
                originalMethod.apply(this, arguments);
            };
        };
        return SceneManager;
    }());
    exports.SceneManager = SceneManager;
});
//# sourceMappingURL=SceneManager.js.map