import { preparePoem, hideParagraphs } from "./api.js";
import { InputController } from "./input.js";
import { Timer } from "./timer.js";

async function handleLoading() {
  document.addEventListener("DOMContentLoaded", async () => {
    let textField = document.getElementById("text-field");
    let wpmField = document.getElementById("wpm");
    let accuracyField = document.getElementById("accuracy");
    textField.innerHTML = `<input id="hidden-input" autofocus />Loading new poem...`;
    const timer = new Timer(10);
    const poem = await preparePoem();
    textField.innerHTML = `<input id="hidden-input" autofocus />`;
    const inputController = new InputController(timer, poem);
    const timerDiv = document.querySelector("#timer");
    const hiddenInput = document.querySelector("#hidden-input");
    const resetButton = document.querySelector("#reset");
    poem.forEach((paragraph) => {
      textField.appendChild(paragraph);
      hideParagraphs(poem, 10);
    });
    timer.displayTimer(timerDiv);
    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      inputController.focusInput(hiddenInput);
      inputController.handleKeyPress(event.key, textField, true);
      inputController.handleAccuracy(accuracyField);
    });
    resetButton.addEventListener("click", () => {
      inputController.reset(textField);
    });
    timer.checkForEnd();
    timer.renderTimer(timerDiv);
    inputController.handleWpm(wpmField);
  });
}
handleLoading();
