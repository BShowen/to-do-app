/**
 * This is the container that Task.js imports and uses as the innerContainer. 
 * This module allows for easy container manipulation since this container is 
 * dynamic and changes state depending user clicks. 
 */
const taskInnerContainer = function () {
  // innerContainer node used my ./Task.js
  const container = (function () {
    const containerNode = document.createElement("div");
    containerNode.classList.add("inputs");
    return containerNode;
  })();

  // Container to hold the dueDate and flag component. 
  const inputsRow = (function () {
    const inputsRowNode = document.createElement("div");
    inputsRowNode.classList.add("inputsRow");
    return inputsRowNode
  })();

  const _insertSubject = function (subjectNode) {
    container.appendChild(subjectNode);
  };

  const _insertBody = function (bodyNode) {
    const hasTextOrValue = (function (bodyNode) {
      let valid = false;
      switch (bodyNode.tagName.toLowerCase()) {
        case 'p':
          valid = bodyNode.innerText.length > 0;
          break;
        case 'input':
          valid = true;
          /** 
           * Always render the body input. This way we can add a body to a task
           * that doesn't already have a body. 
          */
          break;
      }
      return valid;
    })(bodyNode);

    if (hasTextOrValue) { //dont show empty body. 
      container.appendChild(bodyNode);
    }
  };

  const _insertDate = function (dueDateNode) {
    inputsRow.appendChild(dueDateNode);
  };

  /**
   * Add the task attributes (subject, body, dueDate) to the innerContainer. 
   * Each element (subject, body, dueDate) has a data-type that is read by this
   * method and used to determine which function to use to insert the node. 
   */
  const addNodes = function (nodeArray) {
    nodeArray.forEach(node => {
      switch (node.dataset.type) {
        case 'subject':
          _insertSubject(node);
          break;
        case 'body':
          _insertBody(node);
          break;
        case 'dueDate':
          _insertDate(node);
          break;
        default:
          console.log("Error adding Task attributes. Check your data sets");
      }
    });
    container.appendChild(inputsRow);
  }.bind(this);

  const clearContainer = function () {
    container.innerHTML = '';
    inputsRow.innerHTML = '';
  }

  return { container, inputsRow, addNodes, clearContainer };
};

export { taskInnerContainer as innerContainer }