import Task from "./Task.js";
import "./style.css";
import TaskForm from "./TaskForm.js"
import database from "../../database.js";
import emitter from "../../eventEmitter.js";

/**
 * 
 * A class that returns a container with the project name as the title and the 
 * project's tasks as children within the container div.  
 * 
 */
export default class Project {

  #projectContainer = document.createElement("div");
  #tasksContainer = document.createElement("div");
  #title = document.createElement("p");
  #formContainer;
  #form;
  
  // The index if "this" in localStorage
  #id

  constructor(project, callback) {
    // Set inner text of nodes
    this.#title.innerText = project.name;

    // Set the classes of nodes
    this.#title.classList.add("projectTitle");
    this.#projectContainer.classList.add("project");
    this.#tasksContainer.classList.add("tasksContainer");


    this.#id = project.id;
    this.#appendChildren(project.tasks);
    this.clickHandler = this.clickHandler.bind(this);
    this.saveFormData = this.saveFormData.bind(this, callback);
  }

  #appendChildren(tasks) {
    for (const taskID in tasks) {
      this.#tasksContainer.appendChild(new Task(tasks[taskID]).render());
    }
  }

  showNewTaskForm() {
    // Dont render the form if it's already rendered. 
    if (this.#formContainer) {
      return;
    }
    this.#form = new TaskForm();
    this.#formContainer = this.#form.render();
    this.#tasksContainer.appendChild(this.#formContainer);
    document.addEventListener('click', this.clickHandler);
  }

  /**
   * A function that closes the form when the user clicks anywhere other than 
   * the form or the new-task button. 
   */
  clickHandler(evt) {
    const buttonClicked = evt.target.id == "newTaskButton";
    const inputClicked = evt.target.localName == "input";
    const formContainerClicked = evt.target.id == "newTaskForm"
    if (buttonClicked || inputClicked || formContainerClicked) {
      // Focus on the form if the user clicks the new-task button repeatedly 
      if (buttonClicked) {
        this.#form.focus();
        return;
      }
    } else {
      this.saveFormData();
      document.removeEventListener('click', this.clickHandler);
      this.#formContainer.remove();
      this.#formContainer = null;
    }
  }

  saveFormData(callback){
    if(this.#form.isValid()){
      const task = this.#form.getData()
      database.saveTask({projectID: this.#id, task});
      // emitter.emit("loadTasks", this.#id);
      callback(this.#id);
    }
  }

  render() {
    this.#projectContainer.appendChild(this.#title);
    this.#projectContainer.appendChild(this.#tasksContainer);
    return this.#projectContainer;
  }
}