import Project from "../Project/Project";
import "./style.css";
import database from "../../database";
import NewTaskForm from "../Forms/NewTaskForm";
import { DateTime } from "luxon";
import { tasksCompleted } from "../CompletedTasksCounter/CompletedTasks";

export default class ProjectsContainer extends Component {

  container;
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

    this.container = document.createElement("div");
    this.container.id = "projectsContainer";

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
    this.container.remove();
    this.#componentIsMounted = false;
  }

  render() {
    this.mount();
    this.children.forEach(projectElement => {
      projectElement.render();
    });
    this.rootNode.appendChild(this.container);
  }

  removeChildren() {
    this.children.forEach(projectElement => {
      projectElement.unmount();
    });
    this.children = [];
  }

  addPageTitle(titleText) {
    const color = (function (titleText) {
      const colors = {
        "flagged": "Orange",
        "all": "Grey",
        "today": "Blue",
        "scheduled": "Red"
      }
      return colors[titleText.toLowerCase()];
    })(titleText);

    this.#pageTitleComponent = pageTitle({
      titleText: titleText,
      rootNode: this.container,
      textColor: color
    });
    this.children.push(this.#pageTitleComponent);
    this.#pageTitleComponent.render();
  }

  /**
   * This function is called whenever the user clicks on a project button in the
   * nav. It is responsible for displaying the tasks for the project. 
   */
  renderProject(projectID, options = { showCompletedTasks: false }) {
    // First, remove children.
    this.removeChildren();

    // Then add new children.
    // Add the project.
    const projectData = database.getProject(projectID);
    const projectRootNode = this.container;
    const projectOptions = {
      completedTasksCounter: true,
      ...options
    }
    const project = new Project(projectRootNode, projectData, projectOptions);
    this.children.push(project);
    project.render();

    /**
     * We can load the form whenever this method is called because we know that
     * only one project is showing. 
    */
    const formRootNode = this.container.firstElementChild;
    const form = new NewTaskForm(formRootNode, projectData);
    form.mount();
    this.children.push(form);
    emitter.reload = this.renderProject.bind(this, projectID);
  }

  renderAllProjects(options = { showCompletedTasks: false }) {
    // First, remove children.
    this.removeChildren();
    // Add the page title.
    this.addPageTitle("All");

    /**
     * Add the tasksCompleted component
     * Pass in {...options } because the tasksCompleted component will change 
     * the inner text from "Show" to "Hide" depending on whether or not we are
     * currently showing completed tasks. For example, if we are showing 
     * completed tasks then we want the component to show "Hide". If we are not 
     * showing completed tasks then we want the component to show "Show". 
     */
    const completedTasks = tasksCompleted.bind(this, { ...options })();
    this.children.push(completedTasks);
    completedTasks.render();

    // Add the projects
    const projects = database.getAllProjects();
    const projectRootNode = this.container;
    Object.values(projects).forEach(project => {
      const newProject = new Project(
        projectRootNode,
        project,
        {
          counter: false,
          ...options,
        }
      );
      this.children.push(newProject);
      newProject.render();
      /**
       * We can show the form only for the default project when this method is
       * called. 
       */
      if (project.default) {
        const formRootNode = this.container.lastElementChild;
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
    this.removeChildren();
    // Then add new children.

    // Add the page title.
    this.addPageTitle("Today");

    // Add the tasks.
    const allTasks = database.getTodaysTasks();
    const projectData = {
      tasks: allTasks,
      id: database.getDefaultProject().id
    }
    const project = new Project(
      this.container,
      projectData,
      { counter: false }
    );
    this.children.push(project);
    project.render();

    /**
     * We can load the form whenever this method is called because we know that
     * only one project is showing. 
    */
    const formRootNode = this.container.lastElementChild;
    const formOptions = {
      dueDate: DateTime.fromFormat(new Date()
        .toLocaleDateString(), 'M/d/yyyy')
        .toFormat('yyyy-MM-dd'),
    }
    const form = new NewTaskForm(formRootNode, projectData, formOptions);
    form.mount();
    this.children.push(form);
    emitter.reload = this.renderTodaysProjects.bind(this);
  }

  renderScheduledProjects(options = { showCompletedTasks: false }) {
    // First, remove children.
    this.removeChildren();

    // Add the page title.
    this.addPageTitle("Scheduled");

    // Add the tasks.
    const scheduledTasks = database.getTasksWithDate();
    const projectRootNode = this.container;
    Object.keys(scheduledTasks).forEach(date => {
      const projectTitle = this.#getDateTile(date);
      const projectData = {
        name: projectTitle,
        tasks: scheduledTasks[date],
        // id: database.getDefaultProject().id
      }
      const newProject = new Project(
        projectRootNode,
        projectData,
        {
          counter: false,
          ...options,
        }
      );
      this.children.push(newProject);
      newProject.render();

      // if (projectTitle == "Today") {
      //   const formRootNode = this.container.lastElementChild;
      //   const form = new NewTaskForm(formRootNode, projectData);
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

    return taskDate.toFormat("ccc LLL dd");
  }

  renderFlaggedProjects(options = { showCompletedTasks: false }) {
    // First, remove children.
    this.children.forEach(projectElement => {
      projectElement.unmount();
    });
    this.children = [];

    // Then add new children.
    // Add the page title.
    this.addPageTitle("Flagged");

    // Add the tasks. 
    const tasks = database.getFlaggedTasks();
    const projectRootNode = this.container;
    const project = {
      tasks: tasks,
    }
    const newProject = new Project(
      projectRootNode,
      project,
      {
        counter: false,
        ...options
      }
    );
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
  if (textColor) {
    _element.classList.add(textColorClass[textColor]);
  }

  const unmount = function () {
    _container.remove();
  }

  const render = function () {
    rootNode.appendChild(_container);
  }

  _container.appendChild(_element);
  return { render, unmount }
};