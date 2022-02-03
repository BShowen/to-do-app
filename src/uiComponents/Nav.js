import NavButton from "./NavButton.js";



/**
 * 
 * The nav component should create a nav element. It should return an HTML node
 * that can easily be appended to the DOM. 
 * 
 */
export default class Nav {

  #container;
  #nav;
  #projectsContainer;

  constructor() {
    this.#container = document.createElement("div");
    this.#nav = document.createElement("nav");
    this.#projectsContainer = document.createElement("div");
  }

  appendChildren(projects) {
    for (const projectID in projects) {
      this.#projectsContainer.appendChild(
        new NavButton(projects[projectID]).render()
      );
    }
  }

  render() {
    this.#nav.appendChild(this.#projectsContainer);
    this.#container.appendChild(this.#nav);
    return this.#container;
  }
}