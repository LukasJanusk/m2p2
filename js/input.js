import { Renderer } from "./render.js";
import { Engine } from "./logic.js";
import { preparePoem } from "./api.js";

export class InputController {
  constructor(timer, paragraphs) {
    this.paragraphs = paragraphs;
    this.currentParagraph = paragraphs[0];
    this.remainingText = null;
    this.correctWords = [];
    this.incorrectWords = [];
    this.timer = timer;
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
    this.renderer.hideParagraph(this.currentParagraph);
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
  async reset(textField) {
    textField.innerHTML = `<input id="hidden-input" autofocus />Loading new poem...`;
    this.paragraphs = await preparePoem();
    textField.innerHTML = `<input id="hidden-input" autofocus />`;
    this.currentParagraph = this.paragraphs[0];
    this.paragraphs.forEach((paragraph) => {
      textField.appendChild(paragraph);
    });
    this.initializeParagraphs();
    this.restart();
  }
  handleAccuracy(DomElement) {
    let accuracy = this.engine.calculateCorrectWords(
      this.paragraphs.slice(0, this.index + 1)
    );
    if (isNaN(accuracy)) {
      accuracy = 0;
    }
    this.renderer.renderAccuracy(DomElement, accuracy);
  }
  handleWpm(DomElement) {
    setInterval(() => {
      const correctWords = this.engine.getCorrectWords(this.paragraphs);
      const elapsedSeconds = this.timer.duration - this.timer.remainingTime;
      const wpm = (correctWords / elapsedSeconds) * 60;
      this.renderer.renderWpm(DomElement, wpm);
    }, 500);
  }
  // Handles keypress logic
  async handleKeyPress(key, textField, lineAutoComplete = false) {
    if (this.paragraphs === null || this.currentParagraph === null) {
      return;
    }
    if (key !== "Shift" && !this.timer.end) {
      this.timer.start();
    }
    console.log(`Key pressed: ${key}`);
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
      await this.reset(textField);
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
      console.log(
        `Word accuracy: ${this.engine.calculateCorrectWords(
          this.paragraphs.slice(0, this.index + 1)
        )}%`
      );
    }
    this.renderer.highlightCurrentWord(this.currentParagraph);
  }
  focusInput(DOMInputField) {
    DOMInputField.focus();
  }
}
