import { SIDES } from "../Entity.js";
import { Trait } from "../Trait.js";

class Patrol extends Trait {
  constructor() {
    super();
    this.speed = -30;
    this.enabled = true;
  }

  obstruct(_entity, side) {
    if (side === SIDES.RIGHT || side === SIDES.LEFT) {
      this.speed *= -1;
    }
  }

  update(entity) {
    if (this.enabled) {
      entity.vel.x = this.speed;
    }
  }
}

export { Patrol };
