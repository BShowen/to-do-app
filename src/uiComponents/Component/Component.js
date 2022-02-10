export class Component {
  children = [];
  rootNode;
  constructor(root) {
    if(new.target === Component){
      throw new Error(`Cannot instantiate ${new.target.name} class directly`);
    }
    
    this.rootNode = root;

    if(this.mount === undefined){
      throw new Error(`this.mount is undefined`);
    }

    if(this.unmount === undefined){
      throw new Error(`this.unmount is undefined`);
    }

    if(this.render === undefined){
      throw new Error(`this.render is undefined`);
    }

    if(this.rootNode === undefined){
      throw new Error(`this.rootNode is undefined`);
    } 
  }
}