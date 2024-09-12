export class Renderer {
  renderLetter(key, paragraph) {
    const spans = Array.from(paragraph.querySelectorAll("span"));
    const currentSpan = paragraph.querySelector("#current");
    const currentSpanIndex = spans.findIndex((span) => span.id === "current");
    if (currentSpan.innerHTML === key) {
      currentSpan.id = "correct";
    } else {
      currentSpan.id = "incorrect";
    }
    if (spans.length > currentSpanIndex + 1)
      spans[currentSpanIndex + 1].id = "current";
  }
}
