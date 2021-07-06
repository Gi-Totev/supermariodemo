import { Trait } from "../Trait.js";

class Physics extends Trait {
  update(entity, gameContext, level) {
    const { delta } = gameContext;
    entity.position.x += entity.vel.x * delta;

    level.tileCollider.checkX(entity, gameContext, level);

    entity.position.y += entity.vel.y * delta;
    level.tileCollider.checkY(entity, gameContext, level);

    entity.vel.y += level.gravity * delta;
  }
}

export { Physics };
