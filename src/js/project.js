export class Project {
    constructor(data, template) {
        this.node = template.querySelector("template").content.cloneNode(true);
        this.data = data;
        console.log(this.data)
        
        const project = this.node.querySelector(".project");
        project.querySelector(".project_img").src = `./src/media/icons/${this.data.name}.svg`;
        project.querySelector(".project_title").textContent = this.data.name;
        project.querySelector(".project_description").textContent = this.data.description;
        project.querySelector(".project_expand").href = this.data.html_url;
            
        document.querySelector(".project-container").appendChild(this.node)
    }
}