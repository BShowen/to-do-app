import ModalForm from "./ModalForm.js";
import "./style.css";

export default class ModalWindow {

  #modalContainer = document.createElement("div");
  #modalForm;

  constructor() {
    this.#modalContainer.id = "modalContainer";
    this.#modalForm = new ModalForm();
  }

  render() {
    const body = document.querySelector("body");
    this.#modalContainer.appendChild(this.#modalForm.render());
    body.appendChild(this.#modalContainer);
    this.#modalForm.focus();
  }
}
