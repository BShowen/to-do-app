import Task from "../Task/Task.js";
import "./style.css";

/**
 * 
 * A class that returns a container with the project name as the title and the 
 * project"s tasks as children within the container div.  
 * 
 */
export default class Project extends Component {

  #container;
  #tasksContainer;
  #taskCounter;
  #project;
  #editForm;

  constructor(rootNode, project) {
    super(rootNode);
    this.#project = project;
  }

  mount() {

    this.decrement = this.decrement.bind(this);
    emitter.on("taskDeleted", this.decrement);

    this.insertNewTask = this.insertNewTask.bind(this);
    emitter.on("insertNewTask", this.insertNewTask);

    this.#container = document.createElement("div");
    this.#container.classList.add("project");

    // counter() does not need to be inserted into this.children because is
    // does not need to be unmounted. There are no events to be removed from 
    // the DOM.
    this.#taskCounter = counter(this.#container, this.#project.name);
    this.#taskCounter.render();

    this.#tasksContainer = document.createElement("div");
    this.#tasksContainer.classList.add("tasksContainer");

    this.#container.appendChild(this.#tasksContainer);

    // Add the Project's tasks to the children array. 
    Object.values(this.#project.tasks).forEach(taskData => {
      const tasksRootNode = this.#tasksContainer;
      if (!taskData.completed) { //dont show completed tasks
        this.children.push(new Task(tasksRootNode, taskData));
        this.#taskCounter.increment();
      }
    });
  }

  unmount() {
    this.children.forEach(taskElement => {
      taskElement.unmount();
    });
    this.children = [];
    emitter.off("insertNewTask", this.insertNewTask);
    emitter.off("taskDeleted", this.decrement);
    this.#container.remove();
  }

  render() {
    this.mount();
    this.sortTasksByDateAsc();
    this.children.forEach(taskElement => {
      taskElement.render();
    });
    this.rootNode.appendChild(this.#container);
  }

  /**
   * Sort tasks by dates in ascending order. Theres a catch, tasks are not
   * required to have dates. The tasks without dates should be last in the 
   * list. For this reason I have to perform an additional check to ensure that
   * any tasks without dates will be pushed to the back of the list. 
   */
  sortTasksByDateAsc() {
    this.children.sort((a, b) => {
      const task1Date = a.task.dueDate ? new Date(a.task.dueDate) : false;
      const task2Date = b.task.dueDate ? new Date(b.task.dueDate) : false;

      if (!task1Date || !task2Date) {
        if (!task1Date) {
          return 1;
        } else {
          return -1
        }
      } else {
        return task1Date - task2Date;
      }
    });
  }

  /**
   * This is the callback that gets triggered when NewTaskForm successfully 
   * saves a new task in the database. This method first checks that the task
   * belongs to this project. This check is to ensure that there aren't any bugs 
   * when a user creates a new task while viewing all projects.  
   */
  insertNewTask(task) {
    if (this.#project.id == task.parentId) {
      // Create an instance of the task
      const newTask = new Task(this.#tasksContainer, task);
      // Add the task instance to this class's children and render 
      this.children.push(newTask);
      this.#taskCounter.increment();
      newTask.render();
    }
  }

  decrement(id) {
    if (id == this.#project.id) {
      this.#taskCounter.decrement();
    }
  }
}

const counter = function (rootNode, title) {
  const _container = document.createElement("div");
  _container.classList.add("projectHeader");

  const _title = document.createElement("p");
  _title.classList.add("projectTitle");
  _title.innerText = title || "";

  const _count = document.createElement("p");
  _count.innerText = "0";

  const increment = function () {
    let newCount = parseInt(_count.innerText);
    newCount++;
    _count.innerText = newCount;
  }

  const decrement = function () {
    let newCount = parseInt(_count.innerText);
    newCount--;
    _count.innerText = newCount;
  }

  const render = function () {
    _container.appendChild(_title);
    _container.appendChild(_count);
    rootNode.appendChild(_container);
  }

  return { render, increment, decrement }
};