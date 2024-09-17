import { Renderer } from "./render.js";
import { Engine } from "./logic.js";
import { preparePoem } from "./api.js";

export class InputController {
  constructor(timer, paragraphs, user) {
    this.timer = timer;
    this.paragraphs = paragraphs;
    this.user = user;
    this.currentParagraph = paragraphs[0];
    this.index = 0;
    this.paragraphEnd = false;
    this.renderer = new Renderer();
    this.engine = new Engine();
    this.initializeParagraphs();
  }
  // Initializes paragraphs for the logic checks and render
  initializeParagraphs() {
    this.paragraphs.forEach((paragraph) => {
      this.wrapEachCharacterInSpan(paragraph);
    });
    this.initializeFirstSpan();
    this.renderer.highlightCurrentWord(this.currentParagraph);
    this.renderer.hideParagraphs(10, this.paragraphs);
  }
  // Highlights first letter of new paragraph
  initializeFirstSpan() {
    const firstSpan = this.currentParagraph.querySelector("span");
    firstSpan.className = "current";
  }
  // For each character of string creates a <span>
  wrapEachCharacterInSpan(paragraph) {
    let text = paragraph.innerHTML;
    let wrappedText = Array.from(text)
      .map((char) => `<span>${char}</span>`)
      .join("");
    paragraph.innerHTML = wrappedText;
  }
  // Returns paragraphs which have beed started
  getCompletedParagraphs() {
    return this.paragraphs.slice(0, this.index + 1);
  }
  // Runs logic and render when enter is pressed
  handleEnter() {
    this.index++;
    this.renderer.completeParagraph(this.currentParagraph);
    this.renderer.unhideNthParagraph(10 + this.index, this.paragraphs);
    this.currentParagraph = this.paragraphs[this.index];
    this.initializeFirstSpan();
    this.paragraphEnd = false;
  }
  // Restarts current text test
  restart() {
    this.index = 0;
    this.paragraphs.forEach((paragraph, i) => {
      paragraph.className = "";
      paragraph.style.display = "none";
      const spans = paragraph.querySelectorAll("span");
      spans.forEach((span) => {
        span.className = "";
      });
      if (i < 10) {
        paragraph.style.display = "";
      }
    });
    this.currentParagraph = this.paragraphs[this.index];
    this.initializeFirstSpan();
    this.renderer.highlightCurrentWord(this.currentParagraph);
    this.timer.reset();
    //Reset user curent stats logic here?
  }
  // Gets new poem text and restarts
  async reset(textField, accuracyField, wpmField) {
    this.timer.reset();
    accuracyField.innerHTML = "Accuracy: 0%";
    wpmField.innerHTML = "WPM: 0";
    textField.innerHTML = `<input id="hidden-input" autofocus /><p> Loading new poem...</p>`;
    this.paragraphs = await preparePoem();
    textField.innerHTML = `<input id="hidden-input" autofocus />`;
    this.currentParagraph = this.paragraphs[0];
    this.paragraphs.forEach((paragraph) => {
      textField.appendChild(paragraph);
    });
    this.initializeParagraphs();
    this.restart();
  }
  // Checks if timer is up and saves user data on time up
  async checkForEnd() {
    return new Promise((resolve) => {
      setInterval(() => {
        if (this.timer.remainingTime === 0 && this.timer.running) {
          this.timer.stop();
          const correctWords = this.engine.getCorrectWords(this.paragraphs);
          const accuracy = this.engine.calculateAccuracy(this.paragraphs);
          const wpm = (correctWords / this.timer.duration) * 60;
          this.user.addWpmEntry(wpm);
          this.user.addAccuracyEntry(accuracy);
          resolve();
        }
      }, 1);
    });
  }
  // Handles Accuracy calculation and rendering
  handleAccuracy(DomElement) {
    let accuracy = this.engine.calculateAccuracy(
      this.paragraphs.slice(0, this.index + 1)
    );
    if (isNaN(accuracy)) {
      accuracy = 0;
    }
    this.user.accuracy = accuracy;
    this.renderer.renderAccuracy(DomElement, this.user.accuracy);
  }
  // Updates WPM on set intervals
  updateWpm(DomElement) {
    setInterval(() => {
      this.handleWpm(DomElement);
    }, 10);
  }
  // Handles WPM calculation and rendering
  handleWpm(DomElement) {
    const correctWords = this.engine.getCorrectWords(this.paragraphs);
    let elapsedSeconds = this.timer.duration - this.timer.remainingTime;
    if (elapsedSeconds === 0) {
      this.user.wpm = 0;
    } else {
      const wpm = (correctWords / elapsedSeconds) * 60;
      this.user.wpm = parseInt(wpm.toFixed(0), 10);
    }
    this.renderer.renderWpm(DomElement, this.user.wpm);
  }
  // Handles keypress logic
  async handleKeyPress(
    key,
    textField,
    accuracyField,
    wpmField,
    lineAutoComplete = false
  ) {
    if (this.paragraphs === null || this.currentParagraph === null) {
      return;
    }
    if (key !== "Shift" && !this.timer.end) {
      this.timer.start();
    }
    if (
      this.paragraphEnd === true &&
      lineAutoComplete === false &&
      key !== "Enter" &&
      key !== "Backspace"
    ) {
      // Show message for the user
      console.log("Press Enter or Backspace at line end!");
      return;
    } else if (key === "Backspace" && !this.timer.end) {
      if (this.paragraphEnd === true) {
        this.paragraphEnd = false;
      }
      if (
        !this.renderer.handleBackspace(this.currentParagraph, this.paragraphs)
      ) {
        this.index--;
        this.paragraphEnd = false;
        this.currentParagraph = this.paragraphs[this.index];
      }
    } else if (key === "Enter" && this.timer.end) {
      this.restart();
    } else if (key === "Enter" && this.paragraphEnd && !lineAutoComplete) {
      this.handleEnter();
    } else if (key === "Escape" && this.timer.end) {
      await this.reset(textField, accuracyField, wpmField);
    } else if (key !== "Shift" && this.timer.running && !this.timer.end) {
      this.renderer.renderLetter(key, this.currentParagraph);
      this.paragraphEnd = this.engine.checkForParagraphEnd(
        this.currentParagraph
      );
      if (this.paragraphEnd && lineAutoComplete) {
        this.handleEnter();
        //run correct word logic
      }
      this.renderer.highlightCurrentWord(this.currentParagraph);
    }
    this.renderer.highlightCurrentWord(this.currentParagraph);
  }
  // Focuses user input to hidden textfield
  focusInput(DOMInputField) {
    DOMInputField.focus();
  }
}
