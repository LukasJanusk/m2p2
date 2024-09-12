export class Timer {
  constructor(duration) {
    this.running = false;
    this.duration = duration;
    this.remainingTime = duration;
    this.interval = 1000;
  }
  start() {
    this.intervalId = setInterval(() => {
      if (this.remainingTime > 0) {
        console.log(`Time left: ${this.remainingTime} seconds`);
        this.remainingTime--;
      } else {
        console.log("Time's up!");
        clearInterval(this.interval);
      }
    }, 1000);
  }
  reset() {
    this.remainingTime = this.duration;
    clearInterval(this.interval);
    console.log("Timer reset.");
  }

  stop() {
    clearInterval(this.interval);
    console.log("Timer stopped.");
  }
}
