const database = (function () {
  /********************  Private variables and methods  ***********************/
  const _parsedLocalStorage = JSON.parse(localStorage.getItem('todoApp')) ||
  {
    0: {
      name: "Personal",
      default: true,
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
      default: false, 
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
  };

  /**
   * A method that is used internally by this class. 
   */
  const _saveToLocalStorage = function () {
    localStorage.setItem('todoApp', JSON.stringify(_parsedLocalStorage));
  }
  _saveToLocalStorage();
  /****************************************************************************/


  /**
   * A method that saves a task as a child to a project. A projectID is required
   * otherwise the task will not be saved. 
   */
  const saveTask = function ({ projectID, task }) {
    const project = _parsedLocalStorage[projectID] || null;
    if (project) {
      const index = Object.keys(project.tasks).length;
      project.tasks[index] = task;
      _saveToLocalStorage();
    }
  }

  /**
   * A method which saves a project. The parameter 'newProject' should reference
   * an object - not a string representation of an object, not JSON, etc. It 
   * should be the object itself. 
   */
  const saveProject = function (newProject) {
    const index = Object.keys(_parsedLocalStorage).length;
    _parsedLocalStorage[index] = newProject;
    _saveToLocalStorage();
    return index;
  }

  const getAllProjects = function () {
    return _parsedLocalStorage;
  }

  const getProject = function (projectID) {
    return _parsedLocalStorage[projectID];
  }

  const getTasks = function (projectID) {
    const project = getProject({ projectID }) || {};
    return project.tasks;
  }


  return {
    saveTask,
    saveProject,
    getAllProjects,
    getProject,
    getTasks,
  }
})();

export default database;