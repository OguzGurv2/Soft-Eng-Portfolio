export class Project {
    /**
     * Create and render a project card from a template and data.
     * @param {Object} data - Project data (must include name, description, html_url, etc.)
     * @param {HTMLElement} templateContainer - A container element containing the project template (like a <div> with innerHTML populated)
     */
    constructor(data, templateContainer) {
      // Guard clause for template validation
      if (!templateContainer || !templateContainer.querySelector) {
        console.error('Project: Template container is invalid or missing.');
        return;
      }
  
      // Generate the project card element by cloning and populating the template
      this.element = this._generateCardElement(templateContainer, data);
      if (!this.element) {
        return;
      }
  
      // Default to .project-container if no container is provided
      const containerSelector = '.project-container';
      this._appendToContainer(containerSelector);
    }
  
    /**
     * Internal method to clone the template and populate it with project data.
     * @param {HTMLElement} templateContainer - The container element with the <template> tag.
     * @param {Object} data - The project data to populate the template.
     * @returns {HTMLElement|null} The populated project card element or null if there was an issue.
     */
    _generateCardElement(templateContainer, data) {
      // Ensure the template container contains a <template> element
      const template = templateContainer.querySelector('template');
      if (!template) {
          console.error('Project: No <template> element found in the container.');
          return null;
      }
  
      // Access the content of the template (the actual DOM structure)
      const templateContent = template.content;
  
      // Clone the project element from the template content (deep clone)
      const projectElement = templateContent.querySelector('.project').cloneNode(true);
      if (!projectElement) {
          console.error('Project: No .project element found in the template content.');
          return null;
      }
  
      // Set project title (name)
      const titleElement = projectElement.querySelector('.project_title');
      if (titleElement) {
          titleElement.textContent = data.name || 'No Title'; // Default if name is not provided
      }
  
      // Set project description
      const descriptionElement = projectElement.querySelector('.project_description');
      if (descriptionElement) {
          descriptionElement.textContent = data.description || 'No Description Available';
      }
  
      // Set external link (e.g., GitHub project link)
      const linkElement = projectElement.querySelector('.project_expand');
      if (linkElement) {
          linkElement.href = data.html_url || '#';  // Default to '#' if no URL is provided
      }
  
      // Set the project image (assumes an image URL is available in the data)
      const imgElement = projectElement.querySelector('.project_img');
      if (imgElement) {
          imgElement.src = data.img_url; // Use a fallback image path based on project name
          imgElement.alt = data.name ? `${data.name} project image` : 'Project image'; // Ensure alt text is set for accessibility
      }
  
      return projectElement;
    }
  
    /**
     * Internal method to append the project card element to the DOM container.
     * @param {string} containerSelector - Selector of the container element to append the project card to.
     */
    _appendToContainer(containerSelector) {
      const containerEl = document.querySelector(containerSelector);
      if (!containerEl) {
        console.error('Project: No container found with the selector:', containerSelector);
        return;
      }
  
      // Append the generated project element to the container
      containerEl.appendChild(this.element);
    }
  }
  