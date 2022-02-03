export default class NavButton {
  
  #container;
  #button;
  #buttonText;
  
  constructor(project){
    this.#container = document.createElement("div");
    this.#button = document.createElement("button");
    this.#buttonText = project.name;
  }

  render(){
    this.#button.innerText = this.#buttonText;
    this.#container.appendChild(this.#button);
    return this.#container;
  }
}