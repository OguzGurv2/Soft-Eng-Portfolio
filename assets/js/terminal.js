export class Terminal {
    constructor() {
      this.terminalOutput = document.getElementById("terminal-output");
      this.terminalInput = document.getElementById("terminal-input");
      this.terminalInputLine = document.querySelector(".input-line");
  
      this.promptColor = "white";
      this.isFirstLoad = true;
  
      this.commands = {
        whoami: "OguzGur",
        projects: "- proj1\n- proj2\n- proj3",
        help: "Available commands: whoami, projects, clear, ascii, color [green|white|pink], help",
        clear: this.clearTerminal.bind(this),
        ascii: this.displayAsciiArt.bind(this),
        color: this.changePromptColor.bind(this),
      };
  
      // Bind the input event listener
      this.terminalInput.addEventListener("keydown", this.handleInput.bind(this));
    }
  
    // Handles user input and executes commands
    handleInput(event) {
      if (event.key === "Enter") {
        const input = this.terminalInput.value.trim();
        this.terminalOutput.innerHTML += `<div style="color: ${this.promptColor}">root@oguzgur.com ~ % ${input}</div>`;
  
        const output = this.executeCommand(input);
        if (output) this.terminalOutput.innerHTML += `<div>${output}</div>`;
  
        this.terminalInput.value = "";
        this.terminalOutput.scrollTop = this.terminalOutput.scrollHeight;
      }
    }
  
    // Parses and executes commands
    executeCommand(input) {
      const [command, ...args] = input.split(" ");
      if (typeof this.commands[command] === "function") {
        return this.commands[command](args.join(" "));
      } else if (this.commands[command]) {
        return this.commands[command];
      } else {
        return `Command not found: ${input}`;
      }
    }
  
    // Clears the terminal output
    clearTerminal() {
      this.terminalOutput.innerHTML = "";
      return "";
    }
  
    // Changes the prompt color
    changePromptColor(color) {
      const validColors = ["green", "white", "pink"];
      if (validColors.includes(color)) {
        this.promptColor = color;
        return `Prompt color changed to ${color}`;
      } else {
        return `Invalid color. Available options: ${validColors.join(", ")}`;
      }
    }
  
    // Displays ASCII art
    displayAsciiArt() {
      return `ASCII Art Placeholder`; // Replace with actual ASCII
    }
  
    // Simulates typing effect for initial load
    typeEffect(text, callback) {
      let i = 0;
      const typing = () => {
        if (i < text.length) {
          this.terminalOutput.innerHTML += text[i];
          i++;
          setTimeout(typing, 100);
        } else if (callback) {
          callback();
        }
      };
      typing();
    }
  
    // Initial welcome message and help command execution
    start() {
      if (this.isFirstLoad) {
        setTimeout(() => {
          this.isFirstLoad = false;
          this.typeEffect(`root@oguzgur.com ~ % help`, () => {
            setTimeout(() => {
              this.terminalOutput.innerHTML += `<br><div>${this.commands.help}</div>`;
              this.terminalInputLine.style.display = "flex";
              this.terminalInput.focus({ preventScroll: true });
            }, 700);
          });
        }, 1000);
      }
    }
}
