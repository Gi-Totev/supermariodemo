import { SIDES } from "../Entity.js";
import { Trait } from "../Trait.js";

class Solid extends Trait {
  constructor() {
    super();
    this.obstructs = true;
  }

  obstruct(entity, side, match) {
    if (!this.obstructs) return;
    switch (side) {
      case SIDES.BOTTOM:
        entity.bounds.top = match.y1 - entity.size.y;
        entity.vel.y = 0;
        break;
      case SIDES.TOP:
        entity.bounds.top = match.y2;
        entity.vel.y = 0;
        break;
      case SIDES.LEFT:
        entity.bounds.left = match.x2;
        entity.vel.x = 0;
        break;
      case SIDES.RIGHT:
        entity.bounds.left = match.x1 - entity.size.x;
        entity.vel.x = 0;
        break;
      default:
        return;
    }
  }
}

export { Solid };
