/**
 * The component that renders the icon in the default project buttons (these are
 * the buttons in the top left of the screen).
 * 
 * The value of "this" is bound to the DefaultProjectButton class that uses this
 * module.
 */
const buttonIcon = function (defaultProjectName) {
  const _iconClass = {
    All: ["bi", "bi-inbox-fill"],
    Today: ["bi", "bi-calendar-event"],
    Scheduled: ["bi", "bi-calendar3"],
    Flagged: ["bi", "bi-flag-fill"],
  }

  const _container = document.createElement("div");
  const _icon = document.createElement("i");

  (function () {
    _icon.classList.add(..._iconClass[defaultProjectName]);
    _container.classList.add(
      "defaultProjectButtonIconContainer",
      defaultProjectName
    );
    _container.appendChild(_icon);
  }.bind(this))();

  const mount = function () {
    this.container.appendChild(_container);
  }.bind(this);

  const unmount = function () {
    _container.remove();
  }.bind(this);

  return { mount, unmount }
}

export { buttonIcon }