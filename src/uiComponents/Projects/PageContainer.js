import Project from "./Project";
import database from "./../../database.js";
import emitter from "./../../eventEmitter.js";

export default class PageContainer {

  #container = document.createElement("div");
  #pageHeader = document.createElement("div");
  #headerButton = document.createElement("button");
  #projectsContainer = document.createElement("div");
  #headerButtonCallback;

  constructor() {
    // Configure node data
    this.#container.id = "content";
    this.#pageHeader.id = "headerContainer";
    this.#projectsContainer.id = "projectsContainer";
    this.#headerButton.innerText = "+";
    this.#headerButton.id = "newTaskButton";

    emitter.on(
      "loadTasks", //emitted from NavButton.js, App.js, Project.js
      this.#renderProject.bind(this)
    );
  }

  /**
   * This function is called whenever the user clicks on a project button in the
   * nav. It is responsible for displaying the tasks for the project. 
   */
  #renderProject(projectID) {
    this.#projectsContainer.innerHTML = '';
    const project = database.getProject(projectID);
    project.id = projectID;
    const callback = this.#renderProject.bind(this);
    const projectContainer = new Project(project, callback);
    this.#setCallback(projectContainer);
    this.#projectsContainer.appendChild(projectContainer.render());
  }

  #renderAllProjects() {
    const projects = database.getAllProjects();
    this.#projectsContainer.innerHTML = '';
    for (const projectID in projects) {
      const project = projects[projectID];
      project.id = projectID;
      const callback = this.#renderAllProjects.bind(this);
      const projectContainer = new Project(project, callback);
      if (project.default) {
        this.#setCallback(projectContainer);
      }
      this.#projectsContainer.appendChild(projectContainer.render());
    }
  }

  /**
   * Store reference to a callback function so that it can be removed 
   * when needed. If reference to the callback is not stored then it is very 
   * difficult to remove it and will cause bugs. 
   */
  #setCallback(projectContainer) {
    if (this.#headerButtonCallback) {
      this.#headerButton.removeEventListener('click',
        this.#headerButtonCallback
      );
    }
    this.#headerButtonCallback =
      projectContainer.showNewTaskForm.bind(projectContainer);
    this.#headerButton.addEventListener('click',
      this.#headerButtonCallback
    );
  }

  render() {
    this.#renderAllProjects();
    this.#container.appendChild(this.#pageHeader);
    this.#pageHeader.appendChild(this.#headerButton);
    this.#container.appendChild(this.#projectsContainer);
    return this.#container;
  }
}