export default class ModalForm extends Component {

  #formContainer = document.createElement("div");

  #titleContainer = document.createElement("div");
  #title = document.createElement("p");

  #inputContainer = document.createElement("div");
  #inputLabel = document.createElement("label");
  #input = document.createElement("input");

  #buttonContainer = document.createElement("div");
  #submitButton = document.createElement("button");
  #cancelButton = document.createElement("button");

  constructor(rootNode) {
    super(rootNode);
    // Set the id attr of nodes
    this.#formContainer.id = "modalFormContainer";
    this.#input.id = "listName";
    this.#buttonContainer.id = "buttonContainer";

    // Set the attributes of nodes
    this.#inputLabel.setAttribute("for", "listName");
    this.#submitButton.disabled = true;

    // Set the inner text of nodes
    this.#title.innerText = "New List";
    this.#inputLabel.innerText = "Name:";
    this.#cancelButton.innerText = "Cancel";
    this.#submitButton.innerText = "OK";

    this.focus = this.focus.bind(this);
    emitter.on("newProjectForm-focus", this.focus);
  }

  mount() {
    this.keydownHandler = this.keydownHandler.bind(this);
    this.validateForm = this.validateForm.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleCancel = this.handleCancel.bind(this);
    // Listen for when the user to presses the Escape/Enter key.
    document.addEventListener('keydown', this.keydownHandler);
    // When the form's cancel button is clicked.
    this.#cancelButton.addEventListener('click', this.handleCancel);
    // When the form's submit button is clicked.
    this.#submitButton.addEventListener('click', this.handleSubmit);
    // When the user types in the input box. 
    this.#input.addEventListener('input', this.validateForm);
  }

  unmount() {
    document.removeEventListener("keydown", this.keydownHandler);
  }

  /**
   * Destroy the modal window when user presses the Escape key.
   */
  keydownHandler(event) {
    if (event.code == "Escape") {
      this.clearForm();
      emitter.emit("destroyModalWindow");
    } else if (event.code == "Enter") {
      this.handleSubmit();
    }
  }

  validateForm() {
    if (this.#input.value.trim().length) {
      this.#submitButton.disabled = false;
      return true;
    } else {
      this.#submitButton.disabled = true;
      return false;
    }
  }

  handleSubmit() {
    const formData = {};
    if (this.validateForm()) {
      formData.name = this.#input.value;
      emitter.emit("saveNewProject", formData);
      this.clearForm();
      emitter.emit("destroyModalWindow");
    } else {
      this.focus();
    }
  }

  handleCancel(){
    this.clearForm();
    emitter.emit("destroyModalWindow");
  }

  clearForm() {
    this.#input.value = '';
    this.#submitButton.disabled = true;
  }

  focus() {
    this.#input.focus();
  }

  render() {
    this.mount();
    this.#formContainer.appendChild(this.#titleContainer);
    this.#formContainer.appendChild(this.#inputContainer);
    this.#formContainer.appendChild(this.#buttonContainer);

    this.#titleContainer.appendChild(this.#title);

    this.#inputContainer.appendChild(this.#inputLabel);
    this.#inputContainer.appendChild(this.#input);

    this.#buttonContainer.appendChild(this.#cancelButton);
    this.#buttonContainer.appendChild(this.#submitButton);
    this.rootNode.appendChild(this.#formContainer);
  }
}