import { SIDES } from "../Entity.js";
import { Player } from "../traits/Player.js";

function handleX({ entity, match }) {
  if (entity.vel.x > 0) {
    if (entity.bounds.right > match.x1) {
      entity.obstruct(SIDES.RIGHT, match);
    }
  } else if (entity.vel.x < 0) {
    if (entity.bounds.left < match.x2) {
      entity.obstruct(SIDES.LEFT, match);
    }
  }
}

function handleY({ entity, match, resolver, gameContext, level }) {
  if (entity.vel.y > 0) {
    if (entity.bounds.bottom > match.y1) {
      entity.obstruct(SIDES.BOTTOM, match);
    }
  } else if (entity.vel.y < 0) {
    if (entity.traits.has(Player)) {
      const _grid = resolver.matrix;
      _grid.delete(match.indexX, match.indexY);
      const goomba = gameContext.entityFactory.goomba();
      goomba.vel.set(50, -400);
      goomba.position.set(entity.position.x, match.y1);
      level.entities.add(goomba);
    }
    if (entity.bounds.top < match.y2) {
      entity.obstruct(SIDES.TOP, match);
    }
  }
}
const brick = [handleX, handleY];

export default brick;
