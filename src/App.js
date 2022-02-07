import Nav from "./uiComponents/Nav/Nav.js";
import database from "./database.js";
import emitter from "./eventEmitter.js";
import ModalWindow from "./uiComponents/Modal/ModalWindow.js";
import PageContainer from "./uiComponents/Projects/PageContainer.js";

export default class App {
  // UI elements (HTML nodes)
  #rootNode = document.querySelector("body");
  #nav;

  // Modal
  #modalWindow;

  constructor() {
    this.#initializeModals();
    this.#renderNav();
    this.#renderProjects();
  }

  #initializeModals() {
    this.#modalWindow = new ModalWindow({
      save: this.#saveNewProject.bind(this),
    });
    emitter.on(
      "newProject", //emitted from NewProjectButton.js
      this.#modalWindow.render.bind(this.#modalWindow)
    );
  }

  /**
   * This is the callback that gets called when the user submits the new 
   * project form. 
   */
  #saveNewProject(formData = {}) {
    const project = { ...Object.assign({}, formData, {default: false}), tasks: {} };
    const savedProjectID = database.saveProject(project);
    this.#renderNav();
    emitter.emit("loadTasks", savedProjectID);
  }

  #renderNav() {
    this.#nav = this.#nav || new Nav(); // Instantiate the Nav class only once. 
    const projects = database.getAllProjects();
    this.#rootNode.insertAdjacentElement(
      'afterBegin',
      this.#nav.render(projects)
    );
  }

  #renderProjects(){
    this.#rootNode.appendChild(
      new PageContainer().render()
    );
  }
}