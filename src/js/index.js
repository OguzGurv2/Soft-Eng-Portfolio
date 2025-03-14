import { Terminal } from "./terminal.js";
import { Project } from "./project.js";

let el = {};

document.addEventListener("DOMContentLoaded", () => {

  window.scrollTo({
    top: 0
  });

  bindElements();
  initializeProjects();
  attachEventListeners();
});

function bindElements() {
  el.navIcons = document.querySelectorAll(".nav-icon");
  el.copyEmailBtn = document.querySelector("#copy-email");
  el.terminal = new Terminal();

  el.token = "";
  el.username = "OguzGurv2"
  el.repos = [
    "HIIT-Hustle",
    "Soft-Eng-Portfolio",
    "Society-Calendar-Web-App"
  ]
  el.projects = [];
}

function initializeProjects() {

  fetch("./src/templates/project-template.html")
  .then(response => response.text())  // Parse the response as text (HTML file)
  .then(html => {
    el.template = document.createElement('div');
    el.template.innerHTML = html;
  })
  .then(() => {
    for (let i = 0; i < el.repos.length; i++) {
      fetch(`https://api.github.com/repos/${el.username}/${el.repos[i]}`, {
        method: 'GET',
        headers: {
          'Authorization': `token ${el.token}`,  
        }
      })
        .then(response => response.json())
        .then(data => {
          el.projects.push(new Project(data, el.template));
        })
        .catch(error => {
          console.error('Error fetching data:', error);
        });
    }
  })
  .catch(error => {
    console.error("Error fetching template:", error);
  });

}

function attachEventListeners() {
  el.terminal.start();
  el.copyEmailBtn.addEventListener("click", (e) => copyEmail(e));

  el.navIcons.forEach((link) => {
    link.addEventListener("click", handleNavSelection);
    link.addEventListener("mouseover", handleNavHover);
    link.addEventListener("mouseout", handleNavHover);
  });
  
  setTimeout(()=> {
    window.addEventListener('scroll', observeSections)
  }, 1000);
}

function handleNavSelection(e) {
  e.preventDefault(); 
  window.removeEventListener('scroll', observeSections);

  document.querySelectorAll(".nav-icon").forEach((link) => {
    link.classList.remove("active");
  });
  e.target.closest(".nav-icon").classList.add("active");
  const target = document.querySelector(e.target.closest("a").getAttribute("href"));

  if (target.id !== "hero") {
    window.scrollTo({
      top: target.offsetTop - 80
    });
  } else {
    window.scrollTo({
      top: 0
    });
  }

  setTimeout(() => {
    window.addEventListener('scroll', observeSections);
  }, 1000);
}

function handleNavHover(e) {
  const id = e.target.closest(".nav-icon").getAttribute("data-hover");
  document.getElementById(`${id}-text`).classList.toggle("active");
}

function observeSections() {
  const targetElements = document.querySelectorAll(".observe");

  targetElements.forEach((targetElement) => {
    const rect = targetElement.getBoundingClientRect();
    if (rect.top <= 100 && rect.top > 0) {
      const navIconId = targetElement.id;
      const navIcon = document.querySelector(`[data-hover="${navIconId}"]`);
      if (navIcon) {
        document.querySelectorAll(".nav-icon").forEach((link) => {
          link.classList.remove("active");
        });
        navIcon.closest(".nav-icon").classList.add("active");
      }
    }
  });
}

function copyEmail(e) {
  navigator.clipboard.writeText("oguz.gur.cs@gmail.com");

  const spanEl = e.target.closest("a").querySelector("span");
  spanEl.textContent = "Copied!";

  clearTimeout(el.copyTimeout);

  el.copyTimeout = setTimeout(()=> {
    spanEl.textContent = "Copy Email";
  }, 2000);
}
