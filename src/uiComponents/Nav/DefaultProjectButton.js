/**
 * A class for creating a default project button.
 */
class DefaultProjectButton extends Component {
  #container;
  #button;
  #projectName;

  constructor(rootNode, name) {
    super(rootNode);
    this.#projectName = name;

    this.clickHandler = this.clickHandler.bind(this);
  }

  mount() {
    this.#container = document.createElement("div");
    this.#button = document.createElement("button");
    this.#button.innerText = this.#projectName;
    this.#button.addEventListener('click', this.clickHandler);
  }

  unmount() {
    this.#button.removeEventListener('click', this.clickHandler);
    this.#container.remove();
  }

  render() {
    this.mount();
    this.#container.appendChild(this.#button);
    this.rootNode.appendChild(this.#container);
  }

  clickHandler() {
    emitter.emit(`load${this.#projectName}Projects`);
  }
}

export default DefaultProjectButton;