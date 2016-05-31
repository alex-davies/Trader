define(["require", "exports", "./ui/scenes/SceneManager", "./ui/scenes/LoadScene", "./ui/scenes/PlayScene"], function (require, exports, SceneManager_1, LoadScene_1, PlayScene_1) {
    "use strict";
    var container = document.createElement("section");
    container.style.width = "100%";
    container.style.height = "100%";
    document.body.appendChild(container);
    var sceneManager = new SceneManager_1.SceneManager(container);
    //sceneManager.setScene(new StackContainerDebugScene());
    sceneManager.setScene(new LoadScene_1.default(function (resources) {
        sceneManager.setScene(new PlayScene_1.default(resources));
    }));
});
//# sourceMappingURL=index.js.map