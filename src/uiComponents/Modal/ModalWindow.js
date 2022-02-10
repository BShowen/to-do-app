import ModalForm from "./ModalForm.js";
import "./style.css";

export default class ModalWindow extends Component {

  #container;

  constructor(rootNode) {
    super(rootNode);
    
    this.unmount = this.unmount.bind(this);
    this.render = this.render.bind(this);
    emitter.on("addList", this.render);
    emitter.on("destroyModalWindow", this.unmount);
  }

  mount() {
    this.#container = document.createElement("div");
    this.#container.id = "modalContainer";

    this.children.push(new ModalForm(this.#container));
  }

  unmount() {
    this.children.forEach(child => {
      child.unmount();
    });
    this.children = [];
    this.#container.remove();
  }

  render() {
    this.mount();
    this.children.forEach(child => {
      child.render();
    });
    this.rootNode.appendChild(this.#container);
    emitter.emit("newProjectForm-focus");
  }
}
