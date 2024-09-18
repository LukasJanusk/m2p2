import { preparePoem } from "./api.js";
import { InputController } from "./input.js";
import { Timer } from "./timer.js";
import { User } from "./user.js";

async function loadInitialPoem(textField) {
  textField.innerHTML = `<input id="hidden-input" autofocus /><p> Loading new poem...</p>`;
  const poem = await preparePoem();
  textField.innerHTML = `<input id="hidden-input" autofocus />`;
  return poem;
}
async function handleLoading() {
  document.addEventListener("DOMContentLoaded", async () => {
    const user = new User();
    const timerDiv = document.querySelector("#timer");
    const hiddenInput = document.querySelector("#hidden-input");
    const resetButton = document.querySelector("#reset");
    const wpmField = document.getElementById("wpm");
    const accuracyField = document.getElementById("accuracy");
    const statisticsField = document.getElementById("statistics");
    const timer = new Timer(10);
    const textField = document.getElementById("text-field");
    const poem = await loadInitialPoem(textField);
    if (!poem) {
      alert("Failed to fetch poem data, reload page to retry");
      return;
    }
    const inputController = new InputController(timer, poem, user);
    poem.forEach((paragraph) => {
      textField.appendChild(paragraph);
    });
    document.addEventListener("keydown", (event) => {
      event.preventDefault();
      inputController.focusInput(hiddenInput);
      inputController.handleKeyPress(
        event.key,
        textField,
        accuracyField,
        wpmField,
        statisticsField,
        false
      );
      inputController.handleAccuracy(accuracyField);
      inputController.handleWpm(wpmField);
    });
    resetButton.addEventListener("click", () => {
      inputController.reset(
        textField,
        accuracyField,
        wpmField,
        statisticsField
      );
    });
    inputController.checkForEnd(textField, statisticsField);
    inputController.timer.renderTimer(timerDiv);
    if (inputController.timer.remainingTime > 0) {
      inputController.updateWpm(wpmField);
    }
  });
}
handleLoading();
