import NavButton from "./NavButton.js";
import DefaultProject from "./DefaultProject.js";
import "./style.css";



/**
 * 
 * The nav component should create a nav element. It should return an HTML node
 * that can easily be appended to the DOM. 
 * 
 */
export default class Nav {

  #container;
  #containerTitle;
  #nav;
  #projectsContainer;

  constructor() {
    this.#container = document.createElement("div");
    this.#container.id = "navContainer";
    this.#containerTitle = document.createElement("p");
    this.#containerTitle.innerText = "My Lists";
    this.#nav = document.createElement("nav");
    this.#projectsContainer = document.createElement("div");
    this.#projectsContainer.id = "projectsContainer";
    this.#loadDefaultProjects();
  }

  appendChildren(projects) {
    for (const projectID in projects) {
      this.#projectsContainer.appendChild(
        new NavButton(projects[projectID]).render()
      );
    }
  }

  #loadDefaultProjects() {
    const container = document.createElement("div");
    container.id = "defaultProjectsContainer";
    const projects = ["All", "Scheduled", "Today", "Flagged"];
    projects.forEach(projectName => {
      container.appendChild(new DefaultProject({ name: projectName }).render())
    })
    this.#nav.appendChild(container);
  }

  render() {
    this.#projectsContainer.insertAdjacentElement('afterBegin', this.#containerTitle);
    this.#nav.appendChild(this.#projectsContainer);
    this.#container.appendChild(this.#nav);
    return this.#container;
  }
}