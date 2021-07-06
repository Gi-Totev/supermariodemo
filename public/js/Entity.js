import { Vector2D } from "./Math.js";
import BoundingBox from "./BoundingBox.js";
import AudioBoard from "./AudioBoard.js";
import EventBuffer from "./EventBuffer.js";
import { Trait } from "./Trait.js";

export const SIDES = {
  TOP: Symbol("top"),
  BOTTOM: Symbol("bottom"),
  LEFT: Symbol("left"),
  RIGHT: Symbol("right"),
};

class Entity {
  constructor() {
    this.position = new Vector2D(0, 0);
    this.vel = new Vector2D(0, 0);
    this.size = new Vector2D(0, 0);
    this.offset = new Vector2D(0, 0);
    this.traits = new Map();
    this.lifetime = 0;
    this.bounds = new BoundingBox(this.position, this.size, this.offset);
    this.audio = new AudioBoard();
    this.canCollide = true;
    this.sounds = new Set();
    this.events = new EventBuffer();
  }

  addTrait(trait) {
    this.traits.set(trait.constructor, trait);
  }

  update(gameContext, level) {
    this.traits.forEach((trait) => {
      trait.update(this, gameContext, level);
      this.playSounds(this.audio, gameContext.audioContext);
    });
    this.lifetime += gameContext.delta;
  }

  obstruct(side, match) {
    this.traits.forEach((trait) => {
      trait.obstruct(this, side, match);
    });
  }

  collides(entity) {
    this.traits.forEach((trait) => {
      trait.collides(this, entity);
    });
  }

  playSounds(audioBoard, audioContext) {
    this.sounds.forEach((name) => {
      audioBoard.playAudio(name, audioContext);
    });
    this.sounds.clear();
  }

  finalize() {
    this.events.emit(Trait.EVENT_TASK, this);
    this.traits.forEach((trait) => trait.finalize(this));
    this.events.clear();
  }

  draw() {}
}

export default Entity;
