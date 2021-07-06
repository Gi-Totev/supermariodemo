import Entity from "../Entity.js";
import { Trait } from "../Trait.js";
import { Patrol, Killable, Solid, Physics, Stomp } from "../traits/index.js";
import { loadSpriteSheet } from "../loaders/sprite.js";

const STATE_WALKING = Symbol("walking");
const STATE_HIDING = Symbol("hiding");
const STATE_PANIC = Symbol("panic");

function loadKoopa() {
  return loadSpriteSheet("koopa").then(createKoopaFactory);
}

class Behaviour extends Trait {
  constructor() {
    super("behaviour");
    this.state = STATE_WALKING;
    this.hideTime = 0;
    this.hideDuration = 5;
    this.walkSpeed = null;
    this.panicSpeed = 300;
  }

  collides(entity1, entity2) {
    if (entity1.traits.get(Killable).dead) return;

    if (entity2.traits.has(Stomp)) {
      if (entity2.vel.y > entity1.vel.y) {
        this.handleStomp(entity1, entity2);
      } else {
        this.handleNudge(entity1, entity2);
      }
    }
  }

  handleNudge(entity1, entity2) {
    if (this.state === STATE_WALKING) {
      entity2.traits.get(Killable).kill();
    } else if (this.state === STATE_HIDING) {
      this.panic(entity1, entity2);
    } else if (this.state === STATE_PANIC) {
      const _dir = Math.sign(entity1.vel.x);
      const _impactDir = Math.sign(entity1.position.x - entity2.position.x);
      if (_dir !== 0 && _dir !== _impactDir) {
        entity2.traits.get(Killable).kill();
      }
    }
  }

  handleStomp(entity1, _entity2) {
    if (this.state === STATE_WALKING) {
      this.hide(entity1);
    } else if (this.state === STATE_HIDING) {
      entity1.traits.get(Killable).kill();
      entity1.vel.set(100, -200);
      entity1.traits.get(Solid).obstructs = false;
    } else if (this.state === STATE_PANIC) {
      this.hide(entity1);
    }
  }

  panic(entity1, entity2) {
    entity1.traits.get(Patrol).enabled = true;
    entity1.traits.get(Patrol).speed =
      Math.sign(entity2.vel.x) * this.panicSpeed;
    this.state = STATE_PANIC;
  }

  hide(entity) {
    if (this.walkSpeed === null) {
      this.walkSpeed = entity.traits.get(Patrol).speed;
    }
    entity.vel.x = 0;
    entity.traits.get(Patrol).enabled = false;
    this.state = STATE_HIDING;
  }

  unhide(entity) {
    entity.traits.get(Patrol).enabled = true;
    entity.traits.get(Patrol).speed = this.walkSpeed;
    this.state = STATE_WALKING;
  }

  update(entity, { delta }) {
    if (this.state === STATE_HIDING) {
      this.hideTime += delta;
      if (this.hideTime > this.hideDuration) {
        this.hideTime = 0;
        this.unhide(entity);
      }
    }
  }
}

function createKoopaFactory(sprite) {
  const walkAnim = sprite.animations.get("walk");
  const wakeAnim = sprite.animations.get("wake");

  function routeAnimation(koopa) {
    if (koopa.traits.get(Behaviour).state === STATE_HIDING) {
      if (koopa.traits.get(Behaviour).hideTime > 3) {
        return wakeAnim(koopa.traits.get(Behaviour).hideTime);
      }
      return "hiding";
    }
    if (koopa.traits.get(Behaviour).state === STATE_PANIC) {
      return "hiding";
    }
    return walkAnim(koopa.lifetime);
  }

  function drawKoopa(ctx) {
    sprite.draw(routeAnimation(this), ctx, 0, 0, this.vel.x < 0);
  }

  return function createKoopa() {
    const koopa = new Entity();

    koopa.size.set(16, 16);
    koopa.offset.set(0, 8);
    koopa.vel.x = -30;

    koopa.addTrait(new Solid());
    koopa.addTrait(new Physics());
    koopa.addTrait(new Patrol());
    koopa.addTrait(new Killable());
    koopa.addTrait(new Behaviour());

    koopa.draw = drawKoopa;
    return koopa;
  };
}

export { loadKoopa };
