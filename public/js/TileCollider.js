import TileResolver from "./TileResolver.js";
import ground from "./tiles/ground.js";
import brick from "./tiles/brick.js";
import coin from "./tiles/coin.js";

const handlers = {
  ground,
  brick,
  coin,
};

class TileCollider {
  constructor() {
    this.resolvers = [];
  }

  addGrid(matrix) {
    this.resolvers.push(new TileResolver(matrix));
  }

  checkX(entity, gameContext, level) {
    let x;
    if (entity.vel.x > 0) {
      x = entity.bounds.right;
    } else if (entity.vel.x < 0) {
      x = entity.bounds.left;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        x,
        x + entity.size.x,
        entity.bounds.top,
        entity.bounds.bottom
      );

      matches.forEach((match) => {
        this.handle(0, entity, match, resolver, gameContext, level);
      });
    }
  }

  checkY(entity, gameContext, level) {
    let y;
    if (entity.vel.y > 0) {
      y = entity.bounds.bottom;
    } else if (entity.vel.y < 0) {
      y = entity.bounds.top;
    } else {
      return;
    }

    for (const resolver of this.resolvers) {
      const matches = resolver.searchByRange(
        entity.bounds.left,
        entity.bounds.right,
        y,
        y
      );

      matches.forEach((match) => {
        this.handle(1, entity, match, resolver, gameContext, level);
      });
    }
  }

  handle(index, entity, match, resolver, gameContext, level) {
    const collisionContext = {
      entity,
      match,
      resolver,
      gameContext,
      level,
    };
    const _handlers = handlers[match.tile.type];
    if (_handlers) {
      _handlers[index](collisionContext);
    }
  }
}

export default TileCollider;
