import Database from "./Database.js";
import UI from "./uiComponents/UI.js";

const database = new Database();

const rootNode = document.querySelector("body");
const ui = new UI(rootNode);
ui.render();