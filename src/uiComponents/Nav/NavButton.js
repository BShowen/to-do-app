import emitter from "./../../eventEmitter.js";
export default class NavButton {
  
  #container = document.createElement("div");
  #button = document.createElement("button");
  #buttonText;
  #index;
  
  constructor(project, index){
    this.#buttonText = project.name;
    this.#index = parseInt(index);
    this.#button.addEventListener('click', this.#handleClick.bind(this));
  }

  #handleClick(){
    emitter.emit("loadTasks", this.#index);
  }

  render(){
    this.#button.innerText = this.#buttonText;
    this.#container.appendChild(this.#button);
    return this.#container;
  }
}