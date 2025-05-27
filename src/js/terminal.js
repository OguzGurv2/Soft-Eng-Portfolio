export class Terminal {
  /**
   * Simulates a terminal interface on a portfolio webpage.
   * Handles commands, terminal output, and interactive features.
   * @param {string} outputSelector - CSS selector for the terminal output container.
   * @param {string} inputSelector  - CSS selector for the terminal input field.
   * @param {string} prompt        - The prompt string to display before each command (e.g., "root@site.com ~ %").
   */
  constructor(outputSelector = '#terminal-output', inputSelector = '#terminal-input', inputLine = ".input-line", prompt = 'root@oguzgur.com ~ %') {
    // DOM elements for output display and user input
    this.outputElement = document.querySelector(outputSelector);
    this.inputElement  = document.querySelector(inputSelector);
    this.inputLine = document.querySelector(inputLine);
    this.prompt = prompt;

    // Command history and index for navigating through history
    this.commandHistory = [];
    this.historyIndex = -1;

    // Supported color themes and their corresponding CSS body classes
    this.supportedThemes = {
      white: 'white',  // white text on black background (default)
      green:   'green',    // green text on black background
      red:     'red'       // red text theme
    };

    // Ensure the essential elements exist
    if (!this.outputElement || !this.inputElement || !this.inputLine) {
      console.error('Terminal: Output container or input field not found in DOM.');
      return;
    }
  }

  /**
   * Initialize the terminal: set up event listeners and show a welcome message.
   */
  init() {
    // Focus the input whenever the user clicks anywhere (to mimic an always-ready terminal)
    document.addEventListener('click', () => this.inputLine?.focus());

    // Handle keyboard events for the input field
    this.inputLine.addEventListener('keydown', (e) => this.handleKeyDown(e));

    // Display an initial help message with performing a startup typing effect
    this.simulateTyping("root@oguzgur.com ~ % help", () => {
      this.showHelp();  // Automatically show help on startup
      this.inputLine.style.display = "flex";     // Focus the input field for user interaction
      this.inputElement.style.color = "white";
      this.inputElement.focus({ preventScroll: true });
    });
  }

  /**
   * Handle keydown events on the input field:
   * - Enter: execute the entered command.
   * - ArrowUp/ArrowDown: navigate through command history.
   */
  handleKeyDown(event) {
    const { key } = event;
    if (key === 'Enter') {
      event.preventDefault();  // Prevent form submission or default newline
      const command = this.inputElement.value.trim();
      this.executeCommand(command);
    } else if (key === 'ArrowUp' || key === 'ArrowDown') {
      event.preventDefault();
      // Navigate history: true for up (previous command), false for down (next command)
      this.navigateHistory(key === 'ArrowUp');
    }
  }

  /**
   * Execute a command string entered by the user.
   * - Echoes the command to the output with the prompt.
   * - Parses the command and calls the appropriate handler.
   * @param {string} command - The full command typed by the user.
   */
  executeCommand(command) {
    if (command === '') {
      // Do nothing on empty command (just skip a line or keep prompt)
      return;
    }

    // Echo the command to the output (with prompt and user input)
    this._echoCommand(command);

    // Store the command in history (avoid storing empty strings)
    this.commandHistory.push(command);
    this.historyIndex = this.commandHistory.length;  // reset history index to just after the last entry

    // Parse the command and arguments
    const [baseCmd, ...args] = command.split(/\s+/);  // split by whitespace
    const normalizedCmd = baseCmd.toLowerCase();      // case-insensitive commands

    // Determine which command to run
    switch (normalizedCmd) {
      case 'help':
        this.showHelp();
        break;
      case 'whoami':
        this.showWhoAmI();
        break;
      case 'projects':
        this.showProjects();
        break;
      case 'clear':
        this.clearScreen();
        break;
      case 'color':
        this.changeColor(args[0]);  // pass the first argument (theme name) if provided
        break;
      case 'game':
        this.playGame(args[0]);  // pass the first argument (game name) if provided
        break;
      default:
        // If command is not recognized, inform the user
        this.printOutput(`Unknown command: ${normalizedCmd}. Type "help" to see available commands.`, 'error');
        break;
    }

    // Ensure the latest output is visible
    this.scrollToBottom();
    // Clear the input field for the next command
    this.inputElement.value = '';
  }

  /**
   * Display the list of available commands and brief descriptions for each.
   */
  showHelp() {
    this.printOutput("Available commands: help, whoami, projects, clear, color [white | red | green], game [ping-pong] ", 'info');
  }

  /**
   * Show information about the user/developer (bio or about section).
   */
  showWhoAmI() {
    const section = document.getElementById('about') || document.getElementById('about-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      this.printOutput("Opened the About section.", 'info');
    } 
  }

  /**
   * Show the projects or navigate to the projects section of the page.
   * If a specific projects section exists in the HTML, scroll to it; otherwise list projects.
   */
  showProjects() {
    const section = document.getElementById('projects') || document.getElementById('projects-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
      this.printOutput("Opened the Projects section.", 'info');
    } 
  }

  /**
   * Clear the terminal output screen.
   * Removes all previous output lines from the terminal display.
   */
  clearScreen() {
    this.outputElement.innerHTML = '';  
  }

  /**
   * Change the terminal's color theme.
   * Applies a CSS class to the document body (or terminal container) to change styling.
   * @param {string} themeName - The name of the theme to apply (must be one of the supported theme keys).
   */
  changeColor(themeName) {
    if (!themeName) {
      this.printOutput(`Usage: color <theme>. Available themes: ${Object.keys(this.supportedThemes).join(', ')}`, 'info');
      return;
    }
    const theme = themeName.toLowerCase();
    if (this.supportedThemes[theme]) {
      const body = document.querySelector(".hero-terminal");
      this.inputElement.style.color = `${theme}`;  // Change input text color
      body.style.color = `${theme}`;  // Reset any previous color
    } else {
      this.printOutput(`Theme "${theme}" not found. Available themes: ${Object.keys(this.supportedThemes).join(', ')}.`, 'error');
    }
  }

  /**
   * Execute the surprise "game" command.
   * Launches the game in a new tab if the game exists.
   * @param {string} game - The name of the game to be launched (e.g., "ping-pong").
   */
  playGame(game) {
    if (!game) {
      this.printOutput(`Usage: game <game-name>. Available games: ping-pong`, 'info');
      return;
    }
    game = game.toLowerCase();
    if (game === "ping-pong") {
      // Simulate some processing time before opening the game
      setTimeout(() => {
        window.open("/ping-pong.html", "_blank");
      }, 1500);

      // Inform the user that the game is initializing
      this.printOutput("Initializing game...", "info");
    } else {
      // Handle the case where the game is not found
      this.printOutput(`Game not found: ${game}`, "error");
    }
  }


  /**
   * Navigate through the command history in response to arrow key presses.
   * @param {boolean} up - If true, move to an older command (ArrowUp); if false, move to a newer command (ArrowDown).
   */
  navigateHistory(up) {
    if (up) {
      if (this.historyIndex > 0) {
        this.historyIndex -= 1;
        this.inputElement.value = this.commandHistory[this.historyIndex] || '';
      }
    } else {
      if (this.historyIndex < this.commandHistory.length - 1) {
        this.historyIndex += 1;
        this.inputElement.value = this.commandHistory[this.historyIndex] || '';
      } else {
        this.historyIndex = this.commandHistory.length;
        this.inputElement.value = '';
      }
    }
    this.inputElement.selectionStart = this.inputElement.selectionEnd = this.inputElement.value.length;
  }

  /**
   * Simulate a typing effect by outputting text character-by-character.
   * @param {string} text - The text to be "typed out" in the terminal output.
   * @param {Function} [callback] - An optional function to call once typing is complete.
   */
  simulateTyping(text, callback) {
    if (!text) {
      callback?.();
      return;
    }
    const line = document.createElement('div');
    this.outputElement.appendChild(line);

    this.inputElement.disabled = true;
    let index = 0;
    const typingSpeed = 50;

    const typer = setInterval(() => {
      if (index < text.length) {
        line.textContent += text.charAt(index);
        index += 1;
        this.scrollToBottom();
      } else {
        clearInterval(typer);
        this.inputElement.disabled = false;
        this.inputElement.focus();
        callback?.();
      }
    }, typingSpeed);
  }

  /**
   * Print a line of text to the terminal output area.
   * @param {string} text - The text content to display as a new line.
   * @param {string} [className] - Optional CSS class to add to the line (for styling purpose, e.g., 'error' or 'info').
   */
  printOutput(text, className) {
    const line = document.createElement('div');
    if (className) {
      line.classList.add(className);
    }
    line.textContent = text;
    this.outputElement.appendChild(line);
  }

  /**
   * Scroll the terminal output container to the bottom, so the latest content is visible.
   */
  scrollToBottom() {
    this.outputElement.scrollTop = this.outputElement.scrollHeight;
  }

  /**
   * Internal helper to echo the user's command (with prompt) to the output.
   * @param {string} command - The command string that the user entered.
   */
  _echoCommand(command) {
    const line = document.createElement('div');
    const promptSpan = document.createElement('span');
    promptSpan.classList.add('prompt');
    promptSpan.textContent = this.prompt;
    const cmdSpan = document.createElement('span');
    cmdSpan.classList.add('user-input');
    cmdSpan.textContent = ' ' + command;
    line.appendChild(promptSpan);
    line.appendChild(cmdSpan);
    this.outputElement.appendChild(line);
  }
}
