// This is the popover menu when you click the gear icon.
export default function () {

  const container = document.createElement("div");
  container.classList.add("tippyMenu");

  const title = document.createElement("p");
  title.innerText = "Settings";
  title.classList.add("title");

  container.appendChild(title);
  return { container }
}
