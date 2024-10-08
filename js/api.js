// Chooses random element from array
function pickRandom(items) {
  const randomIndex = Math.floor(Math.random() * items.length);
  const randomItem = items[randomIndex];
  return randomItem;
}
// Returns one of 3 randomly selected author
function getAuthor() {
  const authors = ["John Keats"];
  const selectedAuthor = pickRandom(authors);
  return selectedAuthor;
}
// Requests API for poems of specific author
async function getPoems(author) {
  try {
    const response = await fetch(
      `https://poetrydb.org/author/${encodeURIComponent(author)}/title,lines`
    );
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching data:", error);
  }
}
// Returns poems list with each peom containing at least 100 lines
function getLongPoems(data) {
  const poems = [];
  data.forEach((poem) => {
    if (poem.lines.length > 99) {
      poems.push(poem.lines);
    }
  });
  return poems;
}
// Fixes all poems fetched from API
function fixPoems(poems) {
  return poems.map(fixPoem);
}
// Trims spaces on both sides and removes 1 symbol lines
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
// Returns list of poem lines converted to html paragraphs
function createParagraphs(poem) {
  const paragraphs = [];
  for (let line of poem) {
    const p = document.createElement("p");
    p.innerText = line;
    paragraphs.push(p);
  }
  return paragraphs;
}
// Saves poems to local storage
function savePoems(poems) {
  const poemsString = JSON.stringify(poems);
  localStorage.setItem("poems", poemsString);
}
// Gets poem from local storage
function getLocalPoem() {
  const storedPoemsString = localStorage.getItem("poems");
  if (storedPoemsString) {
    const storedPoems = JSON.parse(storedPoemsString);
    const localPoem = pickRandom(storedPoems);
    return localPoem;
  } else {
    console.error("No poems found in local storage.");
    return null; // Handle when no poems exist
  }
}
// Gets poem from API and converts it to paragraph DOMElements
export async function preparePoem(useLocalStorage = false) {
  if (useLocalStorage) {
    let localPoem = getLocalPoem();
    if (localPoem) {
      return createParagraphs(localPoem);
    }
  }
  const author = getAuthor();
  const poems = await getPoems(author);
  if (!poems) {
    let localPoem = getLocalPoem();
    if (localPoem) {
      return createParagraphs(localPoem);
    }
    return null;
  }
  const longPoems = getLongPoems(poems);
  const fixedPoems = fixPoems(longPoems);
  savePoems(fixedPoems);
  const poem = pickRandom(fixedPoems);
  return createParagraphs(poem);
}
