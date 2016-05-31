var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
define(["require", "exports", 'pixi.js', "../controls/UIContainer", "../controls/AlignContainer"], function (require, exports, PIXI, UIContainer_1, AlignContainer_1) {
    "use strict";
    var StackContainerDebugScene = (function (_super) {
        __extends(StackContainerDebugScene, _super);
        function StackContainerDebugScene() {
            _super.call(this);
            var alignC = this.addChild(new AlignContainer_1.default());
            alignC.width = 500;
            alignC.height = 500;
            var sprite = alignC.addChild(new PIXI.Text("scaled"));
            sprite.scale.x = 4;
            alignC.relayout();
            // var hContainer = this.addChild(new HContainer());
            // hContainer.width = 300;
            // hContainer.height = 300;
            //
            // setTimeout(()=>{
            //     hContainer.width = 600;
            // },2000)
            //
            // var vContainer = hContainer.addChild(new VContainer(),{weight:1});
            //
            // vContainer.addChild(new PIXI.Text("one"),{weight:1});
            // vContainer.addChild(new AlignContainer().withChild(new PIXI.Text("two")), {weight:1});
        }
        return StackContainerDebugScene;
    }(UIContainer_1.default));
    Object.defineProperty(exports, "__esModule", { value: true });
    exports.default = StackContainerDebugScene;
});
//# sourceMappingURL=StackContainerDebugScene.js.map