import Compositor from "./Compositor.js";
import EventEmitter from "./EventEmitter.js";

class Scene {
  static EVENT_COMPLETE = Symbol("scene complete");

  constructor() {
    this.compositor = new Compositor();
    this.events = new EventEmitter();
  }

  draw({ videoContext }) {
    this.compositor.draw(videoContext);
  }

  update() {}

  pause() {}
}

export default Scene;
