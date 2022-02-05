export default class Task{
  #subject = document.createElement("p");
  #body = document.createElement("p");
  #dueDate = document.createElement("p"); //String MM/DD/YYYY

  constructor({subject, body, dueDate}){
    this.#subject.innerText = subject || "";
    this.#body.innerText = body || "";
    this.#dueDate.innerText = dueDate || "";
  }

  set subject(newSubject){
    this.#subject = newSubject;
  }

  get subject(){
    return this.#subject;
  }

  set body(newBody){
    this.body = newBody;
  }

  get body(){
    return this.#body;
  }

  set dueDate(newDate){
    this.#dueDate = newDate;
  }

  get dueDate(){
    if(this.#dueDate){
      return new Date(this.#dueDate);
    }else{
      return "";
    }
  }

  render(){
    const container = document.createElement("div");
    container.appendChild(this.#subject);
    container.appendChild(this.#body);
    container.appendChild(this.#dueDate);
    return container;
  }

  toJSON(){
    return {
      subject: this.#subject , 
      body: this.#body || "", 
      dueDate: this.#dueDate || "",
    }
  }
}