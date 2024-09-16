export class Settings {
  constructor() {
    // Default settings
    this.theme = "light";
    this.sound = true;
    this.autocomplete = true;
    this.highlight = true;
  }

  // Load settings from localStorage
  load() {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.theme = settings.theme || "light";
      this.sound = settings.sound !== undefined ? settings.sound : true;
      this.autocomplete =
        settings.autocomplete !== undefined ? settings.autocomplete : true;
      this.highlight =
        settings.highlight !== undefined ? settings.highlight : true;
    }
  }

  // Save settings to localStorage
  save() {
    const settings = {
      theme: this.theme,
      sound: this.sound,
      autocomplete: this.autocomplete,
      highlight: this.highlight,
    };
    localStorage.setItem("settings", JSON.stringify(settings));
  }
}
