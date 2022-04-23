import { DateTime } from "luxon";
import Task from "./../Task/Task.js";
import database from "../../database";
import { flagTask } from "../FlagTaskComponent/flagTask.js";
/**
 * This is the form that appears when a user is editing a task. The context 
 * of 'this' is bound to the task object. 
 */

const editTaskForm = function () {
  /**
   * This variable/attribute is initiated here so it is global within this 
   * module. It is assigned a value in this component's render function. This
   * needs to happen this way because 'flag' is cleared when this component
   * unmounts and 'flag' needs to be re-assigned a value when this component
   * gets rendered again. 
   */
  let flag;

  const _closeForm = function (e) {
    const inputClick = e.target.localName == "input";
    const flagClick = Array.from(e.target.classList).includes('flagInput');
    if (inputClick || flagClick) {
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
    // Create the updated task that is to be updated the DB
    const taskData = {
      ...this.task,
      subject: this.subject,
      body: this.body,
      dueDate: this.dueDate,
      isFlagged: flag.isFlagged(),
    }
    // If database says it updated the task. 
    const { success, task } = database.updateTask(taskData);
    if (success) {
      this.task = { ...task };
    }

    /**
      * Important: flag.destroy() must be called before Array.from... This is 
      * because when the flag component renders, it becomes a child in the div
      * container that holds all other inputs (subject, body, due date). The 
      * flag component needs to remove itself from this container div BEFORE
      * Array.from... gets called. 
      */
    flag.destroy();

    // replace the inputs with the p tags from before. 
    Array.from(this.innerContainer.container.children).forEach((element, i) => {
      if (i <= 1) {
        // Replace the first two children. 
        if (this.children[i].innerText.length) {
          element.replaceWith(this.children[i]);
        } else {
          element.remove();
        }
      } else {
        /** 
         * The last child is from innerContainer.child is a container. The 
         * actual child that needs to be replaced is the first (only) child in
         * this container. 
         */
        element.children[0].replaceWith(this.children[i]);
      }
    });
    this.createFlag();
  }.bind(this);

  const _deleteTask = function () {
    const { parentId, id } = this.task;
    database.deleteTask({ parentId, taskId: id });
    this.unmount();
    this.container.remove();
    // The project class needs to know so that it can decrement its task count
    emitter.emit("taskDeleted", this.task);
  }.bind(this);

  /**
  * This method converts the tasks p tags into input tags when the user clicks
  * on a task's p tag. 
  */
  const _convertToInputs = function () {

    const _subject = (function () {
      const subjectNode = document.createElement('input');
      subjectNode.type = "text";
      subjectNode.classList.add("removeDefaultStyling");
      subjectNode.setAttribute('data-type', 'subject');
      subjectNode.addEventListener('input', _inputHandler);
      subjectNode.value = this.subject;
      subjectNode.id = 'subject';
      return subjectNode;
    }.bind(this))();

    const _body = (function () {
      const bodyNode = document.createElement('input');
      bodyNode.type = "text";
      bodyNode.classList.add("removeDefaultStyling");
      bodyNode.setAttribute('data-type', 'body');
      bodyNode.addEventListener('input', _inputHandler);
      bodyNode.id = 'body';
      bodyNode.value = this.body;
      return bodyNode;
    }.bind(this))();

    const _dueDate = (function () {
      const dateTime = DateTime.fromFormat(this.dueDate, Task.DATE_FORMAT);
      const dueDateNode = document.createElement('input');
      dueDateNode.type = "date";
      dueDateNode.classList.add("removeDefaultStyling");
      dueDateNode.setAttribute('data-type', 'dueDate');
      dueDateNode.addEventListener('input', _inputHandler);
      dueDateNode.setAttribute("type", "date");
      dueDateNode.id = 'dueDate';
      // Date needs to be formatted properly in order to be used as the value 
      // (placeholder) for the date input
      dueDateNode.value = dateTime.toFormat('yyyy-MM-dd');
      return dueDateNode;
    }.bind(this))();

    const _inputs = [
      _subject,
      _body,
      _dueDate
    ];
    this.innerContainer.clearContainer();
    this.innerContainer.addNodes(_inputs);

    flag.setFlag(this.task.isFlagged);
    flag.render();

    _subject.focus();
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
    const flagRootNode = this.innerContainer.inputsRow;
    flag = flagTask.bind(this, flagRootNode)();
    _convertToInputs();
    setTimeout(() => {
      document.addEventListener('click', _closeForm);
    }, 0);
  }.bind(this);

  return { render }
}

export { editTaskForm }