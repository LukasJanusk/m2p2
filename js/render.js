export class Renderer {
  //asigns class to a span based on input
  renderLetter(key, paragraph) {
    const spans = Array.from(paragraph.querySelectorAll("span"));
    const currentSpan = paragraph.querySelector(".current");
    const currentSpanIndex = spans.findIndex(
      (span) => span.className === "current"
    );
    if (currentSpan.innerHTML === key) {
      currentSpan.className = "correct";
    } else {
      currentSpan.className = "incorrect";
    }
    if (spans.length > currentSpanIndex + 1)
      spans[currentSpanIndex + 1].className = "current";
  }
  handleBackspace(paragraph, paragraphs) {
    const spans = Array.from(paragraph.querySelectorAll("span"));
    const currentSpan = paragraph.querySelector(".current");
    const currentSpanIndex = spans.findIndex(
      (span) => span.className === "current"
    );
    if (currentSpan === null) {
      console.log("No current span found");
      const newCurrent = spans[spans.length - 1];
      newCurrent.className = "current";
      return true;
    } else if (currentSpanIndex > 0) {
      const newCurrent = spans[currentSpanIndex - 1];
      newCurrent.className = "current";
      currentSpan.className = "";
      return true;
    } else {
      const completeParagraphs = paragraphs.filter((p) =>
        p.classList.contains("completed")
      );
      if (completeParagraphs.length === 0) {
        console.log("No complete paragraphs found: returning");
        return true;
      }
      const lastCompleteParagraph =
        completeParagraphs[completeParagraphs.length - 1];
      this.unhideParagraph(lastCompleteParagraph);
      const newSpans = Array.from(
        lastCompleteParagraph.querySelectorAll("span")
      );
      const newCurrent = newSpans[newSpans.length - 1];
      newCurrent.className = "current";
      currentSpan.className = "";
      return false;
    }
  }
  // updates innerHTML with current values of accuracy
  renderAccuracy(DomElement, accuracy) {
    if (isNaN(accuracy)) {
      accuracy = 0;
    }
    DomElement.innerText = `Accuracy: ${accuracy}%`;
  }
  // updates innerHTML with current values
  renderWpm(DomElement, wpm) {
    if (isNaN(wpm)) {
      wpm = 0;
    }
    DomElement.innerHTML = `WPM: ${wpm.toFixed(0)}`;
  }
  //un-hides nth paragraph
  unhideNthParagraph(n, paragraphs) {
    if (paragraphs.length >= n) {
      const tenthParagraph = paragraphs[n - 1];
      tenthParagraph.style.display = "";
    } else {
      console.log(`Less than ${n} paragraphs available.`);
    }
  }
  //un-hides paragraph
  unhideParagraph(paragraph) {
    paragraph.style.display = "";
    paragraph.className = "";
  }
  //hides selected paragraph
  hideParagraph(paragraph) {
    paragraph.style.display = "none";
    paragraph.className = "completed";
  }
  //hihglights current word
  highlightCurrentWord(paragraph) {
    const spans = Array.from(paragraph.querySelectorAll("span"));
    const currentSpanIndex = spans.findIndex(
      (span) => span.className === "current"
    );
    if (currentSpanIndex === -1) {
      return;
    }
    const startIndex = (currentSpanIndex) => {
      for (let index = currentSpanIndex; index > 0; index--) {
        if (spans[index].textContent === " ") {
          return index + 1;
        }
      }
      return 0;
    };
    const endIndex = (currentSpanIndex) => {
      for (let index = currentSpanIndex; index < spans.length - 1; index++) {
        if (spans[index].textContent === " ") {
          return index - 1;
        }
      }
      return spans.length - 1;
    };
    const start = startIndex(currentSpanIndex);
    const end = endIndex(currentSpanIndex);
    for (let i = start; i <= end; i++) {
      if (
        spans[i].className !== "correct" &&
        spans[i].className !== "incorrect"
      ) {
        spans[i].className = "current-word";
      }
    }
    const toReset = spans.slice(end + 1);
    toReset.forEach((span) => {
      span.className = "";
    });
    spans[currentSpanIndex].className = "current";
  }
}
