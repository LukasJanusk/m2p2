export class Engine {
  constructor() {}

  checkForParagraphEnd(paragraph) {
    const spans = Array.from(paragraph.querySelectorAll("span"));
    console.log(`Length of paragraph spans is ${spans.length}`);
    if (spans.length > 0) {
      const lastSpan = spans[spans.length - 1];
      return lastSpan.id === "correct" || lastSpan.id === "incorrect";
    }
    return false;
  }
}
