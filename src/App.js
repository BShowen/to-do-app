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
  #nav;

  // Modal
  #modalWindow;

  constructor() {
    this.#db = new Database();
    this.#contentBody.id = "contentBody";
    emitter.on("loadTasks", this.#loadTasks.bind(this));
    this.#initializeModals();
  }

  #initializeModals() {
    this.#modalWindow = new ModalWindow({
      save: this.#saveNewProject.bind(this),
    });
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

  /**
   * This is the callback that gets called when the user submits the new 
   * project form. 
   */
  #saveNewProject(formData = {}){
    const project = { ...Object.assign({}, formData), tasks: {}};
    const savedProjectID = this.#db.saveProject(project);
    this.#renderNav();
    this.#loadTasks(savedProjectID);
  }

  #renderNav() {
    this.#nav = this.#nav || new Nav();
    const projects =  this.#db.getAllProjects();
    this.#rootNode.insertAdjacentElement(
      'afterBegin', 
      this.#nav.render(projects)
    );
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