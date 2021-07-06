import { Trait } from "../Trait.js";

class LevelTimer extends Trait {
  static EVENT_TIMER_HURRY = Symbol("timer hurry");
  static EVENT_TIMER_OK = Symbol("timer ok");

  constructor() {
    super();
    this.totalTime = 300;
    this.currentTime = this.totalTime;
    this.hurryTime = 100;
    this.hurryEmitted = null;
  }

  update(entity, { delta }, level) {
    this.currentTime -= delta * 2;
    if (!this.hurryEmitted && this.currentTime < this.hurryTime) {
      level.events.emit(LevelTimer.EVENT_TIMER_HURRY);
      this.hurryEmitted = true;
    }
    if (this.hurryEmitted !== false && this.currentTime > this.hurryTime) {
      level.events.emit(LevelTimer.EVENT_TIMER_OK);
      this.hurryEmitted = false;
    }
  }
}

export { LevelTimer };
