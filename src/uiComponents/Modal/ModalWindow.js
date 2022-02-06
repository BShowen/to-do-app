import ModalForm from "./ModalForm.js";
import "./style.css";

export default class ModalWindow {

  #modalContainer = document.createElement("div");
  #modalForm;
  #body = document.querySelector("body");

  constructor(callbacks = {}) {
    this.#modalContainer.id = "modalContainer";
   
    this.#modalForm = new ModalForm({
      cancel: this.#destroy.bind(this), 
      save: callbacks['save'],
    });

  }

  #destroy() {
    this.#modalContainer.remove();
  }

  render() {
    this.#modalContainer.appendChild(this.#modalForm.render());
    this.#body.appendChild(this.#modalContainer);
    this.#modalForm.focus();
  }
}
