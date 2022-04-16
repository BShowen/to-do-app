import { DateTime } from "luxon";
const database = (function () {
  /********************  Private variables and methods  ***********************/
  const today = DateTime.now().toFormat("LL/dd/yy");
  const defaultData = {
    0: {
      name: "Personal",
      default: true,
      tasks: {
        0: {
          subject: "Wash this dishes",
          body: "Make sure the dish washer is empty first!",
          dueDate: today,
          isFlagged: true
        },
        1: {
          subject: "Do some homework",
          body: "Chapter 1 - 3",
          dueDate: "04/01/22",
          isFlagged: true,
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
          dueDate: "04/15/22",
          isFlagged: true,
        },
        1: {
          subject: "Ask boss for a raise",
          body: "Just kidding...",
          dueDate: today,
        },
        2: {
          subject: "Send reports to Alex",
          body: "Alex@gmail.com",
          isFlagged: true,
        }
      },
    },
    2: {
      name: "Home",
      default: false,
      tasks: {
        0: {
          subject: "Clean out the close",
          body: "Get rid of old shirts",
          dueDate: "03/24/22"
        },
        1: {
          subject: "Clean the bathroom",
          body: "Bleach the tub",
          dueDate: "03/26/22",
          isFlagged: true,
        },
        2: {
          subject: "Cut the grass",
          body: "Make sure batteries are charged",
          dueDate: "03/26/22",
          isFlagged: true,
          completed: false,
        }
      },
    },
  };

  const _parseLocalStorage = function (data) {
    const appData = JSON.parse(localStorage.getItem('todoApp')) || data
    // Apply and id to each project.
    Object.values(appData).forEach((project, projectIndex) => {
      project.id = projectIndex;

      // Apply an id and parent id to each project's task.
      Object.values(project.tasks).forEach((task, taskIndex) => {
        task.id = taskIndex;
        task.parentId = projectIndex;
      });
    });
    return appData;
  }

  const _parsedLocalStorage = _parseLocalStorage(defaultData);
  /**
   * A method that is used internally by this class. 
   */
  const _saveToLocalStorage = function () {
    localStorage.setItem('todoApp', JSON.stringify(_parsedLocalStorage));
  }
  _saveToLocalStorage();
  /****************************************************************************/


  /**
   * A method that saves a task as a child to a project. A parentId is required
   * otherwise the task will not be saved. 
   */
  const saveTask = function (task = {}) {
    const project = _parsedLocalStorage[task.parentId] || null;
    if (project) {
      const index = Object.keys(project.tasks).length;
      const newTask = { ...task, id: index }
      project.tasks[index] = newTask;
      _saveToLocalStorage();
      return newTask;
    }
    return false;
  }

  /**
   * A method which saves a project. The parameter 'newProject' should reference
   * an object - not a string representation of an object, not JSON, etc. It 
   * should be the object itself. 
   */
  const saveProject = function (newProject) {
    const index = Object.keys(_parsedLocalStorage).length;
    newProject.id = index.toString();
    _parsedLocalStorage[index] = newProject;
    _saveToLocalStorage();
    return { ..._parsedLocalStorage[index] };
  }

  /**
   * A function that returns a list of all the projects in storage. 
   * ex: [ projectObj, projectObj, projectObj ]
   */
  const getAllProjects = function () {
    return _parsedLocalStorage;
  }

  /**
   * projectId = integer
   * Returns a single project object. 
   * ex: { projectId: 0, name: ... }
   */
  const getProject = function (projectId) {
    return _parsedLocalStorage[projectId] || false;
  }

  const getTasks = function (projectId) {
    const project = getProject(projectId) || {};
    return project.tasks;
  }

  const updateTask = function (newTask) {
    let taskUpdated = { success: false, task: {} };
    const { parentId, id } = newTask;
    const oldTask = _getTask({ parentId, taskId: id });

    // If the oldTask and newTask are the same, nothing to update.
    if (!_areEqualShallow(newTask, oldTask)) {
      _parsedLocalStorage[parentId].tasks[id] = newTask;
      _saveToLocalStorage();
      taskUpdated = { success: true, task: newTask };
    }

    return taskUpdated;
  }

  const _areEqualShallow = function (obj1, obj2) {
    // Both objects must have same amount of keys. 
    let same = Object.keys(obj1).length == Object.keys(obj2).length;

    // Both objects keys must all have the same value. 
    if (same) {
      Object.keys(obj1).every(key => {
        same = obj1[key] === obj2[key];
        return same;
      });
    }

    return same;
  }

  const _getTask = function ({ parentId, taskId }) {
    return _parsedLocalStorage[parentId].tasks[taskId];
  }

  const deleteTask = function ({ parentId, taskId }) {
    const tasks = _parsedLocalStorage[parentId].tasks;
    delete tasks[taskId];
    _saveToLocalStorage();
  }

  const getTodaysTasks = function () {
    // Create a date string in the same format as the tasks date string. 
    const today = DateTime.fromFormat(
      new Date().toLocaleDateString(),
      'M/d/yyyy'
    ).toFormat('MM/dd/yy');

    let tasks = [];
    // Iterate through all the projects tasks and return only those tasks 
    // who's date is the same as todays date. 
    Object.values(_parsedLocalStorage).forEach(project => {
      Object.values(project.tasks).forEach(task => {
        if (task.dueDate == today) {
          tasks.push(task);
        }
      })
    });

    return tasks;
  }

  const getDefaultProject = function () {
    let defaultProject = {};
    Object.values(_parsedLocalStorage).forEach(project => {
      if (project.default) {
        defaultProject = project;
      }
    });
    return defaultProject;
  }
  /**
   * projectId = int
   */
  const setDefaultProject = function (projectId) {

    const oldDefaultProject = getDefaultProject();
    oldDefaultProject.default = false;

    const newDefaultProject = getProject(projectId);
    const verificationObject = { ...newDefaultProject };
    newDefaultProject.default = true;

    _saveToLocalStorage();

    return verificationObject.default != getProject(projectId);
  }

  // A private method that retrieves all the tasks. 
  const _getAllTasks = function () {
    let tasks = [];
    Object.values(_parsedLocalStorage).forEach(project => {
      tasks = tasks.concat(Object.values(project.tasks));
    });
    return tasks;
  }

  /**
   * Returns an object with all tasks, grouped by dueDate, sorted ascending
   * according to due date. 
   */
  const getTasksWithDate = function () {
    const allTasks = _getAllTasks().filter(task => {
      // We want only the tasks that have a due date and that are NOT completed.
      return task.dueDate && !task.completed;
    }).sort(_sortAscending);
    // Group tasks by due date. 
    const groupedTasks = {};
    allTasks.forEach(task => {
      groupedTasks[task.dueDate] = groupedTasks[task.dueDate] || [];
      groupedTasks[task.dueDate].push(task);
    });
    return groupedTasks;
  }

  /**
   * Retrieve only the tasks that are flagged, sorted ascending by date. 
   * Returns an array of task objects. 
   */
  const getFlaggedTasks = function () {
    return _getAllTasks().filter(task => {
      return task.isFlagged;
    }).sort(_sortAscending);
  }

  /**
   * Sort tasks ascending by due date. This method is passed to Array.sort() as 
   * the callback. 
   */
  const _sortAscending = function (task1, task2) {
    const task1Date = new Date(task1.dueDate);
    const task2Date = new Date(task2.dueDate);
    return task1Date - task2Date;
  }

  /**
   * A method that deletes a project and its children. Returns a boolean.
   */
  const deleteProject = function (projectId) {
    const project = getProject(projectId);
    if (!!project) {
      // Delete the project's children.
      delete _parsedLocalStorage[projectId].tasks;

      // Delete the project itself. 
      delete _parsedLocalStorage[projectId];

      _saveToLocalStorage();
    }
    return getProject(projectId) != project;
  };

  /**
   * A method to retrieve all of the completed tasks. 
   */
  const getCompletedTasks = function (projectId) {
    if (projectId != undefined) {
      return _getAllTasks().filter(task => {
        return task.completed && task.parentId == projectId;
      });
    } else {
      return _getAllTasks().filter(task => task.completed);
    }
  }

  /**
   * A method for deleting all the completed tasks associated with a project.
   */
  const deleteCompletedTasks = function ({ projectId, deleteAllTasks }) {
    if (deleteAllTasks) {
      _deleteAllTasks();
    } else {
      _deleteTasksInProject(projectId);
    }
    _saveToLocalStorage();
  };

  /**
   * Helper function: Deletes all the completed tasks in the DB. 
   */
  const _deleteAllTasks = function () {
    Object.values(_parsedLocalStorage).forEach(project => {
      for (const taskId in project.tasks) {
        const task = project.tasks[taskId];
        if (task.completed) {
          delete project.tasks[taskId];
        }
      }
    });
  }

  /**
   * Helper function: Deletes all the completed tasks for a given project.
   */
  const _deleteTasksInProject = function (projectId) {
    const allTasks = _parsedLocalStorage[projectId].tasks;

    for (const taskId in allTasks) {
      if (allTasks[taskId].completed) {
        delete allTasks[taskId];
      }
    }
  }

  return {
    saveTask,
    updateTask,
    saveProject,
    getAllProjects,
    getProject,
    getTasks,
    deleteTask,
    getTodaysTasks,
    getDefaultProject,
    setDefaultProject,
    getTasksWithDate,
    getFlaggedTasks,
    deleteProject,
    getCompletedTasks,
    deleteCompletedTasks,
  }
})();

export default database;