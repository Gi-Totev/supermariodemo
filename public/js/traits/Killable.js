import { Trait } from "../Trait.js";

class Killable extends Trait {
  constructor() {
    super();
    this.dead = false;
    this.deadTime = 0;
    this.removeAfter = 2;
  }

  kill() {
    this.queue(() => (this.dead = true));
    // this.dead = true;
  }

  revive() {
    this.dead = false;
    this.deadTime = 0;
  }

  update(entity, { delta }, level) {
    if (this.dead) {
      this.deadTime += delta;
      if (this.deadTime > this.removeAfter) {
        this.queue(() => level.entities.delete(entity));
      }
    }
  }
}

export { Killable };
