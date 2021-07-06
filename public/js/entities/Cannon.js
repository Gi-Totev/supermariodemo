import { Emitter } from "../traits/index.js";
import Entity from "../Entity.js";
import { loadAudioBoard } from "../loaders/audio.js";
import { findPlayers } from "../player.js";

const HOLD_FIRE_THRESHOLD = 30;

function loadCannon(audioContext) {
  return loadAudioBoard("cannon", audioContext).then((audio) => {
    return createCannonFactory(audio);
  });
}

function createCannonFactory(audio) {
  let dir = 1;
  function emitBullet(cannon, gameContext, level) {
    for (const player of findPlayers(level.entities)) {
      if (
        player.position.x > cannon.position.x - HOLD_FIRE_THRESHOLD &&
        player.position.x < cannon.position.x + HOLD_FIRE_THRESHOLD
      ) {
        return;
      }

      if (player.position.x < cannon.position.x) {
        dir = -1;
      } else {
        dir = 1;
      }
    }

    const bullet = gameContext.entityFactory.bullet();
    bullet.position.copy(cannon.position);
    bullet.vel.set(80 * dir, 0);
    cannon.sounds.add("shoot");
    level.entities.add(bullet);
  }

  return function createCannon() {
    const cannon = new Entity();
    cannon.audio = audio;
    const emitter = new Emitter();
    emitter.interval = 4;
    emitter.emitters.push(emitBullet);
    cannon.addTrait(emitter);

    return cannon;
  };
}

export { loadCannon };
