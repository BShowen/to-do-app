import "./style.css";
import { DateTime } from "luxon";
import radioButton from "./RadioButton";
import { editTaskForm } from "../Forms/EditTaskForm";
import { flagTask } from "../FlagTaskComponent/flagTask";
import { innerContainer } from "./taskInnerContainer";
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

    // Initiate imported modules
    this.#radioButton = radioButton.bind(this)()
    this.innerContainer = innerContainer.bind(this)();
    this.editTaskForm = editTaskForm.bind(this)();

    // Bind callbacks
    this.handleClick = this.handleClick.bind(this);

    this.container = (function () {
      const containerNode = document.createElement("div");
      containerNode.classList.add("task");
      return containerNode;
    })();

    this.subjectContainer = (function () {
      const subjectContainerNode = document.createElement("p");
      subjectContainerNode.setAttribute("data-type", "subject");
      subjectContainerNode.innerText = this.task.subject;
      return subjectContainerNode;
    }.bind(this))();

    this.bodyContainer = (function () {
      const bodyContainerNode = document.createElement("p");
      bodyContainerNode.setAttribute("data-type", "body");
      bodyContainerNode.innerText = this.task.body;
      return bodyContainerNode;
    }.bind(this))();

    this.dueDateContainer = (function () {
      //String MM/DD/YYYY
      const dueDateContainerNode = document.createElement("p");
      dueDateContainerNode.setAttribute("data-type", "dueDate");
      dueDateContainerNode.innerText = this.task.dueDate || '';
      return dueDateContainerNode;
    }.bind(this))();

    this.children = [
      this.subjectContainer,
      this.bodyContainer,
      this.dueDateContainer
    ];

    // Add event listener to each child node. 
    this.children.forEach(element => {
      element.addEventListener('click', this.handleClick);
    });

    // Insert child nodes the their appropriate containers. 
    this.innerContainer.addNodes(this.children);

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
    this.container.appendChild(this.innerContainer.container);
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
    } else {
      this.dueDateContainer.innerText = '';
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