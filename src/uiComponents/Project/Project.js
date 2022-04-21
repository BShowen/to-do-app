import Task from "../Task/Task.js";
import "./style.css";
import { tasksCompleted } from "../CompletedTasksCounter/CompletedTasks.js";

/**
 * 
 * A class that returns a container with the project name as the title and the 
 * project"s tasks as children within the container div.  
 * 
 */
export default class Project extends Component {

  container;
  #tasksContainer;
  #completedTasksContainer; //For showing completed tasks.
  #taskCounter; //Component for keeping count of this projects tasks. 
  #completedTasks; //Component for keeping count of completed tasks.
  project;
  options = {
    counter: true,
    completedTasksCounter: false,
    showCompletedTasks: false,
  };

  constructor(rootNode, project, newOptions) {
    super(rootNode);
    this.project = project;
    this.options = Object.assign(this.options, newOptions);
  }

  mount() {

    this.moveTaskToNotCompleted = this.moveTaskToNotCompleted.bind(this);
    this.decrement = this.decrement.bind(this);
    this.moveTaskToCompleted = this.moveTaskToCompleted.bind(this);
    this.canUnmount = this.canUnmount.bind(this);
    emitter.on("taskCompleted", this.decrement);
    emitter.on("taskCompleted", this.moveTaskToCompleted);
    emitter.on("taskCompleted", this.canUnmount);
    emitter.on("taskDeleted", this.decrement);
    emitter.on("taskUnChecked", this.moveTaskToNotCompleted);

    this.insertNewTask = this.insertNewTask.bind(this);
    emitter.on("insertNewTask", this.insertNewTask);

    this.container = document.createElement("div");
    this.container.classList.add("project");

    // counter() does not need to be inserted into this.children because it
    // does not need to be unmounted. There are no events to be removed from
    // the DOM.
    this.#taskCounter = counter.bind(this)();
    this.#taskCounter.render();

    if (this.options.completedTasksCounter) {
      const completedTasksOptions = {
        projectId: this.project.id,
        showCompletedTasks: this.options.showCompletedTasks
      };
      this.#completedTasks = tasksCompleted.bind(this, completedTasksOptions)();
      this.#completedTasks.render();
    }

    this.#tasksContainer = document.createElement("div");
    this.#tasksContainer.classList.add("tasksContainer");

    this.#completedTasksContainer = document.createElement("div");
    this.#completedTasksContainer.classList.add("completedTasksContainer");

    this.container.appendChild(this.#tasksContainer);
    this.container.appendChild(this.#completedTasksContainer);

    // Add the Project's tasks to the children array. 
    Object.values(this.project.tasks).forEach(taskData => {

      //dont show completed tasks
      if (this.options.showCompletedTasks || !taskData.completed) {

        // Put completed tasks in their own container. 
        if (!taskData.completed) {
          this.children.push(new Task(this.#tasksContainer, taskData));
          this.#taskCounter.increment();
        } else {
          this.children.push(new Task(this.#completedTasksContainer, taskData));
        }
      }
    });
  }

  unmount() {
    this.children.forEach(taskElement => {
      taskElement.unmount();
    });
    if (this.options.completedTasksCounter) {
      this.#completedTasks.unmount();
    }
    this.children = [];
    emitter.off("insertNewTask", this.insertNewTask);
    emitter.off("taskCompleted", this.decrement);
    emitter.off("taskDeleted", this.decrement);
    emitter.off("taskCompleted", this.moveTaskToCompleted);
    emitter.off("taskCompleted", this.canUnmount);
    emitter.off("taskUnChecked", this.moveTaskToNotCompleted);
    this.container.remove();
  }

  render() {
    this.mount();
    this.sortTasksByDateAsc();
    this.children.forEach(taskElement => {
      taskElement.render();
    });
    this.rootNode.appendChild(this.container);
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
    if (this.project.id == task.parentId) {
      // Create an instance of the task
      const newTask = new Task(this.#tasksContainer, task);
      // Add the task instance to this class's children and render 
      this.children.push(newTask);
      this.#taskCounter.increment();
      newTask.render();
    }
  }

  /**
   * Move task from main container to completed task container.
   */
  moveTaskToCompleted(task) {
    if ((this.project.id == task.parentId) && this.options.showCompletedTasks) {
      const taskComponent = this.children.find(childTask => {
        return childTask.task.id == task.id;
      });
      taskComponent.rootNode = this.#completedTasksContainer;
      taskComponent.render();
    }
  }

  /**
   * Move task from completed container to main task container.
   */
  moveTaskToNotCompleted(task) {
    if ((this.project.id == task.parentId) && this.options.showCompletedTasks) {
      const taskComponent = this.children.find(childTask => {
        return childTask.task.id == task.id;
      });
      taskComponent.rootNode = this.#tasksContainer;
      taskComponent.render();
    }
  }

  decrement(task) {
    if (task.parentId == this.project.id) {
      this.#taskCounter.decrement();
    }
  }

  canUnmount() {
    /**
     * id = If the project has an id, use it, otherwise assign "false" to id. 
     */
    const id = isNaN(this.project.id) ? false : this.project.id;

    const allChildrenUnmounted = this.children.every((task) => !task.isMounted);

    /**
     * We have to user id === false because say we have an id of int 0. 
     * Well, 0 == false is true, whereas 0 === false is false. 
     * So, when the id is 0 or any other int, the conditional will never be true
     * and if the id is anything but an int, then id will have the value "false"
     * assigned to it and false === false is true, which triggers the 
     * conditional.
     */
    if (id === false && allChildrenUnmounted) {
      this.unmount();
    }
  }
}

const counter = function () {
  const _container = document.createElement("div");
  _container.classList.add("projectHeader");

  const _title = document.createElement("p");
  _title.classList.add("projectTitle");
  _title.innerText = this.project.name || "";

  const _count = document.createElement("p");
  _count.classList.add("taskCount");
  _count.innerText = "0";

  const increment = function () {
    let newCount = parseInt(_count.innerText);
    newCount++;
    _count.innerText = newCount;
  }.bind(this);

  const decrement = function () {
    let newCount = parseInt(_count.innerText);
    newCount--;
    _count.innerText = newCount;
  }.bind(this);

  const render = function () {
    _container.appendChild(_title);
    /**
     * When the counter is showing, font size is default. 
     * When the counter is NOT showing, font size is small
     */
    if (this.options.counter) {
      _container.appendChild(_count);
    } else {
      _title.classList.add("fontSmall");
    }
    this.container.appendChild(_container);
  }.bind(this);

  return { render, increment, decrement }
};