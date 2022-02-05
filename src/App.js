import Nav from "./uiComponents/Nav/Nav.js";
import TaskContainer from "./uiComponents/Projects/ProjectContainer.js";
import Database from "./Database.js";
import emitter from "./eventEmitter.js";
import ModalWindow from "./uiComponents/Modal/ModalWindow.js";

export default class App {
  // Attribute that hold reference to database. 
  #db;

  // UI elements (HTML nodes)
  #rootNode = document.querySelector("body");
  #contentBody = document.createElement("div");

  // Modal
  #modalWindow = new ModalWindow();

  constructor() {
    this.#db = new Database();
    this.#contentBody.id = "contentBody";
    emitter.on("loadTasks", this.#loadTasks.bind(this));
    this.#initializeModals();
  }

  #initializeModals() {
    this.#modalWindow = new ModalWindow();
    emitter.on(
      "addList",
      this.#modalWindow.render.bind(this.#modalWindow)
    );
  }

  #loadTasks(projectID) {
    const project = this.#db.getProject({ projectID });
    this.#contentBody.innerHTML = '';
    this.#contentBody.appendChild(
      new TaskContainer(project).render()
    );
  }

  #renderNav() {
    const nav = new Nav(this.#db.getAllProjects());
    this.#rootNode.appendChild(nav.render());
  }

  #renderAllTasks() {
    const projects = this.#db.getAllProjects();
    for (const projectID in projects) {
      this.#contentBody.appendChild(
        new TaskContainer(projects[projectID]).render()
      );
    }
    this.#rootNode.appendChild(this.#contentBody);
  }

  render() {
    this.#renderNav();
    this.#renderAllTasks();
  }
}