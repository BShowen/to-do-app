import database from "../../database";

// Task class has set value of "this" for this component.
export default function radioButton() {
  //Create DOM elements
  let container = document.createElement("div");
  let _radio = document.createElement("input");

  // Set attributes/classes on the DOM elements
  container.classList.add("radioButton");
  _radio.setAttribute("type", "radio");

  // Construct this component tree
  container.appendChild(_radio);

  // Methods on this component
  const handleRadioClick = function () {
    this.task.completed = true;
    saveTaskInDatabase();
    setTimeout(() => {
      this.unmount(); //Remove this task from the DOM. 
      /* There is no need to call removeEvents, here. The method this.unmount() 
      will unmount the Task, and in that process this component will have it's 
      removeEvents method called by the Task class. */
      emitter.emit("taskCompleted", this.task);
    }, 250);
  }.bind(this);

  const saveTaskInDatabase = function () {
    if (!database.updateTask(this.task).success) {
      setTimeout(() => {
        alert("Something went wrong. Please try again.");
      }, 500);
    }
  }.bind(this);

  const removeEvents = function () {
    container.removeEventListener('click', handleRadioClick);
  }

  // Add event listeners to DOM elements
  if (this.task.completed) {
    _radio.setAttribute("disabled", true);
    _radio.setAttribute("checked", true);
  } else {
    container.addEventListener('click', handleRadioClick);
  }

  return { container, unmount: removeEvents };
}