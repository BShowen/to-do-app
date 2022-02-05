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

  constructor() {
    // Set the id attr of nodes
    this.#formContainer.id = "modalFormContainer";
    this.#input.id = "listName";
    this.#buttonContainer.id = "buttonContainer";
  
    // Set the attributes of nodes
    this.#inputLabel.setAttribute("for", "listName");

    // Set the inner text of nodes
    this.#title.innerText = "New List";
    this.#inputLabel.innerText = "Name:";
    this.#cancelButton.innerText = "Cancel";
    this.#submitButton.innerText = "OK";
  }

  focus(){
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