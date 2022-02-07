import emitter from "./../../eventEmitter.js";

export default class NewProjectButton {

  #container = document.createElement("div");
  #button = document.createElement("button");

  constructor() {
    this.#container.id = "newProjectButtonContainer";
    this.#button.innerText = "Add List";
    this.#button.addEventListener("click", this.#handleClick);
  }

  #handleClick() {
    emitter.emit("newProject");
  }

  render() {
    this.#container.appendChild(this.#button);
    return this.#container;
  }
}