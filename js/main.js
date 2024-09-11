import { preparePoem, createParagraphs } from "./text.js";

async function handleLoading() {
  document.addEventListener("DOMContentLoaded", async () => {
    const poem = await preparePoem();
    const poemParagraphs = createParagraphs(poem);
    let textField = document.getElementById("text-field");
    poemParagraphs.forEach((paragraph) => {
      textField.appendChild(paragraph);
    });
  });
}
handleLoading();
