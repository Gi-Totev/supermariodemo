import Compositor from "./Compositor.js";
import TileCollider from "./TileCollider.js";
import EntityCollider from "./entityCollider.js";
import MusicController from "./MusicController.js";
import EventEmitter from "./EventEmitter.js";
import Camera from "./Camera.js";
import Scene from "./Scene.js";
import { findPlayers } from "./player.js";

function focusPlayer(level) {
  for (const player of findPlayers(level.entities)) {
    level.camera.position.x = Math.max(0, player.position.x - 100);
  }
}

class Level extends Scene {
  static EVENT_TRIGGER = Symbol("trigger");

  constructor() {
    super();
    this.name = "";
    this.gravity = 1900;
    this.totalTime = 0;
    this.entities = new Set();
    this.entityCollider = new EntityCollider(this.entities);
    this.tileCollider = new TileCollider();
    this.music = new MusicController();
    this.camera = new Camera();
  }

  update(gameContext) {
    this.entities.forEach((entity) => {
      entity.update(gameContext, this);
    });

    this.entities.forEach((entity) => {
      this.entityCollider.check(entity);
    });

    this.entities.forEach((entity) => {
      entity.finalize();
    });

    focusPlayer(this);

    this.totalTime += gameContext.delta;
  }

  draw({ videoContext }) {
    this.compositor.draw(videoContext, this.camera);
  }

  pause() {
    this.music.pause();
  }
}

export default Level;
