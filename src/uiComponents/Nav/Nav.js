import DefaultProjectButton from "./DefaultProjectButton.js";
import UserProjectButton from "./UserProjectButton.js";
import database from "./../../database.js";
import "./style.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import tippy from 'tippy.js';
import 'tippy.js/dist/tippy.css';
import 'tippy.js/themes/light.css';
import { settingsMenu } from "./myTippyMenus.js";

/**
 * A class that renders the apps navigation panel along with its children. The
 * nav's children are projects - which render out as buttons that can be clicked
 */
export default class Nav extends Component {

  /**
   * The HTML node elements used inside of this class. 
   */
  #container
  #containerTitle
  #navContainer
  #defaultButtonsContainer
  #projectButtonsContainer
  #componentIsMounted = false;

  constructor(rootNode) {
    super(rootNode)
  }

  mount() {
    this.#container = document.createElement("div");
    this.#container.id = "navContainer";

    this.#containerTitle = document.createElement("p");
    this.#containerTitle.innerText = "My Lists";

    this.#navContainer = document.createElement("nav");

    this.#defaultButtonsContainer = document.createElement("div");
    this.#defaultButtonsContainer.id = "defaultProjectsContainer";

    this.#projectButtonsContainer = document.createElement("div");
    this.#projectButtonsContainer.id = "projectButtons";

    this.#createDefaultButtons();
    this.#createUserProjectButtons();

    this.#componentIsMounted = true;
  }

  unmount() {
    this.children.forEach(child => {
      child.unmount();
    });
    this.children = [];
    this.#container.remove();
    this.#componentIsMounted = false;
  }

  render() {
    if (this.#componentIsMounted) {
      this.unmount();
    }
    this.mount();
    this.children.forEach(child => {
      child.render();
    })
    this.#container.appendChild(this.#navContainer);
    this.#navContainer.appendChild(this.#defaultButtonsContainer);
    this.#projectButtonsContainer.insertAdjacentElement(
      "afterBegin",
      this.#containerTitle
    );
    this.#navContainer.appendChild(this.#projectButtonsContainer);
    this.#navContainer.appendChild(newProjectButton);
    this.rootNode.insertAdjacentElement('afterBegin', this.#container);
  }

  /**
   * This method is called by index.js
   * This method created a new button for a newly saved project. This method 
   * creates the button and then renders it. This saves time from having to 
   * re-render the nav. Which will destroy all the children and then instantiate
   * all the children again.
   */
  addButton(project) {
    const rootNode = this.#projectButtonsContainer;
    const button = new UserProjectButton(
      rootNode,
      project,
      { buttonIsActive: true }
    );
    this.children.push(button);
    button.render();
  }

  #createUserProjectButtons() {
    const projects = database.getAllProjects();
    Object.keys(projects).forEach(projectId => {
      const project = projects[projectId];
      const rootNode = this.#projectButtonsContainer;
      const button = new UserProjectButton(rootNode, project);
      this.children.push(button);
    });
  }

  #createDefaultButtons() {
    const projectNames = ["All", "Scheduled", "Today", "Flagged"];
    projectNames.forEach(projectName => {
      const rootNode = this.#defaultButtonsContainer;
      const button = new DefaultProjectButton(
        rootNode,
        projectName
      );
      this.children.push(button);
    });
  }
}

// This is the settings gear icon
const settingsButton = (function () {
  const container = document.createElement("div");

  const icon = document.createElement("i");
  icon.id = "settingIcon";
  icon.classList.add("bi", "bi-gear");
  tippy(icon, {
    trigger: 'click',
    interactive: true,
    allowHTML: true,
    theme: "light",
    content: settingsMenu().container,
  });
  container.appendChild(icon);

  return container;
})();

/**
 * A module that returns the "Add List" button at the bottom of the nav. 
 */
const newProjectButton = (function () {
  const container = document.createElement("div");
  container.id = "newProjectButtonContainer";

  const iconContainer = document.createElement("div");
  iconContainer.classList.add("addListButton", "defaultCursor");

  const icon = document.createElement("i");
  icon.classList.add("bi", "bi-plus-circle");

  const text = document.createElement("p");
  text.innerText = "Add List";

  container.appendChild(iconContainer);
  container.appendChild(settingsButton);

  iconContainer.appendChild(icon);
  iconContainer.appendChild(text);

  iconContainer.addEventListener("click", () => {
    emitter.emit("addList");
  });

  return container;
})();