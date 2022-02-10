import { DateTime } from "luxon";
import "./style.css";
export default class TaskForm extends Component {
  container;
  #subject;
  #body;
  #dueDate;
  #componentIsMounted = false;
  formIsValid = false;

  constructor(rootNode) {
    super(rootNode);
  }

  mount() {
    if (this.#componentIsMounted) {
      return;
    }
    this.container = document.createElement("div");
    this.container.id = "taskForm";

    this.#subject = document.createElement("input");
    this.inputHandler = this.inputHandler.bind(this);
    this.#subject.addEventListener('input', this.inputHandler);

    this.#body = document.createElement("input");

    this.#dueDate = document.createElement("input");
    this.#dueDate.setAttribute("type", "date");


    this.container.appendChild(this.#subject);
    this.container.appendChild(this.#body);
    this.container.appendChild(this.#dueDate);

    this.#componentIsMounted = true;
  }

  unmount() {
    this.#subject.removeEventListener("input", this.inputHandler);
    this.clearForm();
    this.container.remove();
    this.#componentIsMounted = false;
  }

  render() {
    this.rootNode.appendChild(this.container);
  }

  focus() {
    this.#subject.focus();
  }

  clearForm() {
    this.subject = '';
    this.body = '';
    this.dueDate = '';
    this.formIsValid = false;
  }

  inputHandler(evt) {
    this.formIsValid = !!evt.target.value.trim().length;
  }

  getData() {
    const task = {};
    task.subject = this.#subject.value.trim() || '';
    task.body = this.#body.value.trim() || '';
    if (this.#dueDate.value.trim().length > 0) {
      const dateTime = DateTime.fromFormat(this.#dueDate.value.trim(), 'yyyy-MM-dd');
      task.dueDate = dateTime.toFormat('MM/dd/yy');
    }
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