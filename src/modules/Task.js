export default class Task{
  #subject;
  #body;
  #dueDate; //String MM/DD/YYYY

  constructor({subject, body, dueDate}){
    this.#subject = subject || "";
    this.#body = body || "";
    this.#dueDate = dueDate || "";
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
    return {
      subject: this.#subject, 
      body: this.#body, 
      dueDate: this.#dueDate
    }
  }

  toJSON(){
    return {
      subject: this.#subject , 
      body: this.#body || "", 
      dueDate: this.#dueDate || "",
    }
  }
}