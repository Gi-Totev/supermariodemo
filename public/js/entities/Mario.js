import Entity from "../Entity.js";
import { loadSpriteSheet } from "../loaders/sprite.js";
import { loadAudioBoard } from "../loaders/audio.js";
import {
  Killable,
  Physics,
  Solid,
  Stomp,
  Walk,
  Jump,
} from "../traits/index.js";

const FRICTION = { LOW: 1 / 1000, HIGH: 1 / 5000 };

function loadMario(audioContext) {
  return Promise.all([
    loadSpriteSheet("mario"),
    loadAudioBoard("mario", audioContext),
  ]).then(([sprite, audio]) => {
    return createMarioFactory(sprite, audio);
  });
}

function createMarioFactory(sprite, audio) {
  const runAnim = sprite.animations.get("run");

  function routeFrame(mario) {
    if (mario.traits.get(Jump).falling) {
      return "jump";
    }
    if (mario.traits.get(Walk).distance > 0) {
      if (
        (mario.vel.x > 0 && mario.traits.get(Walk).direction < 0) ||
        (mario.vel.x < 0 && mario.traits.get(Walk).direction > 0)
      ) {
        return "break";
      }
      return runAnim(mario.traits.get(Walk).distance);
    }
    return "idle";
  }

  function setTurboState(turboOn) {
    this.traits.get(Walk).friction = turboOn ? FRICTION.HIGH : FRICTION.LOW;
  }

  function drawMario(ctx) {
    sprite.draw(routeFrame(this), ctx, 0, 0, this.traits.get(Walk).heading < 0);
  }

  return function createMario() {
    const mario = new Entity();
    mario.size.set(14, 16);
    mario.audio = audio;
    mario.addTrait(new Solid());
    mario.addTrait(new Physics());
    mario.addTrait(new Jump());
    mario.addTrait(new Walk());
    mario.addTrait(new Stomp());
    mario.addTrait(new Killable());

    mario.traits.get(Walk).friction = FRICTION.LOW;
    mario.traits.get(Killable).removeAfter = 0;

    mario.turbo = setTurboState;
    mario.turbo(false);
    mario.draw = drawMario;

    return mario;
  };
}

export { loadMario };
