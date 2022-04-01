import "./style.css";
import { DateTime } from "luxon";
import radioButton from "./RadioButton";
import { editTaskForm } from "../Forms/EditTaskForm";
import { flagTask } from "../FlagTaskComponent/flagTask";
export default class Task extends Component {
  container; //div
  innerContainer; // Container to hold the subjectContainer, bodyContainer, and dueDateContainer. 
  subjectContainer; //p tag
  bodyContainer; //p tag
  dueDateContainer; //p tag

  #radioButton; //The radio button to toggle a task as completed. 

  // Holds reference to the task data that is passed in to the constructor. 
  task;

  // Holds the state of the mount status. 
  #componentIsMounted = false;

  static DATE_FORMAT = 'MM/dd/yy';

  // taskFlag;

  constructor(rootNode, task = {}) {
    super(rootNode);
    this.task = { ...task };
  }

  mount() {
    if (this.#componentIsMounted) {
      return;
    }

    this.container = document.createElement("div");
    this.container.classList.add("task");
    this.innerContainer = document.createElement("div");
    this.innerContainer.classList.add("inputs");
    this.subjectContainer = document.createElement("p");
    this.bodyContainer = document.createElement("p");
    this.dueDateContainer = document.createElement("p"); //String MM/DD/YYYY

    this.editTaskForm = editTaskForm.bind(this)();

    this.subjectContainer.innerText = this.task.subject;
    this.bodyContainer.innerText = this.task.body;
    this.dueDateContainer.innerText = this.task.dueDate || '';

    this.children = [this.subjectContainer, this.bodyContainer, this.dueDateContainer];

    this.handleClick = this.handleClick.bind(this);
    this.#radioButton = radioButton.bind(this)()//Import RadioButton.js
    this.children.forEach(element => {
      this.innerContainer.appendChild(element);
      element.addEventListener('click', this.handleClick);
    });

    this.#componentIsMounted = true;
  }

  unmount() {
    this.#radioButton.unmount();
    this.children.forEach(element => {
      element.removeEventListener("click", this.handleClick);
      element.remove();
    });
    this.children = [];
    this.container.remove();
    this.#componentIsMounted = false;
  }

  render() {
    this.mount();
    this.container.appendChild(this.#radioButton.container);
    this.container.appendChild(this.innerContainer);
    this.rootNode.appendChild(this.container);
    this.createFlag();
  }

  // Create the flag component ONLY if the task is flagged. 
  createFlag() {
    if (this.task.isFlagged) {
      this.taskFlag = flagTask.bind(this, this.container)();
      this.taskFlag.setFlag(this.task.isFlagged);
      this.taskFlag.disable();
      this.taskFlag.render();
    }
  }

  set subject(newSubject) {
    this.subjectContainer.innerText = newSubject.trim();
  }

  set body(newBody) {
    this.bodyContainer.innerText = newBody;
  }

  set dueDate(newDate) {
    if (newDate) {
      const dateTime = DateTime.fromFormat(newDate, 'yyyy-MM-dd');
      this.dueDateContainer.innerText = dateTime.toFormat('MM/dd/yy');
    }
  }

  get subject() {
    return this.subjectContainer.innerText;
  }

  get body() {
    return this.bodyContainer.innerText || '';
  }

  get dueDate() {
    return this.dueDateContainer.innerText || '';
  }

  handleClick(e) {
    if (this.task.isFlagged) {
      this.taskFlag.destroy();
    }

    this.editTaskForm.render();
  }

  toJSON() {
    return {
      subject: this.subjectContainer,
      body: this.bodyContainer || "",
      dueDate: this.dueDateContainer || "",
    }
  }
}