function toggleSound(settings, toggle) {
  if (settings.sound) {
    settings.sound = false;
    toggle.innerText = "Sound - OFF";
  } else {
    settings.sound = true;
    toggle.innerText = "Sound -- ON";
  }
  settings.save();
}
function toggleTheme(settings, theme, toggle) {
  if (settings.theme === "light") {
    settings.theme = "dark";
    theme.href = "/css/dark.css";
    toggle.innerText = "Dark";
  } else {
    settings.theme = "light";
    theme.href = "/css/light.css";
    toggle.innerText = "Light";
  }
  settings.save();
}
function toggleLineBreak(settings, toggle) {
  if (settings.autoComplete) {
    settings.autoComplete = false;
    toggle.innerText = "Line Auto Break - OFF";
  } else {
    settings.autoComplete = true;
    toggle.innerText = "Line Auto Break -- ON";
  }
  settings.save();
}
// Changes settings and button text based on clicked button ID
export function runToggles(toggle, theme, settings) {
  if (toggle.id === "sound-toggle") {
    toggleSound(settings, toggle);
  } else if (toggle.id === "theme-toggle") {
    toggleTheme(settings, theme, toggle);
  } else if (toggle.id === "lineBreak-toggle") {
    toggleLineBreak(settings, toggle);
  }
}
// Initializes buttons based on settings
export function loadButtons(settings, toggles) {
  toggles.forEach((toggle) => {
    if (toggle.id === "sound-toggle") {
      toggle.innerText = settings.sound ? "Sound -- ON" : "Sound - OFF";
    } else if (toggle.id === "theme-toggle") {
      toggle.innerText = settings.theme === "light" ? "Light" : "Dark";
    } else if (toggle.id === "lineBreak-toggle") {
      toggle.innerText = settings.autoLineBreak
        ? "Line Auto Break -- ON"
        : "Line Auto Break - OFF";
    }
  });
}
