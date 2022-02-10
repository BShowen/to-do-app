import TaskForm from "./modules/TaskForm.js";
/**
 * rootNode = HTML node which the form will replace or append itself to. 
 * saveData = callback to be called to save the form data. 
 * placeholders = Optional places holders if you want the form to be filled out.
 */
export default class EditTaskForm extends TaskForm {
  #task;
  constructor(rootNode, task = {}) {
    super(rootNode);
    this.mount(task);
  }

  mount(task = {}) {
    console.log("mount edit task form");
    super.mount();
    this.handleClick = this.handleClick.bind(this);
    setTimeout(() => {
      document.addEventListener("click", this.handleClick);
    }, 0);
    this.subject = task.subject;
    this.body = task.body || "";
    this.dueDate = task.dueDate || "";
    this.#task = task;
  }

  unmount() {
    console.log("unmount edit task form");
    document.removeEventListener("click", this.handleClick);
    super.unmount();
  }

  render() {
    this.rootNode.appendChild(this.container);
  }

  handleClick(evt) {
    console.log("edit form is handling the click");
    const inputClick = evt.target.localName == "input";
    if (!inputClick) {
      this.processForm();
    }
  }

  processForm() {
    console.log("edit form is processing the form");
    if (this.formIsValid) {
      const editedTask = {
        ...this.getData(),
        id: this.#task.id,
        parentId: this.#task.parentId
      };
      console.log("edit form is emitting updateEditedTask");
      emitter.emit("updateEditedTask", editedTask);
    } else {
      // emitter.emit("deleteTask", { task: this.#task });
    }
  }
}