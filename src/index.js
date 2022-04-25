import "reset-css";
import "./index.css";
import "./variables.css";
import Nav from "./uiComponents/Nav/Nav.js";
import database from "./database.js";
import ModalWindow from "./uiComponents/Modal/ModalWindow.js";
import ContentContainer from "./uiComponents/ContentContainer/ContentContainer";

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
     * Emit "resetProjectButtonActiveStatus" BEFORE calling nav.addButton()
     * because "resetProjectButtonActiveStatus" will reset ALL the project nav
     * buttons and then nav.addButton() will add a new button which will be 
     * selected by default. If we call "resetProjectButtonActiveStatus" after 
     * nav.addButton() then the newly created project button will be styled and 
     * immediately have its styling reset by "resetProjectButtonActiveStatus".
     */
    emitter.emit("resetProjectButtonActiveStatus");

    nav.addButton(savedProject);
    // Load the tasks view for this project.  
    emitter.emit("loadTasks", savedProject.id);
  }
  _saveNewProject = _saveNewProject.bind(this);
  emitter.on("saveNewProject", _saveNewProject);

  // Initialize application
  const loadApp = function () {
    nav.render();
    body.render();
    emitter.emit("loadAllProjects");
  };

  loadApp();
  emitter.on("reloadApp", loadApp);

})();