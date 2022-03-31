import { DateTime } from "luxon";
import Task from "./../Task/Task.js";
import database from "../../database";
/**
 * This is the form that appears when a user is editing a task. The context 
 * of 'this' is bound to the task object. 
 */

const editTaskForm = function () {
  const _closeForm = function (e) {
    const inputClick = e.target.localName == "input";
    if (inputClick) {
      // Ignore clicks on input fields. 
      return;
    }

    document.removeEventListener("click", _closeForm);
    // If the task is valid.
    if (this.subject.length > 0) {
      _saveTask();
    } else {
      _deleteTask();
    }

  }.bind(this);

  const _saveTask = function () {
    // Create the taskData to be sent to the DB
    const taskData = {
      ...this.task,
      subject: this.subject,
      body: this.body,
      dueDate: this.dueDate,
    }
    // If database says it updated the task. 
    const { success, task } = database.updateTask(taskData);
    if (success) {
      this.task = task;
      this.subject = task.subject;
      this.body = task.body;
      // Dont use setter to set the date here. The setter applies formatting, 
      // but this date is already formatted
      // this.#dueDate.innerText = task.dueDate;
    }
    // replace the inputs with the p tags from before. 
    Array.from(this.innerContainer.children).forEach((element, i) => {
      element.replaceWith(this.children[i]);
    });
  }.bind(this);

  const _deleteTask = function () {
    const { parentId, id } = this.task;
    database.deleteTask({ parentId, taskId: id });
    this.unmount();
    this.container.remove();
    // The project class needs to know so that it can decrement its task count
    emitter.emit("taskDeleted", parentId);
  }

  /**
  * This method converts the tasks p tags into input tags when the user clicks
  * on a task's p tag. 
  */
  const _convertToInputs = function () {
    const inputs = {
      subject: document.createElement('input'),
      body: document.createElement('input'),
      dueDate: document.createElement('input'),
    }

    inputs.subject.value = this.subject;
    inputs.subject.id = 'subject';
    inputs.body.value = this.body
    inputs.body.id = 'body';
    inputs.dueDate.setAttribute("type", "date");
    inputs.dueDate.id = 'dueDate';

    // Date needs to be formatted properly in order to be used as the value 
    // (placeholder) for the date input
    const dateTime = DateTime.fromFormat(this.dueDate, Task.DATE_FORMAT);
    inputs.dueDate.value = dateTime.toFormat('yyyy-MM-dd');

    // Replace the p tags with input tags
    this.subjectContainer.replaceWith(inputs.subject);
    this.bodyContainer.replaceWith(inputs.body);
    this.dueDateContainer.replaceWith(inputs.dueDate);

    // Add listeners to each input
    Object.values(inputs).forEach(input => {
      input.addEventListener('input', _inputHandler);
    });

    inputs.subject.focus();
  }.bind(this);

  /**
   * As the user types into the inputs, we update the #state object within this 
   * class. 
   */
  const _inputHandler = function (evt) {
    const attribute = evt.target.id;
    switch (attribute) {
      case 'subject':
        this.subject = evt.target.value;
        break;
      case 'body':
        this.body = evt.target.value;
        break;
      case 'dueDate':
        this.dueDate = evt.target.value;
        break;
    }
  }.bind(this);

  const render = function () {
    _convertToInputs();
    setTimeout(() => {
      document.addEventListener('click', _closeForm);
    }, 0);
  }.bind(this);

  return { render }
}

export { editTaskForm }