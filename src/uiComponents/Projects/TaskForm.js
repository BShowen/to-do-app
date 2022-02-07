export default class TaskForm {
  #container = document.createElement("div");
  #subject = document.createElement("input");
  #body = document.createElement("input");
  #dueDate = document.createElement("input");

  constructor(){
    this.#container.id = "newTaskForm";
  }

  focus(){
    this.#subject.focus();
  }

  isValid(){
    return this.#subject.value.trim().length;
  }

  getData(){
    const task = {};
    task.subject = this.#subject.value.trim() || '';
    task.body = this.#body.value.trim() || '';
    task.dueDate = this.#dueDate.value.trim() || '';
    return task;
  }

  render(){
    this.#container.appendChild(this.#subject);
    this.#container.appendChild(this.#body);
    this.#container.appendChild(this.#dueDate);
    return this.#container;
  }
}