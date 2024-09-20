export class User {
  constructor() {
    this.wpm = 0;
    this.accuracy = 0;
    this.wpmHistory = [];
    this.accuracyHistory = [];
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
    if (isNaN(wpm)) {
      wpm = 0;
    }
    const date = new Date().toISOString().split("T")[0];
    this.wpmHistory.unshift({ date, wpm });
    this.saveData();
  }

  // Add new accuracy entry to history
  addAccuracyEntry(accuracy) {
    if (isNaN(accuracy)) {
      accuracy = 0;
    }
    const date = new Date().toISOString().split("T")[0];
    this.accuracyHistory.unshift({ date, accuracy });
    this.saveData();
  }
  // Calculates wpm improvement in percentage from the last attempt
  calculateWpmChange() {
    const currentWpm = this.wpmHistory[0]?.wpm;
    const previousWpm = this.wpmHistory[1]?.wpm;
    if (previousWpm === undefined || currentWpm === undefined) {
      return "Could not calculate WPM change.";
    }
    const percentageChange = ((currentWpm - previousWpm) / previousWpm) * 100;
    if (percentageChange > 0) {
      return `<strong>WPM: ${currentWpm}</strong> - You were <strong>${percentageChange.toFixed(
        0
      )}%</strong> faster!`;
    } else if (percentageChange < 0) {
      return `<strong>WPM: ${currentWpm}</strong> - You were <strong>${Math.abs(
        percentageChange
      ).toFixed(0)}%</strong> slower.`;
    } else if (percentageChange === 0) {
      return `<strong>WPM: ${currentWpm}</strong> - You were just as fast as the last attempt.`;
    } else {
      return "Could not calculate WPM change.";
    }
  }
  // Calculates accuracy improvements in percentage from the last attempt
  calculateAccuracyChange() {
    const currentAccuracy = this.accuracyHistory[0]?.accuracy;
    const previousAccuracy = this.accuracyHistory[1]?.accuracy;
    if (previousAccuracy === undefined || currentAccuracy === undefined) {
      return "Could not calculate accuracy change.";
    }
    const percentageChange =
      ((currentAccuracy - previousAccuracy) / previousAccuracy) * 100;
    if (percentageChange > 0) {
      return `<strong>ACCURACY: ${currentAccuracy}%</strong> - You were <strong>${percentageChange.toFixed(
        0
      )}%</strong> more accurate.`;
    } else if (percentageChange < 0) {
      return `<strong>ACCURACY: ${currentAccuracy}%</strong> - You were <strong>${Math.abs(
        percentageChange
      ).toFixed(0)}%</strong> less accurate.`;
    } else if (percentageChange === 0) {
      return `<strong>ACCURACY: ${currentAccuracy}%</strong> - You were just as accurate as the last attempt.`;
    } else {
      return "Could not calculate accuracy change.";
    }
  }
}
