function helloWorld(){
  const h2 = document.createElement("h2");
  h2.innerText = "Hello World";
  return h2;
}

document.body.appendChild(helloWorld());