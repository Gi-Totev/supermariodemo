import { Trait } from "../Trait.js";

class Velocity extends Trait {
  constructor() {
    super();
  }

  update(entity, { delta }, level) {
    entity.position.x += entity.vel.x * delta;
    entity.position.y += entity.vel.y * delta;
  }
}

export { Velocity };
