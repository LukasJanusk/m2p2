import { preparePoem, hideParagraphs } from "./api.js";
import { InputController } from "./input.js";
import { Timer } from "./timer.js";

async function handleLoading() {
  document.addEventListener("DOMContentLoaded", async () => {
    const timer = new Timer(60);
    const poem = await preparePoem();
    const inputController = new InputController(timer, poem);
    let textField = document.getElementById("text-field");
    poem.forEach((paragraph) => {
      textField.appendChild(paragraph);
      hideParagraphs(poem, 10);
    });

    document.addEventListener("keydown", (event) => {
      inputController.handleKeyPress(event.key, true);
    });
  });
}
handleLoading();
