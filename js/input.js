import { Renderer } from "./render.js";
import { Engine } from "./logic.js";
import { preparePoem } from "./api.js";

export class InputController {
  constructor(timer, paragraphs, user, settings) {
    this.timer = timer;
    this.paragraphs = paragraphs;
    this.user = user;
    this.settings = settings;
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
  restart(textField, statisticsField, realTimeInfo, resultsField) {
    textField.style.display = "";
    statisticsField.style.display = "none";
    realTimeInfo.style.display = "";
    resultsField.style.display = "none";
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
    this.user.wpm = 0;
    this.user.accuracy = 0;
  }
  // Gets new poem text and restarts
  async reset(
    textField,
    accuracyField,
    wpmField,
    statisticsField,
    realTimeInfo,
    resultsField
  ) {
    this.timer.reset();
    resultsField.style.display = "none";
    accuracyField.innerHTML = "Accuracy: 0%";
    wpmField.innerHTML = "WPM: 0";
    textField.style.display = "";
    realTimeInfo.style.display = "";
    statisticsField.style.display = "none";
    textField.innerHTML = `<input id="hidden-input" autofocus /><p> Loading new poem...</p>`;
    this.paragraphs = await preparePoem();
    textField.innerHTML = `<input id="hidden-input" autofocus />`;
    this.paragraphs.forEach((paragraph) => {
      textField.appendChild(paragraph);
    });
    this.index = 0;
    this.currentParagraph = this.paragraphs[this.index];
    this.initializeParagraphs();
  }
  showResults(resultsField) {
    resultsField.style.display = "block";
    const wpmMessage = this.user.calculateWpmChange();
    const accuracyMessage = this.user.calculateAccuracyChange();
    resultsField.innerHTML = `<p>${wpmMessage}</p><p>${accuracyMessage}</p>`;
  }
  // Checks if timer is up and saves user data on time up
  async checkForEnd(textField, statisticsField, realTimeInfo, resultsField) {
    return new Promise((resolve) => {
      setInterval(() => {
        if (this.timer.remainingTime === 0 && this.timer.running) {
          this.timer.stop();
          const correctWords = this.engine.getCorrectWords(this.paragraphs);
          const accuracy = this.engine.calculateAccuracy(this.paragraphs);
          const wpm = parseInt(
            ((correctWords / this.timer.duration) * 60).toFixed(0)
          );
          this.user.addWpmEntry(wpm);
          this.user.addAccuracyEntry(accuracy);
          this.showStatistics(textField, statisticsField);
          this.showResults(resultsField);
          realTimeInfo.style.display = "none";
        }
      }, 10);
    });
  }
  // Shows statistics and hides textField
  showStatistics(textField, statisticsField) {
    textField.style.display = "none";
    statisticsField.style.display = "grid";
    this.renderer.generateGraphs(statisticsField, this.user);
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
  // Focuses user input to hidden textfield
  focusInput(DOMInputField) {
    DOMInputField.focus();
  }
  // Handles keypress logic
  async handleKeyPress(
    key,
    textField,
    accuracyField,
    wpmField,
    statisticsField,
    realTimeInfo,
    resultsField
  ) {
    if (this.paragraphs === null || this.currentParagraph === null) {
      return;
    }
    if (key !== "Shift" && !this.timer.end) {
      this.timer.start();
    }
    if (
      this.paragraphEnd === true &&
      this.settings.autoComplete === false &&
      key !== "Enter" &&
      key !== "Backspace"
    ) {
      if (this.settings.sound) {
        this.renderer.playIncorrectSound();
      }
      console.log("Press Enter or Backspace at line end!");
      return;
    } else if (key === "Backspace" && !this.timer.end) {
      if (this.paragraphEnd) {
        this.paragraphEnd = false;
      }
      if (
        !this.renderer.handleBackspace(
          this.currentParagraph,
          this.paragraphs,
          this.settings.sound
        )
      ) {
        this.index--;
        this.currentParagraph = this.paragraphs[this.index];
      }
    } else if (key === "Enter" && this.timer.end) {
      this.restart(textField, statisticsField, realTimeInfo, resultsField);
    } else if (
      key === "Enter" &&
      this.paragraphEnd &&
      !this.settings.autoComplete
    ) {
      this.handleEnter();
      if (this.settings.sound) {
        this.renderer.playCorrectSound();
      }
    } else if (key === "Escape" && this.timer.end) {
      await this.reset(
        textField,
        accuracyField,
        wpmField,
        statisticsField,
        realTimeInfo,
        resultsField
      );
    } else if (key !== "Shift" && this.timer.running && !this.timer.end) {
      this.renderer.renderLetter(
        key,
        this.currentParagraph,
        this.settings.sound
      );
      this.paragraphEnd = this.engine.checkForParagraphEnd(
        this.currentParagraph
      );
      if (this.paragraphEnd && this.settings.autoComplete) {
        this.handleEnter();
      }
    }
    this.renderer.highlightCurrentWord(this.currentParagraph);
  }
}
