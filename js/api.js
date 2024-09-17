// const fs = require("fs");
// chooses random element from array
function pickRandom(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  const randomItem = items[randomIndex];
  return randomItem;
}
// returns one of 3 randomly selected author
function getAuthor() {
  const authors = ["William Shakespeare", "John Keats"];
  const selectedAuthor = pickRandom(authors);
  return selectedAuthor;
}
//requests API for poems of specific author
async function getPoems(author) {
  try {
    const response = await fetch(
      `https://poetrydb.org/author/${encodeURIComponent(author)}/title,lines`
    );
    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
//returns poems list with each peom containing at least 100 lines
function getLongPoems(data) {
  const poems = [];
  data.forEach((poem) => {
    if (poem.lines.length > 99) {
      poems.push(poem.lines);
    }
  });
  return poems;
}
//fixes all poems fetched from API
function fixPoems(poems) {
  return poems.map(fixPoem);
}
//trims spaces on both sides and removes 1 symbol lines
function fixPoem(poem) {
  const fixed = [];
  poem.forEach((line) => {
    let trimmed = line.trim();
    if (trimmed.length > 1) {
      trimmed = trimmed.replace(/'|\u2019|\u2018/g, "'");
      trimmed = trimmed.replace(/[—–]/g, "-");
      fixed.push(trimmed);
    }
  });
  return fixed.slice(0, 100);
}
//returns list of poem lines converted to html paragraphs
function createParagraphs(poem) {
  const paragraphs = [];
  for (let line of poem) {
    const p = document.createElement("p");
    p.innerText = line;
    paragraphs.push(p);
  }
  return paragraphs;
}
//gets poem from API and converts it paragraphs DOMElements
export async function preparePoem(useLocalStorage = false) {
  if (useLocalStorage) {
    const storedPoemsString = localStorage.getItem("poems");
    if (storedPoemsString) {
      const storedPoems = JSON.parse(storedPoemsString);
      const localPoem = pickRandom(storedPoems);
      if (localPoem) {
        return createParagraphs(localPoem);
      }
    }
  }
  const author = getAuthor();
  const poems = await getPoems(author);
  const longPoems = getLongPoems(poems);
  const fixedPoems = fixPoems(longPoems);
  if (useLocalStorage) {
    savePoems(fixedPoems);
  }
  console.log(fixedPoems);
  const poem = pickRandom(fixedPoems);
  return createParagraphs(poem);
}

// saves poems to local storage
function savePoems(poems) {
  const poemsString = JSON.stringify(poems);
  localStorage.setItem("poems", poemsString);
}
