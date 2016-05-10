import {SceneManager} from "./ui/scenes/SceneManager";
import LoadScene from "./ui/scenes/LoadScene";
import PlayScene from "./ui/scenes/PlayScene";

var container = document.createElement("section");
container.style.width = "100%";
container.style.height = "100%";
document.body.appendChild(container);

var sceneManager = new SceneManager(container);

sceneManager.setScene(new LoadScene((resources)=>{
    sceneManager.setScene(new PlayScene(resources));
}));

