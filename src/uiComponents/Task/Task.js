import "./style.css";
import { DateTime } from "luxon";
import database from "./../../database.js";
export default class Task extends Component {
  #container; //div
  #subject; //p tag
  #body; //p tag
  #dueDate; //p tag

  // Holds reference to the task data that is passed in to the constructor. 
  #task;

  // Holds the state of the mount status. 
  #componentIsMounted = false;

  static DATE_FORMAT = 'MM/dd/yy';

  constructor(rootNode, task = {}) {
    super(rootNode)
    /**
     * These id's are needed to update the task. When this app is migrated to
     * mongoDB this logic will have to be changed. 
     */
    this.projectId = task.projectId;
    this.id = task.id;

    this.#task = task
  }

  mount() {
    if (this.#componentIsMounted) {
      return;
    }

    this.#container = document.createElement("div");
    this.#container.classList.add("task");
    this.#subject = document.createElement("p");
    this.#body = document.createElement("p");
    this.#dueDate = document.createElement("p"); //String MM/DD/YYYY

    this.#subject.innerText = this.#task.subject;
    this.#body.innerText = this.#task.body;
    this.#dueDate.innerText = this.#task.dueDate || '';

    this.children = [this.#subject, this.#body, this.#dueDate];

    this.inputHandler = this.inputHandler.bind(this);
    this.handleClick = this.handleClick.bind(this);
    this.children.forEach(element => {
      element.addEventListener('click', this.handleClick);
    });

    this.#componentIsMounted = true;
  }

  unmount() {
    this.children.forEach(element => {
      element.removeEventListener("click", this.handleClick);
      element.remove();
    });
    this.children = [];
    this.#container.remove();
    this.#componentIsMounted = false;
  }

  render() {
    this.mount();
    this.#container.appendChild(this.#subject);
    this.#container.appendChild(this.#body);
    this.#container.appendChild(this.#dueDate);
    this.rootNode.appendChild(this.#container);
  }

  set subject(newSubject) {
    this.#subject.innerText = newSubject.trim();
  }

  set body(newBody) {
    this.#body.innerText = newBody;
  }

  set dueDate(newDate) {
    if (newDate) {
      const dateTime = DateTime.fromFormat(newDate, 'yyyy-MM-dd');
      this.#dueDate.innerText = dateTime.toFormat('MM/dd/yy');
    }
  }

  get subject() {
    return this.#subject.innerText;
  }

  get body() {
    return this.#body.innerText || '';
  }

  get dueDate() {
    return this.#dueDate.innerText || '';
  }

  // The click handler for when a tasks p tag is clicked. 
  handleClick(e) {
    this.convertToInputs();
    this.closeForm = this.closeForm.bind(this);
    // e.stopPropagation();
    setTimeout(() => {
      document.addEventListener('click', this.closeForm);
    }, 0);
  }

  closeForm(e) {
    const inputClick = e.target.localName == "input";
    if (inputClick) {
      // Ignore clicks on input fields. 
      return;
    }

    document.removeEventListener("click", this.closeForm);
    // If the task is valid.
    if (this.#subject.innerText.length > 0) {
      // Create the taskData to be sent to the DB
      const taskData = {
        ...{
          subject: this.subject,
          body: this.body,
          dueDate: this.dueDate,
        },
        id: this.#task.id,
        parentId: this.#task.parentId
      }
      // If database says it updated the task. 
      const { success, task } = database.updateTask(taskData);
      if (success) {
        this.#task = task;
        this.subject = task.subject;
        this.body = task.body;
        // Dont use setter to set the date here. The setter applies formatting, 
        // but this date is already formatted
        this.#dueDate.innerText = task.dueDate;
      }
      // replace the inputs with the p tags from before. 
      Array.from(this.#container.children).forEach((element, i) => {
        element.replaceWith(this.children[i]);
      });

    } else {
      const { parentId, id } = this.#task;
      database.deleteTask({ parentId, taskId: id });
      this.unmount();
      this.#container.remove();
      // The project class needs to know so that it can decrement its task count
      emitter.emit("taskDeleted", parentId);
    }

  }

  /**
  * This method converts the tasks p tags into input tags when the user clicks
  * on a task's p tag. 
  */
  convertToInputs() {
    const inputs = {
      subject: document.createElement('input'),
      body: document.createElement('input'),
      dueDate: document.createElement('input'),
    }

    inputs.subject.value = this.subject;
    inputs.subject.id = 'subject';
    inputs.body.value = this.body
    inputs.body.id = 'body';
    inputs.dueDate.setAttribute("type", "date");
    inputs.dueDate.id = 'dueDate';

    // Date needs to be formatted properly in order to be used as the value 
    // (placeholder) for the date input
    const dateTime = DateTime.fromFormat(this.dueDate, Task.DATE_FORMAT);
    inputs.dueDate.value = dateTime.toFormat('yyyy-MM-dd');

    // Replace the p tags with input tags
    this.#subject.replaceWith(inputs.subject);
    this.#body.replaceWith(inputs.body);
    this.#dueDate.replaceWith(inputs.dueDate);

    // Add listeners to each input
    Object.values(inputs).forEach(input => {
      input.addEventListener('input', this.inputHandler);
    });

    inputs.subject.focus();
  }

  /**
   * As the user types into the inputs, we update the #state object within this 
   * class. 
   */
  inputHandler(evt) {
    const attribute = evt.target.id;
    switch (attribute) {
      case 'subject':
        this.subject = evt.target.value;
        break;
      case 'body':
        this.body = evt.target.value;
        break;
      case 'dueDate':
        this.dueDate = evt.target.value;
        break;
    }
  }

  toJSON() {
    return {
      subject: this.#subject,
      body: this.#body || "",
      dueDate: this.#dueDate || "",
    }
  }
}