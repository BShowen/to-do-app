import "./style.css";
/**
 * A module to hold the code for flagging a task. 
 * The context, or in other words the 'this' keyword, is bound to the object
 * that calls this module.
 * 
 * rootNode = The node that this module will render its contents to. 
 */

const flagTask = function (rootNode) {
  let _isFlagged = false;
  const _componentContainer = document.createElement("div");
  const _icon = document.createElement("i");

  const _clickHandler = function (e) {
    const classList = Array.from(_icon.classList)
    if (classList.includes("bi-flag")) {
      _icon.classList.remove("bi-flag");
      _icon.classList.add("bi-flag-fill");
      _isFlagged = true;
    } else {
      _icon.classList.remove("bi-flag-fill");
      _icon.classList.add("bi-flag");
      _isFlagged = false;
    }
  }.bind(this);

  const render = function () {
    rootNode.appendChild(_componentContainer);
  }.bind(this);

  /**
   * When we remove this component from the DOM we also need to reset the CSS
   * class list. Otherwise a bug can be introduced where the "Flag" icon is
   * filled in on a subsequent task creation, when it shouldn't be filled in. 
   */
  const destroy = function () {
    _icon.classList.remove("bi-flag-fill");
    _icon.classList.add("bi-flag");
    _isFlagged = false;
    _icon.removeEventListener("click", _clickHandler);
    _componentContainer.remove();
  }.bind(this);

  const isFlagged = function () {
    return _isFlagged;
  }.bind(this);

  /**
   * Pass in a Boolean to change the status of the flag.
   * Returns the boolean. 
   */
  const setFlag = function (bool) {
    if (typeof bool == 'boolean') {
      _isFlagged = bool;
    }

    if (_isFlagged) {
      _icon.classList.remove("bi-flag");
      _icon.classList.add("bi-flag-fill");
    } else {
      _icon.classList.remove("bi-flag-fill");
      _icon.classList.add("bi-flag");
    }
    return _isFlagged;
  }.bind(this);

  const disable = function () {
    _icon.removeEventListener("click", _clickHandler);
    /**
     * The "moveRight" class is added after the user is done editing and/or
     * creating the task. 
     */
    _componentContainer.classList.add("moveRight");
  }.bind(this);

  // Construct this object. 
  (function () {
    _componentContainer.appendChild(_icon);
    _componentContainer.classList.add("flagContainer");

    _icon.addEventListener("click", _clickHandler);
    _icon.classList.add("flagInput");
    if (_isFlagged) {
      _icon.classList.add("bi", "bi-flag-fill");
    } else {
      _icon.classList.add("bi", "bi-flag");
    }
  })();

  return { render, destroy, isFlagged, setFlag, disable };
};

export { flagTask }