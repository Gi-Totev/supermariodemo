import { Trait } from "../Trait.js";

class Trigger extends Trait {
  constructor() {
    super();
    this.touched = new Set();
    this.conditions = [];
  }

  collides(_entity1, entity2) {
    this.touched.add(entity2);
  }

  update(entity, gameContext, level) {
    if (this.touched.size > 0) {
      for (const condition of this.conditions) {
        condition(entity, this.touched, gameContext, level);
      }
      this.touched.clear();
    }
  }
}

export default Trigger;
