import Task from "./Task.js";
import "./style.css";

/**
 * 
 * A class that returns a container with the project name as the title and the 
 * project's tasks as children within the container div.  
 * 
 */

export default class ProjectContainer {

  #projectContainer = document.createElement("div");
  #tasksContainer = document.createElement("div");
  #title = document.createElement("p");

  constructor(project) {
    this.#title.innerText = project.name;
    this.#appendChildren(project.tasks);
    this.#title.classList.add("projectTitle");
    this.#projectContainer.classList.add("projectContainer");
    this.#tasksContainer.classList.add("tasksContainer");
  }

  #appendChildren(tasks) {
    for (const taskID in tasks) {
      this.#tasksContainer.appendChild(new Task(tasks[taskID]).render());
    }
  }

  render() {
    this.#projectContainer.appendChild(this.#title);
    this.#projectContainer.appendChild(this.#tasksContainer);
    return this.#projectContainer;
  }
}