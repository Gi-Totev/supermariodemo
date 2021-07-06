import { Trait } from "../Trait.js";

class Walk extends Trait {
  constructor() {
    super();
    this.direction = 0;
    this.acceleration = 400;
    this.deceleration = 300;
    this.friction = 1 / 5000;
    this.distance = 0;
    this.heading = 1;
  }

  update(entity, { delta }) {
    const absVelocity = Math.abs(entity.vel.x);
    if (this.direction !== 0) {
      entity.vel.x += this.acceleration * this.direction * delta;
      if (!entity.jump || entity.jump.falling === false) {
        this.heading = this.direction;
      }
    } else if (entity.vel.x !== 0) {
      const decel = Math.min(absVelocity, this.deceleration * delta);
      entity.vel.x += entity.vel.x > 0 ? -decel : decel;
    } else {
      this.distance = 0;
    }

    const drag = this.friction * entity.vel.x * absVelocity;
    entity.vel.x -= drag;
    this.distance += absVelocity * delta;
  }
}

export default Walk;
