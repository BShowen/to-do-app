import database from "../../database.js";
import "./completedTasks.css";
/**
 * Component to show the completed task count.
 */
const tasksCompleted = function ({ projectId, showCompletedTasks }) {
  const _completeTasks = {
    completedTasks: function () {
      return database.getCompletedTasks(projectId)
    },
    count: function () {
      return Object.keys(this.completedTasks()).length
    }
  };

  const _container = (function () {
    const container = document.createElement("div");
    container.id = "tasksCompletedContainer";
    container.classList.add("defaultCursor");
    return container;
  })();

  const _count = (function () {
    const updateCount = function () {
      count.innerText = _completeTasks.count();
      count.innerText += " Completed •";
    }.bind(this);

    const removeListener = function () {
      emitter.off("taskChecked", updateCount);
      emitter.off("taskUnChecked", updateCount);
    }

    const count = document.createElement("p");
    count.classList.add("completedTasksCount");
    count.innerText = _completeTasks.count();
    count.innerText += " Completed •";

    emitter.on("taskChecked", updateCount);
    emitter.on("taskUnChecked", updateCount);

    return { container: count, unmount: removeListener };
  })()

  const _clearTasksButton = (function () {
    const clickHandler = function () {
      const project = this.project || false;
      if (project) {
        // Clear the tasks for a project. 
        database.deleteCompletedTasks({ projectId: project.id });
      } else {
        // Clear the tasks for all projects. 
        database.deleteCompletedTasks({ deleteAllTasks: true });
      }
      emitter.reload();
    }.bind(this);

    const removeListener = function () {
      clearTasksButton.removeEventListener("click", clickHandler);
    }.bind(this);

    const clearTasksButton = document.createElement("p");
    clearTasksButton.classList.add("clearTasksButton");
    clearTasksButton.innerText = "Clear";
    clearTasksButton.addEventListener("click", clickHandler);

    return { container: clearTasksButton, unmount: removeListener };
  }.bind(this))();

  const _showTasksButton = (function () {
    const clickHandler = function ({ showing = false }) {
      if (showing) {
        emitter.reload({ showCompletedTasks: false });
      } else {
        emitter.reload({ showCompletedTasks: true });
      }
    };

    const showTasksButton = document.createElement("p");

    if (showCompletedTasks) {
      showTasksButton.innerText = "Hide";
      showTasksButton.addEventListener("click", clickHandler.bind(this, { showing: true }));
    } else {
      showTasksButton.innerText = "Show";
      showTasksButton.addEventListener("click", clickHandler);
    }
    showTasksButton.classList.add("showTasksButton");

    return showTasksButton;
  })()


  const render = function () {
    _container.appendChild(_count.container);
    _container.appendChild(_clearTasksButton.container);
    _container.appendChild(_showTasksButton);
    this.container.appendChild(_container);
  }.bind(this);

  const unmount = function () {
    _clearTasksButton.unmount();
    _count.unmount();
    _container.remove();
  }

  return { render, unmount }
};

export { tasksCompleted };