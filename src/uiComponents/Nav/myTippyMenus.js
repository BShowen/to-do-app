import tippy from "tippy.js";
import database from "./../../database.js";

// This is the menu that pops up when you click on the "i" in the navigation
const projectMenu = function () {
  // Create the icon element. This will hold the "i" icon. 
  const icon = document.createElement("i");
  const button = document.createElement("button");

  const _stopPropagation = function (e) {
    /** 
     * I want the user to be able to click the "i" without changing the view 
     * of tasks. In other words, the user can click the "i" to bring up the menu
     * OR they can click the button (that the "i" sits in) and that button will
     * show the tasks for that project. 
     */
    e.stopPropagation();
  }

  const _clickHandler = function (e) {
    /** 
     * The click handler to make this current project the default one. 
     * This is triggered when the user uses the project menu to make the project
     * default.
    */
    e.stopPropagation();
    button.classList.toggle("defaultProject");
    button.setAttribute("disabled", true);
    if (database.setDefaultProject(this.projectId)) {
      emitter.reload();
      //Reset a different instance of this class.
      emitter.emit("defaultProjectChanged");
      //Allow another instance of this class to reset this instance. 
      emitter.on("defaultProjectChanged", _resetButton);
    }
  }.bind(this);

  const _resetButton = function () {
    button.classList.remove("defaultProject");
    button.removeAttribute("disabled");
    emitter.off("defaultProjectChanged", _resetButton);
  }.bind(this);

  /**
   * Cleanup event listeners on this component before removing it from the DOM.
   * This method gets called by the parent class.
   */
  const removeListeners = function () {
    icon.removeEventListener("click", _stopPropagation);
    button.removeEventListener("click", _clickHandler);
  }

  // Initialize the "i" icon. 
  icon.addEventListener("click", _stopPropagation);
  icon.classList.add("bi", "bi-info-circle");

  // Initialize the button. 
  button.classList.add("projectMenuButton")
  button.innerText = "Make default project";
  button.addEventListener("click", _clickHandler);

  /**
   * Disable the button if the project is already the default project. Make the 
   * button blue to signify that the project is already default. Add a callback 
   * to eventEmitter so when the default project is changed this button will 
   * not be disabled and the color will be default.
   */
  if (this.project.default) {
    button.classList.add("defaultProject");
    button.setAttribute("disabled", true);
    emitter.on("defaultProjectChanged", _resetButton);
  }

  // Create the popover for this icon instance, using tippy.js 
  tippy(icon, {
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    theme: "light",
    content: button,
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