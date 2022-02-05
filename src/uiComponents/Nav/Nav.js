import NavButton from "./NavButton.js";
import DefaultProject from "./DefaultProject.js";
import NewProjectButton from "./NewProjectButton.js";
import "./style.css";



/**
 * 
 * A class that renders the apps navigation panel along with its children. The
 * nav's children are projects - which render out as buttons that can be clicked
 * 
 */
export default class Nav {

  #container = document.createElement("div");
  #containerTitle = document.createElement("p");
  #nav = document.createElement("nav");
  #projectsContainer = document.createElement("div");
  #newProjectButton;

  constructor(projects) {
    this.#container.id = "navContainer";
    this.#containerTitle.innerText = "My Lists";
    this.#projectsContainer.id = "projectsContainer";
    this.#newProjectButton = new NewProjectButton().render();
    this.#loadDefaultProjects();
    this.#appendChildren(projects);
  }

  #appendChildren(projects) {
    for (const projectID in projects) {
      this.#projectsContainer.appendChild(
        new NavButton(projects[projectID], projectID).render()
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
    this.#nav.appendChild(this.#newProjectButton);
    this.#container.appendChild(this.#nav);
    return this.#container;
  }
}