import ProjectsContainer from "../ProjectContainer/ProjectsContainer";
import "./style.css";

export default class ContentContainer extends Component {

  #container;
  #componentIsMounted;

  constructor(rootNode) {
    super(rootNode);
  }

  mount() {
    if (this.#componentIsMounted) {
      this.unmount();
    }

    this.#container = document.createElement("div");
    this.#container.id = "content";

    this.#container.appendChild(header);

    this.children.push(new ProjectsContainer(this.#container));

    this.#componentIsMounted = true;
  }

  unmount() {
    //This class only ever has one child. No need to iterate. 
    this.children[0].unmount();

    this.children = [];
    this.#container.remove();
    this.#componentIsMounted = false;
  }

  render() {
    this.mount();
    //This class only ever has one child. No need to iterate. 
    this.children[0].render();
    this.rootNode.appendChild(this.#container);
  }
}

const headerButton = (function () {
  const button = document.createElement("button");
  button.id = "newTaskButton";
  button.innerText = "+";
  return button;
})();

const header = (function () {
  const container = document.createElement("div");
  container.id = "headerContainer";

  container.appendChild(headerButton);

  return container
})();