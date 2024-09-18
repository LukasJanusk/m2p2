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
  // Calculates wpm improvement in percentage from the last attempt
  calculateWpmChange() {
    const currentWpm = this.wpmHistory[0]?.wpm;
    const previousWpm = this.wpmHistory[0]?.wpm;
    const percentageChange = ((currentWpm - previousWpm) / previousWpm) * 100;
    if (percentageChange > 0) {
      return `${percentageChange}% faster!`;
    } else if (percentageChange < 0) {
      return `${math.abs(percentageChange).toFixed(1)}% slower}`;
    } else if (percentageChange === 0) {
      return `Just as fast as the last attempt`;
    }
  }
  // Calculates accuracy improvements in percentage from the last attempt
  calculateAccuracyChange() {
    const currentAccuracy = this.accuracyHistory[0]?.accuracy;
    const previousAccuracy = this.accuracyHistory[1]?.this.accuracy;
    const percentageChange =
      ((currentAccuracy - previousAccuracy) / previousAccuracy) * 100;
    if (percentageChange > 0) {
      return `${percentageChange}% more accurate!`;
    } else if (percentageChange < 0) {
      return `${math.abs(percentageChange).toFixed(1)}% less accurate}`;
    } else if (percentageChange === 0) {
      return `Just as accurate as the last attempt`;
    }
  }
}
