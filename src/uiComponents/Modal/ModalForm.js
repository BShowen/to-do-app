export default class ModalForm {

  #formContainer = document.createElement("div");

  #titleContainer = document.createElement("div");
  #title = document.createElement("p");

  #inputContainer = document.createElement("div");
  #inputLabel = document.createElement("label");
  #input = document.createElement("input");

  #buttonContainer = document.createElement("div");
  #submitButton = document.createElement("button");
  #cancelButton = document.createElement("button");

  constructor(callbacks = {}) {
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

    // Add event listeners 
    // When the form's cancel button is clicked.
    this.#cancelButton.addEventListener(
      'click', 
      this.#clearForm.bind(this, {
        cancel: callbacks['cancel'],
      })
    );
    // When the form's submit button is clicked.
    this.#submitButton.addEventListener(
      'click',
      this.#handleSubmit.bind(this, {
        save: callbacks['save'], 
        cancel: callbacks['cancel'],
      })
    );
    // When the user types in the input box. 
    this.#input.addEventListener('input', this.#validateForm.bind(this));
  }

  #validateForm() {
    if (this.#input.value.trim().length) {
      this.#submitButton.disabled = false;
      return true;
    } else {
      this.#submitButton.disabled = true;
      return false;
    }
  }

  #handleSubmit(callbacks = {}) {
    const formData = {};
    if (this.#validateForm()) {
      formData.name = this.#input.value;
      callbacks.save(formData);
    }
    // Hide the modal after submission. 
    this.#clearForm({cancel: callbacks.cancel});
  }

  #clearForm(callbacks = {}){
    this.#input.value = '';
    this.#submitButton.disabled = true;
    callbacks.cancel();
  }

  focus() {
    this.#input.focus();
  }

  render() {
    this.#formContainer.appendChild(this.#titleContainer);
    this.#formContainer.appendChild(this.#inputContainer);
    this.#formContainer.appendChild(this.#buttonContainer);

    this.#titleContainer.appendChild(this.#title);

    this.#inputContainer.appendChild(this.#inputLabel);
    this.#inputContainer.appendChild(this.#input);

    this.#buttonContainer.appendChild(this.#cancelButton);
    this.#buttonContainer.appendChild(this.#submitButton);
    return this.#formContainer;
  }
}