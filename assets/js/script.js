import { Terminal } from "./terminal.js";

let el = {};

document.addEventListener("DOMContentLoaded", () => {

  window.scrollTo({
    top: 0
  });

  bindElements();
  attachEventListeners();
});

function bindElements() {
  el.navIcons = document.querySelectorAll(".nav-icon");
  el.copyEmailBtn = document.querySelector("#copy-email");
  el.terminal = new Terminal();
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
