import database from "../../database";
/**
 * When the user double clicks a projects title (in the nav) they will be able 
 * to change the title name. 
 */
function doubleClickHandler() {
  const input = (() => {
    const inputElement = document.createElement("input");
    inputElement.type = "text";
    inputElement.classList.add("removeDefaultStyling");
    inputElement.id = "projectNameChange";
    inputElement.placeholder = this.project.name;
    return inputElement;
  })();

  const _updateProjectInDatabase = () => {
    database.updateProject(this.project);
  }

  const keydownListener = (e) => {
    if (e.key == 'Enter') {
      if (input.value.trim().length > 0) {
        document.removeEventListener('keydown', keydownListener);
        this.projectName = input.value.trim();
        this.project.name = input.value.trim();
        _updateProjectInDatabase();
        input.remove();
        this.button.innerText = this.projectName;
        this.addIconToButton();
        emitter.reload();
      } else {
        _abort();
      }
    } else if (e.key == 'Escape') {
      _abort();
    }
  };

  const _abort = () => {
    document.removeEventListener('click', _abort);
    document.removeEventListener('keydown', keydownListener);
    input.remove();
    this.button.innerText = this.projectName;
    this.addIconToButton();
  }

  const _abortOnClick = () => {
    document.addEventListener('click', _abort);
  }

  this.button.innerText = '';
  this.button.appendChild(input);
  input.focus();
  _abortOnClick();
  document.addEventListener('keydown', keydownListener);
}

export { doubleClickHandler }