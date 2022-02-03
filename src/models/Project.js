import Task from "./Task.js";

export default class Project{

  #name;
  #tasks;
  #taskIndex;

  constructor({name, tasks}){
    this.#name = name;
    this.#tasks = tasks || {};
    this.#taskIndex = Object.keys(this.#tasks).length;
  }

  get name(){
    return this.#name;
  }

  set name(newName){
    this.#name = newName;
  }

  get tasks(){
    return this.#tasks;
  }

  /**
   * Add a new task to this project. 
   */
  addTask(newTask){
    this.#tasks[ this.#taskIndex++ ] = newTask;
  }

  render(){
    return {
      name: this.#name
    }
  }

  /**
   * Return a JSON representation of this object - which can be used in the 
   * constructor to reconstruct this object. 
   */
  toJSON(){
    return {
      name: this.#name,
      tasks: JSON.stringify(this.#tasks),
    }
  }
}