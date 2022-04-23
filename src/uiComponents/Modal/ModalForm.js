export default class ModalForm extends Component {

  #formContainer;
  #titleContainer;
  #title;

  #inputContainer;
  #inputLabel;
  #input;

  #buttonContainer;
  #submitButton;
  #cancelButton;

  constructor(rootNode) {
    super(rootNode);
  }

  mount() {

    this.#formContainer = (function () {
      const formContainer = document.createElement("div");
      formContainer.id = "modalFormContainer";
      return formContainer;
    })();

    this.#titleContainer = (function () {
      const titleContainer = document.createElement("div");
      titleContainer.id = "titleContainer";
      return titleContainer;
    })();

    this.#inputContainer = (function () {
      const inputContainer = document.createElement("div");
      inputContainer.id = "inputContainer";
      return inputContainer;
    })();

    this.#buttonContainer = (function () {
      const buttonContainer = document.createElement("div");
      buttonContainer.id = "buttonContainer";
      return buttonContainer;
    })();

    this.#title = (function () {
      const title = document.createElement("p");
      title.innerText = "New List";
      return title;
    })();

    this.#inputLabel = (function () {
      const inputLabel = document.createElement("label");
      inputLabel.innerText = "Name:";
      inputLabel.setAttribute("for", "listName");
      return inputLabel;
    })();

    this.#input = (function () {
      const input = document.createElement("input");
      input.type = "text";
      input.id = "listName";
      return input;
    })();

    this.#submitButton = (function () {
      const submitButton = document.createElement("button");
      submitButton.id = "submitButton";
      submitButton.disabled = true;
      submitButton.innerText = "OK";
      return submitButton;
    })();

    this.#cancelButton = (function () {
      const cancelButton = document.createElement("button");
      cancelButton.id = "cancelButton";
      cancelButton.innerText = "Cancel";
      return cancelButton;
    })();


    this.focus = this.focus.bind(this);
    emitter.on("newProjectForm-focus", this.focus);

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
    this.#cancelButton.removeEventListener("click", this.handleCancel);
    this.#submitButton.removeEventListener("click", this.handleSubmit);
    this.#input.removeEventListener("click", this.validateForm);
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

  handleCancel() {
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