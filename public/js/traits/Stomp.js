import { Trait } from "../Trait.js";
import { Killable } from "./Killable.js";

class Stomp extends Trait {
  static EVENT_STOMP = Symbol("stomp");

  constructor() {
    super();
    this.bounceSpeed = 400;
  }

  bounce(entity1, entity2) {
    entity1.bounds.bottom = entity2.bounds.top;
    entity1.vel.y = -this.bounceSpeed;
  }

  collides(entity1, entity2) {
    if (!entity2.traits.has(Killable) || entity2.traits.get(Killable).dead) {
      return;
    }

    if (entity1.vel.y > entity2.vel.y) {
      this.queue(() => {
        this.bounce(entity1, entity2);
      });
      entity1.sounds.add("stomp");
      entity1.events.emit(Stomp.EVENT_STOMP, entity1, entity2);
    }
  }
}

export { Stomp };
