import tippy from "tippy.js";
import database from "./../../database.js";

/**
 * This is the "Delete" button in the menu that pops up when you click on the 
 * "i" icon. 
 */
const buttonMaker = function (buttonText) {
  const btn = document.createElement("button");
  btn.innerText = buttonText;
  btn.classList.add("projectMenuButton")
  return btn;
}

const defaultButton = function () {
  const btn = buttonMaker("Make default project");
  btn.classList.add("projectMenuButton");

  /** 
    * The click handler to make this current project the default one. 
    * This is triggered when the user uses the project menu to make the project
    * default.
  */
  const _clickHandler = function (e) {
    e.stopPropagation();
    btn.classList.add("defaultProject");
    btn.setAttribute("disabled", true);
    if (database.setDefaultProject(this.projectId)) {
      emitter.reload();
      //Reset a different instance of this class.
      emitter.emit("defaultProjectChanged");
      //Allow another instance of this class to reset this instance. 
      emitter.on("defaultProjectChanged", _resetButton);
    } else {
      alert("Something went wrong");
    }
  }.bind(this);

  const unmount = function () {
    _resetButton();
    btn.removeEventListener("click", _clickHandler);
  }.bind(this);

  /**
   * Make the button no longer disabled. Also, add and event listener to the 
   * button because there isn't one on it - because it was a disabled butt. No
   * need to have an event listener on a button if it is disabled. 
  */
  const _resetButton = function () {
    btn.classList.remove("defaultProject");
    btn.removeAttribute("disabled");
    emitter.off("defaultProjectChanged", _resetButton);
    btn.addEventListener("click", _clickHandler);
  }.bind(this);

  /**
    * Disable the button if the project is already the default 
    * project. Make the button red to signify that the project is 
    * already default. Add a callback to eventEmitter so when the default 
    * project is changed this button will not be disabled, the color will be 
    * blue.
  */
  if (this.project.default) {
    btn.classList.add("defaultProject");
    btn.setAttribute("disabled", true);
    emitter.on("defaultProjectChanged", _resetButton);
  } else {
    btn.addEventListener("click", _clickHandler);
  }

  return { button: btn, unmount }
}


// This is the menu that pops up when you click on the "i" in the navigation
const projectMenu = function () {
  // Create the icon element. This will hold the "i" icon. 
  const icon = document.createElement("i");
  const tippyMenuContainer = document.createElement("div");
  const makeDefaultButton = defaultButton.bind(this)();
  const deleteButton = buttonMaker("Delete Project");

  const _stopPropagation = function (e) {
    /** 
     * I want the user to be able to click the "i" without changing the view 
     * of tasks. In other words, the user can click the "i" to bring up the menu
     * OR they can click the makeDefaultButton (that the "i" sits in) and that 
     * makeDefaultButton will show the tasks for that project. 
     */
    e.stopPropagation();
  }

  /**
   * Cleanup event listeners on this component before removing it from the DOM.
   * This method gets called by the parent class.
  */
  const removeListeners = function () {
    icon.removeEventListener("click", _stopPropagation);
    makeDefaultButton.unmount();
  }

  const _deleteProject = function () {
    if (database.deleteProject(this.projectId)) {
      // "reloadApp" implemented in index.js
      emitter.emit("reloadApp");
    }
  }.bind(this);

  // Initialize the "i" icon. 
  icon.addEventListener("click", _stopPropagation);
  icon.classList.add("bi", "bi-info-circle");

  // Initialize the deleteButton.
  deleteButton.classList.add("projectMenuButton");
  deleteButton.addEventListener("click", _stopPropagation);
  deleteButton.addEventListener("click", _deleteProject);

  // Initialize the tippy menu container.
  tippyMenuContainer.classList.add("tippyMenuContainer");
  tippyMenuContainer.appendChild(makeDefaultButton.button);
  tippyMenuContainer.appendChild(deleteButton);

  // Create the popover for this icon instance, using tippy.js 
  tippy(icon, {
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    theme: "light",
    content: tippyMenuContainer,
    placement: 'right',
  });

  return { icon, unmount: removeListeners };
}

// This is the popover menu when you click the gear icon.
const settingsMenu = function () {

  const container = document.createElement("div");
  container.classList.add("tippyMenu");

  const title = document.createElement("p");
  title.innerText = "Settings";
  title.classList.add("title");

  container.appendChild(title);
  return { container }
}

export { projectMenu, settingsMenu }