export class Settings {
  constructor() {
    // Default settings
    // this.theme = "light";
    // this.sound = true;
    // this.autoComplete = false;
    this.load();
  }

  // Load settings from localStorage
  load() {
    const savedSettings = localStorage.getItem("settings");
    if (savedSettings) {
      const settings = JSON.parse(savedSettings);
      this.theme = settings.theme || "light";
      this.sound = settings.sound !== undefined ? settings.sound : true;
      this.autoComplete =
        settings.autoComplete !== undefined ? settings.autoComplete : true;
    } else {
      this.theme = "light";
      this.sound = true;
      this.autoComplete = false;
    }
  }
  // Save settings to localStorage
  save() {
    const settings = {
      theme: this.theme,
      sound: this.sound,
      autoComplete: this.autoComplete,
    };
    localStorage.setItem("settings", JSON.stringify(settings));
  }
}
