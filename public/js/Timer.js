class Timer {
  constructor(deltaTime = 1 / 60) {
    let lastTime = null;
    let accTime = 0;

    this.updateProxy = (time) => {
      if (lastTime) {
        accTime += (time - lastTime) / 1000;

        if (accTime > 1) {
          accTime = 1;
        }

        while (accTime > deltaTime) {
          this.update(deltaTime);
          accTime -= deltaTime;
        }
      }

      lastTime = time;
      this.enqueue();
    };
  }

  enqueue() {
    requestAnimationFrame(this.updateProxy);
  }

  start() {
    this.enqueue();
  }
}

export default Timer;
