/**
 * A class for creating user project buttons. These are 
 * the buttons that are displayed in the nav under "My Lists"
 */
export default class UserProjectButton extends Component {
  #container;
  #button;
  #projectId;
  #projectName;
  #componentIsMounted = false;


  constructor(rootNode, project) {
    super(rootNode);
    this.#projectName = project.name;
    this.#projectId = project.id;
    this.clickHandler = this.clickHandler.bind(this);
  }

  mount() {
    this.#container = document.createElement("div");
    this.#button = document.createElement("button");
    this.#button.addEventListener("click", this.clickHandler);
    this.#button.innerText = this.#projectName;
    this.#componentIsMounted = true;
  }

  clickHandler() {
    emitter.emit("loadTasks", this.#projectId)
  }

  unmount() {
    this.#button.removeEventListener('click', this.clickHandler);
    this.#container.remove();
    this.#button.remove();
    this.#componentIsMounted = false;
  }

  render() {
    if (this.#componentIsMounted) {
      console.log("render is mounting");
      this.unmount();
    }
    this.mount();
    this.#container.appendChild(this.#button);
    this.rootNode.appendChild(this.#container);
  }

}