import Database from "./Database.js";
import UI from "./uiComponents/UI.js";
import "reset-css";

const database = new Database();

const rootNode = document.querySelector("body");
const ui = new UI(rootNode);
ui.render();