import Entity from "../Entity.js";
import { Trait } from "../Trait.js";
import { Patrol, Killable, Solid, Physics, Stomp } from "../traits/index.js";
import { loadSpriteSheet } from "../loaders/sprite.js";

function loadGoomba() {
  return loadSpriteSheet("goomba").then(createGoombaFactory);
}

class Behaviour extends Trait {
  constructor() {
    super("behaviour");
  }

  collides(entity1, entity2) {
    if (entity1.traits.get(Killable).dead) return;

    if (entity2.traits.has(Stomp)) {
      if (entity2.vel.y > entity1.vel.y) {
        entity1.traits.get(Killable).kill();
        entity1.traits.get(Patrol).speed = 0;
      } else {
        entity2.traits.get(Killable).kill();
      }
    }
  }
}

function createGoombaFactory(sprite) {
  const walkAnim = sprite.animations.get("walk");

  function routeAnimation(goomba) {
    if (goomba.traits.get(Killable).dead) {
      return "flat";
    }
    return walkAnim(goomba.lifetime);
  }

  function drawGoomba(ctx) {
    sprite.draw(routeAnimation(this), ctx, 0, 0);
  }

  return function createGoomba() {
    const goomba = new Entity();

    goomba.size.set(16, 16);
    goomba.vel.x = -30;

    goomba.addTrait(new Solid());
    goomba.addTrait(new Physics());
    goomba.addTrait(new Patrol());
    goomba.addTrait(new Behaviour());
    goomba.addTrait(new Killable());

    goomba.draw = drawGoomba;
    return goomba;
  };
}

export { loadGoomba };
