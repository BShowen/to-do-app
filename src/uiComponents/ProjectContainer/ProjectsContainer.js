import Project from "../Project/Project";
import "./style.css";
import database from "../../database";
import NewTaskForm from "../Forms/NewTaskForm";
import { DateTime } from "luxon";

export default class ProjectsContainer extends Component {

  #container;
  #pageTitleComponent;
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
    this.renderTodaysProjects = this.renderTodaysProjects.bind(this);
    this.renderScheduledProjects = this.renderScheduledProjects.bind(this);
    this.renderFlaggedProjects = this.renderFlaggedProjects.bind(this);

    this.#container = document.createElement("div");
    this.#container.id = "projectsContainer";

    emitter.on("loadTasks", this.renderProject);
    emitter.on("loadAllProjects", this.renderAllProjects);
    emitter.on("loadTodayProjects", this.renderTodaysProjects);
    emitter.on("loadScheduledProjects", this.renderScheduledProjects);
    emitter.on("loadFlaggedProjects", this.renderFlaggedProjects);


    this.#componentIsMounted = true;
  }

  unmount() {
    emitter.off("loadTasks", this.renderProject);
    emitter.off("loadAllProjects", this.renderAllProjects);
    emitter.off("loadTodayProjects", this.renderTodaysProjects);
    emitter.off("loadScheduledProjects", this.renderScheduledProjects);
    emitter.off("loadFlaggedProjects", this.renderFlaggedProjects);
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
    emitter.reload = this.renderProject.bind(this, projectID);
  }

  renderAllProjects() {
    this.#container.removeEventListener('click', this.toggleForm);
    // First, remove children.
    this.children.forEach(projectElement => {
      projectElement.unmount();
    });
    this.children = [];
    // Then add new children.
    // Add the page title.
    this.#pageTitleComponent = pageTitle({
      titleText: "All",
      rootNode: this.#container,
      textColor: "Grey"
    });
    this.children.push(this.#pageTitleComponent);
    this.#pageTitleComponent.render();

    // Add the projects
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
    emitter.reload = this.renderAllProjects.bind(this);
  }

  renderTodaysProjects() {
    // First, remove children.
    this.children.forEach(projectElement => {
      projectElement.unmount();
    });
    this.children = [];
    // Then add new children.

    // Add the page title.
    this.#pageTitleComponent = pageTitle({
      titleText: "Today",
      rootNode: this.#container,
      textColor: "Blue"
    });
    this.children.push(this.#pageTitleComponent);
    this.#pageTitleComponent.render();

    // Add the tasks.
    const allTasks = database.getTodaysTasks();
    const projectData = {
      tasks: allTasks,
      id: database.getDefaultProject().id
    }
    const project = new Project(this.#container, projectData)
    this.children.push(project);
    project.render();

    /**
     * We can load the form whenever this method is called because we know that
     * only one project is showing. 
    */
    const formRootNode = this.#container.firstElementChild;
    const options = {
      dueDate: DateTime.fromFormat(new Date()
        .toLocaleDateString(), 'M/d/yyyy')
        .toFormat('yyyy-MM-dd'),
    }
    const form = new NewTaskForm(formRootNode, projectData, options);
    form.mount();
    this.children.push(form);
    emitter.reload = this.renderTodaysProjects.bind(this);
  }

  renderScheduledProjects() {
    // First, remove children.
    this.children.forEach(projectElement => {
      projectElement.unmount();
    });
    this.children = [];
    // Then add new children.
    // Add the page title.
    this.#pageTitleComponent = pageTitle({
      titleText: "Scheduled",
      rootNode: this.#container,
      textColor: "Red"
    });
    this.children.push(this.#pageTitleComponent);
    this.#pageTitleComponent.render();

    // Add the tasks.
    const scheduledTasks = database.getTasksWithDate();
    const projectRootNode = this.#container;
    Object.keys(scheduledTasks).forEach(date => {
      const projectTitle = this.#getDateTile(date);
      const projectData = {
        name: projectTitle,
        tasks: scheduledTasks[date],
        // id: database.getDefaultProject().id
      }
      const newProject = new Project(projectRootNode, projectData);
      this.children.push(newProject);
      newProject.render();
      /**
       * We can show the form only for the default project when this method is
       * called. 
       */
      // if (project.default) {
      //   const formRootNode = this.#container.lastElementChild;
      //   const formOptions = { canRenderOnBodyClick: false };
      //   const form = new NewTaskForm(formRootNode, project, formOptions);
      //   form.mount();
      //   this.children.push(form);
      // }
    });

    emitter.reload = this.renderScheduledProjects.bind(this);
  }

  /**
   * Returns either "Yesterday", "Today", "Tomorrow", or the date that was 
   * passed in. 
   * 
   * This method is used to set the title of the Project that we use when
   * rendering projects for the Scheduled view. 
   */
  #getDateTile(date) {
    const FORMAT = "MM/dd/yy";
    const todaysDate = DateTime.now();
    //Create luxon date object for easy date comparing. 
    const taskDate = DateTime.fromFormat(date, FORMAT);

    if (todaysDate.toFormat(FORMAT) == taskDate.toFormat(FORMAT)) {
      // If the dates are the same. 
      return "Today";
    } else if (
      // Make sure the day, month, and year are checked
      // Title is "Tomorrow" if today - task date = -1
      (todaysDate.month == taskDate.month) &&
      (todaysDate.day - taskDate.day == -1) &&
      (todaysDate.year == taskDate.year)
    ) {
      return "Tomorrow";
    } else if (
      // Make sure the day, month, and year are checked
      // Title is "Tomorrow" if today - task date = 1
      (todaysDate.month == taskDate.month) &&
      (todaysDate.day - taskDate.day == 1) &&
      (todaysDate.year == taskDate.year)
    ) {
      return "Yesterday";
    }
    return date;
  }

  renderFlaggedProjects() {
    // First, remove children.
    this.children.forEach(projectElement => {
      projectElement.unmount();
    });
    this.children = [];

    // Then add new children.
    // Add the page title.
    this.#pageTitleComponent = pageTitle({
      titleText: "Flagged",
      rootNode: this.#container,
      textColor: "Orange"
    });
    this.children.push(this.#pageTitleComponent);
    this.#pageTitleComponent.render();

    // Add the tasks. 
    const tasks = database.getFlaggedTasks();
    const projectRootNode = this.#container;
    const project = {
      tasks: tasks,
    }
    const newProject = new Project(projectRootNode, project);
    this.children.push(newProject);
    newProject.render();

    emitter.reload = this.renderScheduledProjects.bind(this);
  }
}

// A component for creating the page title. 
const pageTitle = function ({ titleText, rootNode, textColor }) {
  // CSS text colors
  const textColorClass = {
    Grey: "textColorIosGrey",
    Red: "textColorIosRed",
    Orange: "textColorIosOrange",
    Blue: "textColorIosBlue"
  }

  const _container = document.createElement("div");
  _container.classList.add("pageTitle");

  const _element = document.createElement("p");
  _element.innerText = titleText;
  _element.classList.add(textColorClass[textColor]);

  const unmount = function () {
    _container.remove();
  }

  const render = function () {
    rootNode.appendChild(_container);
  }

  _container.appendChild(_element);
  return { render, unmount }
}