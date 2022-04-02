/**
 * A class for creating a default project button.
 */
class DefaultProjectButton extends Component {
  #container;
  #title;
  #projectName;

  constructor(rootNode, name) {
    super(rootNode);
    this.#projectName = name;

    this.clickHandler = this.clickHandler.bind(this);
    this.resetActiveStatus = this.resetActiveStatus.bind(this);
  }

  mount() {
    this.#container = document.createElement("div");
    this.#container.classList.add("defaultCursor");
    this.#title = document.createElement("p");
    this.#title.innerText = this.#projectName;
    this.#container.addEventListener('click', this.clickHandler);


    emitter.on("resetProjectButtonActiveStatus", this.resetActiveStatus);
  }

  unmount() {
    this.#container.removeEventListener('click', this.clickHandler);
    emitter.off("resetProjectButtonActiveStatus", this.resetActiveStatus);
    this.#container.remove();
  }

  render() {
    this.mount();
    this.#container.appendChild(this.#title);
    this.rootNode.appendChild(this.#container);
  }

  clickHandler() {
    // Reset the project button active status. 
    emitter.emit("resetProjectButtonActiveStatus");
    this.addActiveClassToButton();
    emitter.emit(`load${this.#projectName}Projects`);
  }

  /**
   * Adds the 'active' class to the project container. 
   */
  addActiveClassToButton() {
    this.#container.classList.add(`${this.#projectName}-active`);
  }

  /**
   * This will reset the project container. This is needed so that when a user 
   * clicks another project container, this one will reset back to its original 
   * styling. 
   */
  resetActiveStatus() {
    this.#container.classList.remove(`${this.#projectName}-active`);
  }
}

export default DefaultProjectButton;