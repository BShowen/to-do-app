import { DateTime } from "luxon";
import "./style.css";
import { flagTask } from "../../FlagTaskComponent/flagTask.js";
/**
 * This is the class that all of the TASK forms in this application inherit 
 * from. I do this because there is certain functionality that I dont want to 
 * repeat for each form.
 */
export default class TaskForm extends Component {
  container;
  #subject;
  #body;
  #dueDate;
  #componentIsMounted = false;
  formIsValid = false;
  flagComponent;

  constructor(rootNode) {
    super(rootNode);
  }

  mount() {
    if (this.#componentIsMounted) {
      return;
    }
    // The container for the form. 
    this.container = document.createElement("div");
    this.container.id = "taskForm";

    // The subject input for the task form. 
    this.#subject = document.createElement("input");

    // Ths input handler dynamically checks and changes the validity of this
    // form as the user types into the "subject" form input.
    this.inputHandler = this.inputHandler.bind(this);
    this.#subject.addEventListener('input', this.inputHandler);

    // The body form field. 
    this.#body = document.createElement("input");

    // The dueDate form field. 
    this.#dueDate = document.createElement("input");
    this.#dueDate.setAttribute("type", "date");

    /**
     * This is the flag that allows you to flag a task. Bind "this" to the 
     * component to extend the functionality of this (TaskForm) class. 
     */
    this.flagComponent = flagTask.bind(this, this.container)();


    this.container.appendChild(this.#subject);
    this.container.appendChild(this.#body);
    this.container.appendChild(this.#dueDate);

    this.#componentIsMounted = true;
  }

  unmount() {
    this.#subject.removeEventListener("input", this.inputHandler);
    this.clearForm();
    this.container.remove();
    this.flagComponent.destroy();
    this.#componentIsMounted = false;
  }

  render() {
    this.rootNode.appendChild(this.container);
    this.flagComponent.render();
  }

  focus() {
    this.#subject.focus();
  }

  clearForm() {
    this.subject = '';
    this.body = '';
    this.dueDate = '';
    this.formIsValid = false;
    this.flagComponent.setFlag(false);
  }

  inputHandler(evt) {
    this.formIsValid = !!evt.target.value.trim().length;
  }

  /**
   * Returns an object with any form fields that have been filled out. Blank 
   * form fields will be empty strings.
   */
  getData() {
    const task = {};
    task.subject = this.#subject.value.trim() || '';
    task.body = this.#body.value.trim() || '';
    if (this.#dueDate.value.trim().length > 0) {
      const dateTime = DateTime.fromFormat(this.#dueDate.value.trim(), 'yyyy-MM-dd');
      task.dueDate = dateTime.toFormat('MM/dd/yy');
    }
    task.isFlagged = this.flagComponent.isFlagged();
    return task;
  }

  removeForm() {
    this.container.remove();
  }

  set subject(newValue) {
    this.#subject.value = newValue;
    this.formIsValid = !!newValue.length
  }

  set body(newValue) {
    this.#body.value = newValue
  }

  set dueDate(newValue) {
    this.#dueDate.value = newValue
  }
}