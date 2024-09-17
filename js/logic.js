export class Engine {
  constructor() {}

  // Returns bool if paragraph end is reached(reached = true)
  checkForParagraphEnd(paragraph) {
    const spans = Array.from(paragraph.querySelectorAll("span"));
    if (spans.length > 0) {
      const lastSpan = spans[spans.length - 1];
      return (
        lastSpan.className === "correct" || lastSpan.className === "incorrect"
      );
    }
    return false;
  }
  // Creates an array of arrays of spans(this array contains a word made out of spans)
  createWordsArrayfromSpans(paragraph) {
    const spans = Array.from(paragraph.querySelectorAll("span"));
    let currentArray = [];
    let separatedArrays = [];
    spans.forEach((span) => {
      if (span.textContent.trim() === "") {
        if (currentArray.length > 0) {
          separatedArrays.push(currentArray);
          currentArray = [];
        }
      } else {
        currentArray.push(span);
      }
    });
    if (currentArray.length > 0) {
      separatedArrays.push(currentArray);
    }
    return separatedArrays;
  }
  // Removes unused spans from array
  removeUnusedWords(spansArray) {
    const classesToKeep = ["correct", "incorrect"];

    return spansArray.filter((spans) =>
      spans.every((span) =>
        classesToKeep.some((className) => span.classList.contains(className))
      )
    );
  }
  // Returns percentage of correct correct words
  getCorrectWordsPercentage(spansArray) {
    const allWords = spansArray.length;
    const correctWordsArray = spansArray.filter((spans) =>
      spans.every((span) => span.classList.contains("correct"))
    );
    if (allWords.length === 0) {
      return "0";
    }
    const correctWords = correctWordsArray.length;
    const percentage = ((correctWords / allWords) * 100).toFixed(1);
    return percentage;
  }
  // Returns percentage of correctly input words
  calculateAccuracy(paragarphs) {
    const totalParagraphs = Array.from(paragarphs);
    const spansWords = [];
    totalParagraphs.forEach((paragraph) => {
      const paragraphWordSpans = this.createWordsArrayfromSpans(paragraph);
      spansWords.push(...paragraphWordSpans);
    });
    const wordsToCheck = this.removeUnusedWords(spansWords);
    return this.getCorrectWordsPercentage(wordsToCheck);
  }
  // Calculates number of correctly typed words
  getCorrectWords(paragraphs) {
    const totalParagraphs = Array.from(paragraphs);
    const spansWords = [];
    totalParagraphs.forEach((paragraph) => {
      const paragraphWordSpans = this.createWordsArrayfromSpans(paragraph);
      spansWords.push(...paragraphWordSpans);
    });
    const wordsToCheck = this.removeUnusedWords(spansWords);
    const correctWordsArray = wordsToCheck.filter((spans) =>
      spans.every((span) => span.classList.contains("correct"))
    );
    return correctWordsArray.length;
  }
}
