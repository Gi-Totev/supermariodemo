import { loadMario } from "./entities/Mario.js";
import { loadGoomba } from "./entities/Goomba.js";
import { loadKoopa } from "./entities/Koopa.js";
import { loadBullet } from "./entities/Bullet.js";
import { loadCannon } from "./entities/Cannon.js";

function loadEntities(audioContext) {
  const entityFactories = {};

  function addToFactory(name) {
    return (factory) => (entityFactories[name] = factory);
  }

  return Promise.all([
    loadMario(audioContext).then(addToFactory("mario")),
    loadGoomba(audioContext).then(addToFactory("goomba")),
    loadKoopa(audioContext).then(addToFactory("koopa")),
    loadBullet(audioContext).then(addToFactory("bullet")),
    loadCannon(audioContext).then(addToFactory("cannon")),
  ]).then(() => entityFactories);
}

export { loadEntities };
