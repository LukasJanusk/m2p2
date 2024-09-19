import { preparePoem } from "./api.js";
import { InputController } from "./input.js";
import { Timer } from "./timer.js";
import { User } from "./user.js";
import { Settings } from "./settings.js";
import { runToggles, loadButtons } from "./buttons.js";

async function loadInitialPoem(textField) {
  textField.innerHTML = `<input id="hidden-input" autofocus /><p> Loading new poem...</p>`;
  const poem = await preparePoem();
  textField.innerHTML = `<input id="hidden-input" autofocus />`;
  return poem;
}
async function handleLoading() {
  document.addEventListener("DOMContentLoaded", async () => {
    const user = new User();
    const settings = new Settings();
    const timer = new Timer(60);
    const toggles = document.querySelectorAll(".toggle");
    const theme = document.querySelector("#theme");
    const resultsField = document.querySelector("#results");
    const timerDiv = document.querySelector("#timer");
    const realTimeInfo = document.querySelector("#realtime-info");
    const hiddenInput = document.querySelector("#hidden-input");
    const resetButton = document.querySelector("#reset");
    const wpmField = document.getElementById("wpm");
    const accuracyField = document.getElementById("accuracy");
    const statisticsField = document.getElementById("statistics");
    const textField = document.getElementById("text-field");
    loadButtons(settings, toggles);
    const poem = await loadInitialPoem(textField);
    if (!poem) {
      alert("Failed to fetch poem data, reload page to retry");
      return;
    }
    const inputController = new InputController(timer, poem, user, settings);
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
        realTimeInfo,
        resultsField
      );
      inputController.handleAccuracy(accuracyField);
      inputController.handleWpm(wpmField);
    });
    resetButton.addEventListener("click", () => {
      inputController.reset(
        textField,
        accuracyField,
        wpmField,
        statisticsField,
        realTimeInfo,
        resultsField
      );
    });
    toggles.forEach((toggle) => {
      toggle.addEventListener("click", (event) => {
        const clickedElement = event.target;
        runToggles(clickedElement, theme, settings);
      });
    });
    inputController.checkForEnd(
      textField,
      statisticsField,
      realTimeInfo,
      resultsField
    );
    inputController.timer.renderTimer(timerDiv);
    if (inputController.timer.remainingTime > 0) {
      inputController.updateWpm(wpmField);
    }
  });
}
handleLoading();
