import Nav from "./Nav/Nav.js";
import Database from "./../Database.js";

export default class UI {
  // Attribute that hold reference to database. 
  #storage;

  // Data holding attributes
  #projects;

  // UI elements (HTML nodes)
  #rootNode;
  #nav;

  constructor(node) {
    this.#storage = new Database();
    this.#rootNode = node;
    this.#projects = this.#storage.getAllProjects() || {};
  }

  #renderNav() {
    this.#nav = new Nav();
    this.#nav.appendChildren(this.#projects);
    this.#rootNode.appendChild(this.#nav.render());
  }

  render() {
    this.#renderNav();
  }
}