export class Timer {
  constructor(duration) {
    this.running = false;
    this.end = false;
    this.duration = duration;
    this.remainingTime = duration;
    this.interval = 1000;
  }
  start() {
    if (this.running) {
      return;
    }
    this.running = true;
    this.end = false;

    this.intervalId = setInterval(() => {
      if (this.remainingTime > 0) {
        this.remainingTime--;
        console.log(`Time left: ${this.remainingTime} seconds`);
      }
    }, 1000);
  }
  reset() {
    this.remainingTime = this.duration;
    this.end = false;
    this.running = false;
    clearInterval(this.interval);
    console.log("Timer reset.");
  }
  async checkForEnd() {
    setInterval(() => {
      if (this.remainingTime === 0) {
        this.stop();
      }
    }, 10);
  }
  stop() {
    clearInterval(this.intervalId);
    this.intervalId = null;
    this.running = false;
    this.end = true;
    console.log("Time's up!");
  }
  displayTimer(timerDomElement) {
    timerDomElement.innerText = ` Remaining: ${this.remainingTime}s`;
  }
  async renderTimer(timerDiv) {
    setInterval(() => this.displayTimer(timerDiv), 100);
  }
}
