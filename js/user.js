export class User {
  constructor() {
    // Default values
    this.wpm = 0;
    this.accuracy = 0;
    this.wpmHistory = []; // Example: [{date: '2024-05-12', wpm: 60}]
    this.accuracyHistory = []; // Example: [{date: '2024-05-12', accuracy: 100}]
    this.getData();
  }

  // Retrieve user data from localStorage
  getData() {
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      this.wpm = 0;
      this.accuracy = 0;
      this.wpmHistory = userData.wpmHistory || [];
      this.accuracyHistory = userData.accuracyHistory || [];
    }
  }

  // Save user data to localStorage
  saveData() {
    const userData = {
      wpm: 0,
      accuracy: 0,
      wpmHistory: this.wpmHistory,
      accuracyHistory: this.accuracyHistory,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
  }

  // Add new WPM entry to history
  addWpmEntry(wpm) {
    console.log(`Trying to write user wpm: ${wpm}`);
    const date = new Date().toISOString().split("T")[0];
    this.wpmHistory.unshift({ date, wpm });
    this.saveData();
  }

  // Add new accuracy entry to history
  addAccuracyEntry(accuracy) {
    const date = new Date().toISOString().split("T")[0];
    this.accuracyHistory.unshift({ date, accuracy });
    this.saveData();
  }
}
