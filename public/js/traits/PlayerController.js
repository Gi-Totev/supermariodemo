import { Trait } from "../Trait.js";
import { Vector2D } from "../Math.js";
import { Killable } from "./Killable.js";

class PlayerController extends Trait {
  constructor() {
    super();
    this.player = null;
    this.checkPoint = new Vector2D(0, 0);
  }

  setPlayer(entity) {
    this.player = entity;
  }

  update(_entity, { delta }, level) {
    if (!level.entities.has(this.player)) {
      this.player.traits.get(Killable).revive();
      this.player.position.set(this.checkPoint.x, this.checkPoint.y);
      level.entities.add(this.player);
    }
  }
}

export { PlayerController };
