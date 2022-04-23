/**
 * A class for creating user project buttons. These are 
 * the buttons that are displayed in the nav under "My Lists"
*/
import { projectMenu } from "./myTippyMenus";
import { doubleClickHandler } from "./projectNameChange.js";
export default class UserProjectButton extends Component {
  #container;
  button;
  #buttonIconComponent; //This is the "i" on the Nav buttons. 
  projectId;
  projectName;
  #componentIsMounted = false;
  options = { buttonIsActive: false };


  constructor(rootNode, project, options) {
    super(rootNode);
    this.project = project;
    this.projectName = project.name;
    this.projectId = project.id;
    this.options = options || this.options;
  }

  mount() {

    this.doubleClickHandler = doubleClickHandler.bind(this);
    this.clickHandler = this.clickHandler.bind(this);
    this.removeActiveStatus = this.removeActiveStatus.bind(this);
    this.resetActiveStatus = this.resetActiveStatus.bind(this);
    emitter.on("resetProjectButtonActiveStatus", this.resetActiveStatus);

    this.#container = document.createElement("div");
    this.button = document.createElement("div");
    this.button.addEventListener("click", this.clickHandler);
    this.button.addEventListener("dblclick", this.doubleClickHandler);
    this.button.innerText = this.projectName;
    this.button.classList.add("projectButton");
    this.addIconToButton();
    this.#componentIsMounted = true;
  }

  clickHandler() {
    emitter.emit("resetProjectButtonActiveStatus");
    this.addActiveClassToButton();
    emitter.emit("loadTasks", this.projectId)
  }

  unmount() {
    emitter.off("resetProjectButtonActiveStatus", this.resetActiveStatus);
    this.#buttonIconComponent.unmount();
    this.button.removeEventListener('click', this.clickHandler);
    this.#container.remove();
    this.button.remove();
    this.#componentIsMounted = false;
  }

  render() {
    if (this.#componentIsMounted) {
      this.unmount();
    }
    this.mount();
    this.#container.appendChild(this.button);
    this.rootNode.appendChild(this.#container);
    if (this.options.buttonIsActive) {
      this.addSelectedClassToButton();
    }
  }

  addIconToButton() {
    this.#buttonIconComponent = projectMenu.bind(this)();
    this.button.appendChild(this.#buttonIconComponent.icon);
  }

  /**
   * Removes the 'active' CSS class from the button but only when the button 
   * has the class and when the user clicks anywhere other than on the same 
   * button
   */
  removeActiveStatus(evt) {
    const clickedClassList = Array.from(evt.target.classList);
    if (!clickedClassList.includes("active")) {
      document.removeEventListener('click', this.removeActiveStatus);
      this.button.classList.remove("active");
      this.addSelectedClassToButton();
    }
  }

  /**
   * Make the button blue.
   * Adds the 'active' class to the project button. 
   */
  addActiveClassToButton() {
    this.removeSelectedClassFromButton();
    this.button.classList.add("active");
    setTimeout(() => {
      document.addEventListener("click", this.removeActiveStatus);
    }, 0);
  }

  /**
   * This will reset the project button. This is needed so that when a user 
   * clicks another project button, this one will reset back to its original 
   * styling. 
   */
  resetActiveStatus() {
    this.button.classList.remove("active");
    this.removeSelectedClassFromButton();
    document.removeEventListener('click', this.removeActiveStatus);
  }

  /**
   * Make the button grey
   */
  addSelectedClassToButton() {
    this.button.classList.add("selected");
  }

  removeSelectedClassFromButton() {
    this.button.classList.remove("selected");
  }
}