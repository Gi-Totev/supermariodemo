import Entity from "../Entity.js";
import { Trait } from "../Trait.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import { Killable, Gravity, Velocity, Stomp } from "../traits/index.js";

function loadBullet() {
  return loadSpriteSheet("bullet").then(createBulletFactory);
}

class Behaviour extends Trait {
  constructor() {
    super("behaviour");
    this.gravity = new Gravity();
  }

  collides(entity1, entity2) {
    if (entity1.traits.get(Killable).dead) return;

    if (entity2.traits.get(Stomp)) {
      if (entity2.vel.y > entity1.vel.y) {
        entity1.traits.get(Killable).kill();
        entity1.vel.set(100, -200);
      } else {
        entity2.traits.get(Killable).kill();
      }
    }
  }

  update(entity, gameContext, level) {
    if (entity.traits.get(Killable).dead) {
      this.gravity.update(entity, gameContext, level);
    }
  }
}

function createBulletFactory(sprite) {
  function drawBullet(ctx) {
    sprite.draw("bullet", ctx, 0, 0, this.vel.x < 0);
  }

  return function createBullet() {
    const bullet = new Entity();

    bullet.size.set(16, 14);

    bullet.addTrait(new Behaviour());
    bullet.addTrait(new Killable());
    bullet.addTrait(new Velocity());

    bullet.draw = drawBullet;
    return bullet;
  };
}

export { loadBullet };
