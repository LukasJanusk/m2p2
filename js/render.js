export class Renderer {
  // Asigns class to a span based on input
  renderLetter(key, paragraph, sound) {
    const spans = Array.from(paragraph.querySelectorAll("span"));
    const currentSpan = paragraph.querySelector(".current");
    const currentSpanIndex = spans.findIndex(
      (span) => span.className === "current"
    );
    if (currentSpan.innerHTML === key) {
      currentSpan.className = "correct";
      if (sound) {
        this.playCorrectSound();
      }
    } else {
      currentSpan.className = "incorrect";
      if (sound) {
        this.playIncorrectSound();
      }
    }
    if (spans.length > currentSpanIndex + 1)
      spans[currentSpanIndex + 1].className = "current";
  }
  // Determines which class asign for a spans of paragraphs on Backspace click
  handleBackspace(paragraph, paragraphs, sound) {
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
      if (sound) {
        this.playCorrectSound();
      }
      const newCurrent = spans[currentSpanIndex - 1];
      newCurrent.className = "current";
      currentSpan.className = "";
      return true;
    } else {
      spans.forEach((span) => (span.className = ""));
      const completeParagraphs = paragraphs.filter((p) =>
        p.classList.contains("completed")
      );
      if (completeParagraphs.length === 0) {
        spans[0].className = "current";
        if (sound) {
          this.playIncorrectSound();
        }
        console.log("No complete paragraphs found");
        return true;
      }
      if (sound) {
        this.playCorrectSound();
      }
      const lastCompleteParagraph =
        completeParagraphs[completeParagraphs.length - 1];
      this.unhideParagraph(lastCompleteParagraph);
      this.hideParagraph(paragraphs[completeParagraphs.length + 9]);
      const newSpans = Array.from(
        lastCompleteParagraph.querySelectorAll("span")
      );
      const newCurrent = newSpans[newSpans.length - 1];
      newCurrent.className = "current";
      currentSpan.className = "";
      return false;
    }
  }
  // Updates innerHTML with current values of accuracy
  renderAccuracy(DomElement, accuracy) {
    if (isNaN(accuracy)) {
      accuracy = 0;
    }
    DomElement.innerText = `Accuracy: ${accuracy}%`;
  }
  // Updates innerHTML with current values
  renderWpm(DomElement, wpm) {
    if (isNaN(wpm)) {
      wpm = 0;
    }
    DomElement.innerHTML = `WPM: ${wpm}`;
  }
  // Un-hides nth paragraph
  unhideNthParagraph(n, paragraphs) {
    if (paragraphs.length >= n) {
      const tenthParagraph = paragraphs[n - 1];
      tenthParagraph.style.display = "";
    } else {
      console.log(`Less than ${n} paragraphs available.`);
    }
  }
  // Un-hides paragraph
  unhideParagraph(paragraph) {
    paragraph.style.display = "";
    paragraph.className = "";
  }
  h;
  // Hides  a paragraph
  hideParagraph(paragraph) {
    paragraph.style.display = "none";
    paragraph.className = "";
  }
  // Completes and hides selected paragraph
  completeParagraph(paragraph) {
    paragraph.style.display = "none";
    paragraph.className = "completed";
  }
  // Hide paragraphs from nth to last
  hideParagraphs(n, paragraphs) {
    const toHide = paragraphs.slice(n);
    toHide.forEach((paragraph) => {
      paragraph.style.display = "none";
    });
  }
  // Selects and hihglights current word
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
  playCorrectSound() {
    const audio = new Audio("../sounds/correct.ogg");
    audio.play();
  }
  playIncorrectSound() {
    const audio = new Audio("../sounds/incorrect.ogg");
    audio.play();
  }
  //Generates graph DOMelement
  generateGraph(graphDomElement, user, key) {
    const start = key === "wpm";
    const domAccessName = `${key}-statistics`;
    const historyKey = `${key}History`;
    const ctx = graphDomElement
      .querySelector(`#${domAccessName}`)
      .getContext("2d");
    if (ctx.chart) {
      ctx.chart.destroy();
    }
    const dataPoints = user[historyKey]
      ? user[historyKey]
          .slice(0, 5)
          .map((item) => parseFloat(item[key]))
          .reverse()
      : [];
    const maxValue = Math.max(...dataPoints);
    const dateLabels = user[historyKey]
      ? user[historyKey]
          .slice(0, 5)
          .map((item) => item["date"])
          .reverse()
      : [];
    ctx.chart = new Chart(ctx, {
      type: "line",
      data: {
        labels: dateLabels,
        datasets: [
          {
            label: key.toUpperCase(),
            data: dataPoints,
            fill: false,
            borderColor: "#674636",
            tension: 0.1,
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: start,
            max: maxValue,
          },
        },
        plugins: {
          // Use the dataLabels plugin to display values above each point
          datalabels: {
            align: "start", // Align labels at the end of the point
            anchor: "end", // Anchor labels to the top of each point
            backgroundColor: "rgba(88, 60, 46, 0.8)", // Optional: Background color for label
            borderRadius: 3,
            color: "white",
            font: {
              weight: "bold",
            },
            formatter: function (value) {
              return value.toFixed(1); // Format the label value
            },
            offset: 5, // Shift the label up or down to avoid overlap
          },
        },
      },
      plugins: [ChartDataLabels], // Include the dataLabels plugin
    });
  }
  // Generates graphs for WPM and accuracy
  generateGraphs(DomContainerElement, user) {
    this.generateGraph(DomContainerElement, user, "wpm");
    this.generateGraph(DomContainerElement, user, "accuracy");
  }
}
