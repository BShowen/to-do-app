import TaskForm from "./modules/TaskForm.js";
import database from "../../database.js";
/**
 * When a user creates a new task, this is the form that is rendered in the DOM.
 * When the user EDITS a task a different form is rendered in the DOM. 
 * rootNode = HTML node which the form will append itself to. 
 */
export default class NewTaskForm extends TaskForm {
  #componentIsMounted = false;
  #project;
  #formIsShowing = false;
  #options = { canRenderOnBodyClick: true, dueDate: '' };

  constructor(rootNode, project, options = {}) {
    super(rootNode);
    this.#options = Object.assign(this.#options, options);
    this.#project = project;
  }

  mount() {
    if (this.#componentIsMounted) {
      return;
    }
    super.mount();
    this.show = this.show.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    document.addEventListener("click", this.clickHandler);
    emitter.on("showCreateTaskForm", this.show);

    this.#componentIsMounted = true;
  }

  unmount() {
    super.unmount();
    emitter.off("showCreateTaskForm", this.show);
    document.removeEventListener("click", this.clickHandler);
    this.#componentIsMounted = false;
  }

  show() {
    this.clearForm();
    if (this.#options.dueDate) {
      /**
       * This will set the default date when the user is viewing 'todays' tasks
       * and they create a new task. It is implied that the user wants to create
       * a new task that is due today when they create a new task while viewing 
       * 'todays' tasks. 
       */
      this.dueDate = this.#options.dueDate;
    }
    super.render();
    super.focus();
    this.#formIsShowing = true;
  }

  clickHandler(evt) {
    const buttonClick = evt.target.id == "newTaskButton";
    const inputClick = evt.target.localName == "input";
    const projectContainerClick = evt.target.id == "projectsContainer";
    const options = { buttonClick, inputClick, projectContainerClick };
    if (buttonClick || projectContainerClick || inputClick) {
      // The user has clicked on one of the three areas defined in the 
      // conditional. Now we need to determine which area was clicked and 
      // respond appropriately. 
      this.#determineClickAction(options);
    } else if (this.#formIsShowing) {
      // When the user clicks somewhere other than the form, newTaskButton, or
      // the project container
      this.#removeForm();
    }
  }

  #determineClickAction(options = {}) {
    if (options.buttonClick) {
      // The user has clicked on the newTaskButton. Save any valid form data
      // and re-render the form. 
      if (this.#formIsShowing && this.formIsValid) {
        this.saveData();
      }
      this.show();
    } else if (options.projectContainerClick) {
      // The user has clicked on the project container. 
      if (this.#formIsShowing) {
        // If the form is showing, remove it. 
        this.#removeForm();
      } else {
        // If the form is not showing, then show it (if were allowed to)
        if (this.#options.canRenderOnBodyClick) {
          // this.#options.canRenderOnBodyClick will only ever be true if the 
          // user is viewing a single project. In other words, the user is NOT
          // on the "All projects" page - they are viewing an individual project
          this.show();
        }
      }
    }
  }

  #removeForm() {
    if (this.formIsValid) {
      this.saveData();
    }
    super.clearForm();
    super.removeForm();
    this.#formIsShowing = false;
  }

  /**
   * This function saves a newly created task in the database. On successful 
   * save, the function emits an event that triggers a callback which reloads
   * the projects tasks thus showing the newly created tasks in the DOM. 
   */
  saveData() {
    // Get the data from the form. 
    const task = this.getData();
    // Set the parentId of the task. This is used to locate the project that 
    // this task belongs to
    task.parentId = this.#project.id

    if (this.formIsValid) {
      // database.saveTask() returns the newly saved task or false. 
      const newTask = database.saveTask(task);
      if (newTask) {
        // Trigger the callback that re-renders the project page, thus rendering
        // the new task in the DOM. 
        emitter.emit("insertNewTask", newTask);
      } else {
        // Alert the user that something went wrong. 
        setTimeout(() => {
          alert("There was an error saving your task");
        }, 0);
      }
    }
  }
}