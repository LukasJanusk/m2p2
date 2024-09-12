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
    this.renderer = new Renderer();
    this.engine = new Engine();
    this.initializeParagraphs();
  }
  initializeParagraphs() {
    this.paragraphs.forEach((paragraph) => {
      this.wrapEachCharacterInSpan(paragraph);
    });
    this.initializeFirstSpan();
  }
  //highlights initial letter of new paragraph
  initializeFirstSpan() {
    const firstSpan = this.currentParagraph.querySelector("span");
    firstSpan.id = "current";
  }
  // For each character of string creates a <span>
  wrapEachCharacterInSpan(paragraph) {
    let text = paragraph.innerHTML;
    let wrappedText = Array.from(text)
      .map((char) => `<span>${char}</span>`)
      .join("");
    paragraph.innerHTML = wrappedText;
  }
  //Handles keypress logic
  handleKeyPress(key) {
    console.log(`Key pressed: ${key}`);
    if (this.paragraphs === null) {
      this.remianingText = this.currentParagraph.innerText;
    }
    if (key === "Enter") {
      handleEnter();
    } else if (key === "Escape") {
      handleEscape();
    } else if (key === "Backspace") {
      handleBackspace(this.currentParagraph);
      if (this.index > 0) {
        this.index--;
      }
    } else if (key !== "Shift") {
      this.renderer.renderLetter(key, this.currentParagraph);
      this.index++;
      if (this.engine.checkForParagraphEnd(this.currentParagraph)) {
        console.log("paragraph end reached");
        this.index = 0;
        //run correct word logic
        this.currentParagraph.remove();
        this.paragraphs.shift();
        console.log("paragraph deleted now");
        this.unhideParagraph(10);
        this.currentParagraph = this.paragraphs[0];
        this.initializeFirstSpan();
      }
    }
  }
  unhideParagraph(n) {
    if (this.paragraphs.length >= n) {
      const tenthParagraph = this.paragraphs[n - 1];
      tenthParagraph.style.display = "";
    } else {
      console.log(`Less than ${n} paragraphs available.`);
    }
  }
  updateText(key, paragraph) {
    const topParagraph = paragraphs[0];
  }
}
