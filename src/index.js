import "reset-css";
import "./index.css";
import Nav from "./uiComponents/Nav/Nav.js";
import database from "./database.js";
import ModalWindow from "./uiComponents/Modal/ModalWindow.js";
import ContentContainer from "./uiComponents/ContentContainer/ContentContainer.js";

(function () {
  const rootNode = document.querySelector("body");
  const modal = new ModalWindow(rootNode);
  const nav = new Nav(rootNode);
  const body = new ContentContainer(rootNode);


  /**
   * Callback that gets called when the user submits the new project form. We
   * save the project, then display the tasks-view for this project. 
   */
  function _saveNewProject(formData = {}) {
    const project = {
      ...formData,
      default: false,
      tasks: {}
    };
    const savedProject = database.saveProject(project);
    /**
     * We should call nav.newProject rather than re-rendering the entire nav 
     * again. newProject can accept the newly saved project and simply create 
     * a new userProjectsButton, passing in the userProjectsButton container 
     * and the userProjectsButton will append itself to the container. 
     */
    // nav.render(); 
    nav.addButton(savedProject);
    // Load the tasks view for this project.  
    emitter.emit("loadTasks", savedProject.id);
  }
  _saveNewProject = _saveNewProject.bind(this);
  emitter.on("saveNewProject", _saveNewProject);

  // Initialize application
  (function () {
    nav.render();
    body.render();
    emitter.emit("loadAllProjects");
  })();

})();