import { Trait } from "../Trait.js";
import { Stomp } from "./Stomp.js";
const COIN_LIFE_THRESHOLD = 100;

class Player extends Trait {
  constructor() {
    super();
    this.playerName = "MARIO";
    this.coins = 0;
    this.lives = 3;
    this.score = 0;
    this.listen(Stomp.EVENT_STOMP, () => {
      this.score += 100;
      console.log(this.score, "score");
    });
  }

  addCoins(count) {
    this.coins += count;
    this.queue((entity) => entity.sounds.add("coin"));
    while (this.coins >= COIN_LIFE_THRESHOLD) {
      this.addLives(1);
      this.coins -= COIN_LIFE_THRESHOLD;
    }
  }

  addLives(count) {
    this.lives += count;
  }
}

export { Player };
