import Project from "../Project/Project";
import "./style.css";
import database from "../../database";
import NewTaskForm from "../Forms/NewTaskForm";

export default class ProjectsContainer extends Component {

  #container;
  #componentIsMounted = false;

  constructor(rootNode) {
    super(rootNode);
  }

  mount() {
    if (this.#componentIsMounted) {
      this.unmount();
    }

    this.renderAllProjects = this.renderAllProjects.bind(this);
    this.renderProject = this.renderProject.bind(this);

    this.#container = document.createElement("div");
    this.#container.id = "projectsContainer";

    emitter.on("loadTasks", this.renderProject);
    emitter.on("loadAllProjects", this.renderAllProjects);


    this.#componentIsMounted = true;
  }

  unmount() {
    emitter.off("loadTasks", this.renderProject);
    emitter.off("loadAllProjects", this.renderAllProjects);
    this.children.forEach(projectElement => {
      projectElement.unmount();
    });
    this.children = [];
    this.#container.remove();
    this.#componentIsMounted = false;
  }

  render() {
    this.mount();
    this.children.forEach(projectElement => {
      projectElement.render();
    });
    this.rootNode.appendChild(this.#container);
  }

  /**
   * This function is called whenever the user clicks on a project button in the
   * nav. It is responsible for displaying the tasks for the project. 
   */
  renderProject(projectID) {
    // First, remove children.
    this.children.forEach(projectElement => {
      projectElement.unmount();
    });
    this.children = [];
    // Then add new children.
    const project = database.getProject(projectID)
    const projectRootNode = this.#container;
    const newProject = new Project(projectRootNode, project);
    this.children.push(newProject);
    newProject.render();

    /**
     * We can load the form whenever this method is called because we know that
     * only one project is showing. 
    */
    const formRootNode = this.#container.firstElementChild;
    const form = new NewTaskForm(formRootNode, project);
    form.mount();
    this.children.push(form);
  }

  renderAllProjects() {
    this.#container.removeEventListener('click', this.toggleForm);
    // First, remove children.
    this.children.forEach(projectElement => {
      projectElement.unmount();
    });
    this.children = [];
    // Then add new children.
    const projects = database.getAllProjects();
    const projectRootNode = this.#container;
    Object.values(projects).forEach(project => {
      const newProject = new Project(projectRootNode, project);
      this.children.push(newProject);
      newProject.render();
      /**
       * We can show the form only for the default project when this method is
       * called. 
       */
      if (project.default) {
        const formRootNode = this.#container.lastElementChild;
        const formOptions = { canRenderOnBodyClick: false };
        const form = new NewTaskForm(formRootNode, project, formOptions);
        form.mount();
        this.children.push(form);
      }
    });
  }
}