export class User {
  constructor() {
    // Default values
    this.wpm = 0;
    this.accuracy = 0;
    this.wpmHistory = []; // Example: [{date: '2024-05-12', wpm: 60}]
    this.accuracyHistory = []; // Example: [{date: '2024-05-12', accuracy: 100}]
  }

  // Retrieve user data from localStorage
  getData() {
    const savedUserData = localStorage.getItem("userData");
    if (savedUserData) {
      const userData = JSON.parse(savedUserData);
      this.wpm = userData.wpm || 0;
      this.accuracy = userData.accuracy || 0;
      this.wpmHistory = userData.wpmHistory || [];
      this.accuracyHistory = userData.accuracyHistory || [];
    }
  }

  // Save user data to localStorage
  setData() {
    const userData = {
      wpm: this.wpm,
      accuracy: this.accuracy,
      wpmHistory: this.wpmHistory,
      accuracyHistory: this.accuracyHistory,
    };
    localStorage.setItem("userData", JSON.stringify(userData));
  }

  // Add new WPM entry to history
  addWpmEntry(wpm) {
    const date = new Date().toISOString().split("T")[0];
    this.wpmHistory.push({ date, wpm });
    this.setData();
  }

  // Add new accuracy entry to history
  addAccuracyEntry(accuracy) {
    const date = new Date().toISOString().split("T")[0];
    this.accuracyHistory.push({ date, accuracy });
    this.setData();
  }
}
