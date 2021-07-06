import { Trait } from "../Trait.js";
import { SIDES } from "../Entity.js";

class Jump extends Trait {
  constructor() {
    super();
    this.ready = 0;
    this.duration = 0.1;
    this.velocity = 100;
    this.requestTime = 0;
    this.gracePeriod = 0.1;
    this.engageTime = 0;
    this.speedBoost = 0.07;
  }

  get falling() {
    return this.ready < 0;
  }

  start() {
    this.requestTime = this.gracePeriod;
  }

  cancel() {
    this.engageTime = 0;
    this.requestTime = 0;
  }

  update(entity, { delta }) {
    if (this.requestTime > 0) {
      if (this.ready > 0) {
        entity.sounds.add("jump");
        this.engageTime = this.duration;
        this.requestTime = 0;
      }
      this.requestTime -= delta;
    }
    if (this.engageTime > 0) {
      entity.vel.y -= this.velocity + Math.abs(entity.vel.x) * this.speedBoost;
      this.engageTime -= delta;
    }
    this.ready--;
  }

  obstruct(entity, side) {
    if (side === SIDES.BOTTOM) {
      this.ready = 1;
    } else if (side === SIDES.TOP) {
      this.cancel();
    }
  }
}

export default Jump;
