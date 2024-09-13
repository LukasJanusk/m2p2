import { Renderer } from "./render.js";
import { Engine } from "./logic.js";

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
  //Initializes paragraphs for the logic checks and render
  initializeParagraphs() {
    this.paragraphs.forEach((paragraph) => {
      this.wrapEachCharacterInSpan(paragraph);
    });
    this.initializeFirstSpan();
    this.renderer.highlightCurrentWord(this.currentParagraph);
  }
  //highlights first letter of new paragraph
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
  getCompletedParagraphs() {
    return this.paragraphs.slice(0, this.index + 1);
  }
  handleEnter() {
    this.index++;
    this.renderer.hideParagraph(this.currentParagraph);
    this.renderer.unhideNthParagraph(10 + this.index, this.paragraphs);
    this.currentParagraph = this.paragraphs[this.index];
    this.initializeFirstSpan();
    this.paragraphEnd = false;
  }
  //Handles keypress logic
  handleKeyPress(key, lineAutoComplete = false) {
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
    } else if (key === "Backspace") {
      if ((this.paragraphEnd = true)) {
        this.paragraphEnd = false;
      }
      if (
        !this.renderer.handleBackspace(this.currentParagraph, this.paragraphs)
      ) {
        this.index--;
        this.paragraphEnd = false;
        this.currentParagraph = this.paragraphs[this.index];
      }
    } else if (this.paragraphEnd && !lineAutoComplete) {
      if (key === "Enter") {
        this.handleEnter();
      }
    } else if (key === "Escape") {
      handleEscape();
    } else if (key !== "Shift") {
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
  }
}
