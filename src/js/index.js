import { Terminal } from "./terminal.js";
import { Project } from "./project.js";

let el = {};

/**
 * Runs when the DOM content is fully loaded.
 * Disables the browser's automatic scroll restoration, ensuring the page always scrolls to the top.
 * Binds elements and attaches event listeners required for the page's functionality.
 */
document.addEventListener("DOMContentLoaded", () => {
  // Disable the browser's default scroll restoration behavior
  if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual'; // Disables auto-scroll restoration on page reloads
  }

  // Scroll the page to the top when it's loaded, regardless of any previous scroll position
  window.scrollTo(0, 0);

  // Bind all the necessary DOM elements for further use
  bindElements();

  // Attach event listeners to handle user interactions
  attachEventListeners();
});

/**
 * Binds all essential elements to the `el` object and initializes necessary components.
 * Fetches JSON data and HTML template required for the projects section and initializes the terminal interface.
 */
async function bindElements() {
  try {

    // Determine if the device is mobile based on window width
    el.isMobile = window.innerWidth <= 768;
    console.log("Is Mobile:", el.isMobile);
    // Bind navigation icon elements
    el.navIcons = document.querySelectorAll(".nav-icon");

    // Bind email copy button element
    el.copyEmailBtn = document.querySelector("#copy-email");

    // Initialize the terminal interface
    el.terminal = new Terminal();

    // Fetch and assign the projects data using Axios
    const response = await axios.get("./src/media/json/projects.json");
    el.projects = response.data.projects;  // Assign project data to el.projects

    // Fetch and parse the HTML template using Axios
    const templateResponse = await axios.get("./src/templates/project-template.html");
    el.template = document.createElement('div');
    el.template.innerHTML = templateResponse.data;  // Insert HTML template

    // Initialize Project instances for each project in the fetched data
    el.projects.forEach(project => {
      new Project(project, el.template);
    });

    // Initialize the terminal interface after binding elements
    el.terminal.init();
  } catch (error) {
    // Log error if any of the fetch or Axios requests fail
    console.error("Error fetching data:", error);
  }
}

/**
 * Attaches event listeners to various DOM elements.
 * Includes click, mouseover, and mouseout events for navigation icons and a click event for the copy email button.
 * Also sets up an event listener for the scroll event with a small delay to observe sections.
 */
function attachEventListeners() {
  // Attach a click event listener to the "Copy Email" button
  el.copyEmailBtn.addEventListener("click", (e) => copyEmail(e));

  // Attach event listeners to each navigation icon for click and hover interactions
  el.navIcons.forEach((link) => {
    // Click event for navigation selection
    link.addEventListener("click", handleNavSelection);

    if (el.isMobile) return; // Do not apply hover effects on mobile devices
    
    // Hover event to highlight navigation icons
    link.addEventListener("mouseover", handleNavHover);
    link.addEventListener("mouseout", handleNavHover);
  });

  // Add a delay before attaching the scroll event listener
  // This ensures the scroll observer is added after other elements are initialized
  setTimeout(() => {
    // Listen for scroll events to observe sections and update active navigation items
    window.addEventListener('scroll', observeSections);
  }, 10);
}

/**
 * Handles the navigation selection event.
 * Prevents default link behavior, removes the "active" class from all nav icons,
 * adds the "active" class to the selected nav icon, and smoothly scrolls to the target section.
 * Also temporarily disables and re-enables the scroll event listener during navigation.
 * @param {Event} e - The click event triggered by selecting a navigation item.
 */
function handleNavSelection(e) {
  // Prevent the default behavior of anchor links (e.g., jumping to a section)
  e.preventDefault();

  // Remove the scroll event listener temporarily to prevent unwanted behavior
  window.removeEventListener('scroll', observeSections);

  // Remove the "active" class from all navigation icons
  document.querySelectorAll(".nav-icon").forEach((link) => {
    link.classList.remove("active");
  });

  // Add the "active" class to the clicked navigation icon
  e.target.closest(".nav-icon").classList.add("active");

  // Get the target section based on the clicked navigation item's href attribute
  const target = document.querySelector(e.target.closest("a").getAttribute("href"));

  // Scroll to the target section, with an offset for better positioning
  if (target.id !== "hero") {
    // Scroll to the target section minus an offset of 80px for a better view
    window.scrollTo({
      top: target.offsetTop - 80,
      behavior: 'smooth'  // Optional: For smoother scrolling
    });
  } else {
    // If the target is the "hero" section, scroll to the top of the page
    window.scrollTo({
      top: 0,
      behavior: 'smooth'  // Optional: For smoother scrolling
    });
  }

  // Re-enable the scroll event listener after a small delay (1 second)
  setTimeout(() => {
    window.addEventListener('scroll', observeSections);
  }, 1000);
}

/**
 * Handles the hover event on navigation icons.
 * Toggles the "active" class on the corresponding text element associated with the hovered navigation icon.
 * @param {Event} e - The mouseover or mouseout event triggered by hovering over a navigation icon.
 */
function handleNavHover(e) {
  // Get the data-hover attribute value of the closest navigation icon
  const id = e.target.closest(".nav-icon").getAttribute("data-hover");

  // Toggle the "active" class on the corresponding text element associated with the hovered icon
  document.getElementById(`${id}-text`).classList.toggle("active");
}

/**
 * Observes the visibility of sections as the user scrolls.
 * Checks if a section is in the viewport and activates the corresponding navigation icon.
 */
function observeSections() {
  // Select all elements with the "observe" class, which are the sections to track
  const targetElements = document.querySelectorAll(".observe");

  // Iterate over each section to determine its position relative to the viewport
  targetElements.forEach((targetElement) => {
    // Get the position of the section relative to the viewport
    const rect = targetElement.getBoundingClientRect();

    // Check if the section is within a certain range of the viewport (top of the section is within 100px)
    if (rect.top <= 100 && rect.top > 0) {
      // Get the ID of the section to find the corresponding nav icon
      const navIconId = targetElement.id;

      // Find the nav icon that corresponds to the current section
      const navIcon = document.querySelector(`[data-hover="${navIconId}"]`);

      // If the corresponding nav icon is found, update the active state
      if (navIcon) {
        // Remove the "active" class from all navigation icons
        document.querySelectorAll(".nav-icon").forEach((link) => {
          link.classList.remove("active");
        });

        // Add the "active" class to the nav icon that corresponds to the visible section
        navIcon.closest(".nav-icon").classList.add("active");
      }
    }
  });
}

/**
 * Handles the click event for copying the email to the clipboard.
 * Updates the UI to inform the user that the email has been copied, 
 * and reverts the message after a short delay.
 * @param {Event} e - The click event triggered by the "Copy Email" button.
 */
function copyEmail(e) {
  // Write the email to the clipboard
  navigator.clipboard.writeText("oguz.gur.cs@gmail.com");

  // Find the closest <a> element and locate the <span> inside it to update the text content
  const spanEl = e.target.closest("a").querySelector("span");

  // Change the text content of the <span> to show "Copied!" after the email is copied
  spanEl.textContent = "Copied!";

  // Clear any existing timeout to ensure only the most recent one is used
  clearTimeout(el.copyTimeout);

  // Set a timeout to revert the text content back to "Copy Email" after 2 seconds
  el.copyTimeout = setTimeout(() => {
    spanEl.textContent = "Copy Email";
  }, 2000);
}
