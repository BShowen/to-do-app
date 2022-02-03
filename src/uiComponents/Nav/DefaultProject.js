export default class DefaultProject{
  
  #container;
  #title;

  constructor({name}){
    this.#container = document.createElement("div");
    this.#title = document.createElement("p");
    this.#title.innerText = name;
  }

  render(){
    this.#container.appendChild(this.#title);
    return this.#container;
  }
}