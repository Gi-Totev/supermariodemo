import { Trait } from "../Trait.js";

class Gravity extends Trait {
  constructor() {
    super();
  }

  update(entity, { delta }, level) {
    entity.vel.y += level.gravity * delta;
  }
}

export { Gravity };
