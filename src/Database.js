/**
 * 
 * A class that serves as the interface between the application and 
 * window.localStorage. 
 * 
 * This class holds a private attribute that is mapped to localStorage. All 
 * data modification is applied to this attribute and then a copy of this 
 * attribute replaces localStorage contents. 
 * 
 */
export default class Database {
  #parsedLocalStorage;

  constructor() {
    this.#parsedLocalStorage = JSON.parse(
      localStorage.getItem('todoApp')
    ) || {};
  }

  /**
   * A method that saves a task as a child to a project. A projectID is required
   * otherwise the task will not be saved. 
   */
  saveTask({ projectID, Task }) {
    const project = this.#parsedLocalStorage[projectID] || null;
    if (project) {
      project.tasks.push(Task);
      this.#saveToLocalStorage();
    }
  }

  /**
   * A method which saves a project. The parameter 'newProject' should reference
   * an object - not a string representation of an object, not JSON, etc. It 
   * should be the object itself. 
   */
  saveProject(newProject) {
    const index = Object.keys(this.#parsedLocalStorage).length;
    this.#parsedLocalStorage[index] = newProject;
    this.#saveToLocalStorage();
  }

  getAllProjects() {
    return this.#parsedLocalStorage;
  }

  getProject({ projectID }) {
    return this.#parsedLocalStorage[projectID];
  }

  getTasks({ projectID }) {
    const project = this.getProject({ projectID }) || {};
    return project.tasks;
  }

  /**
   * A method that is used internally by this class. 
   */
  #saveToLocalStorage() {
    localStorage.setItem('todoApp', JSON.stringify(this.#parsedLocalStorage));
  }

}

/**
 *
 * Load test data
 *
 */
const db = {
  0: {
    name: "Personal",
    tasks: {
      0: {
        subject: "Wash this dishes",
        body: "Make sure the dish washer is empty first!",
        dueDate: "02/02/2022"
      }
    }
  },
  1: {
    name: "Work",
    tasks: {
      0: {
        subject: "Start working on The Odin Project",
        body: "Make sure you understand JavaScript before proceeding",
        dueDate: "3/15/2022"
      },
      1: {
        subject: "Get those files on the bosses desk",
        body: "I hate that guy...",
        dueDate: "2/15/2022"
      }
    },
  },
  2: {
    name: "Test",
    tasks: {}
  }
}
localStorage.setItem('todoApp', JSON.stringify(db));