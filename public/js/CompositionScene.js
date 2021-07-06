import Scene from "./Scene.js";

class CompositionScene extends Scene {
  constructor() {
    super();
    this.name = "";
    this.countdown = 2;
  }

  update(gameContext) {
    this.countdown -= gameContext.delta;
    if (this.countdown <= 0) {
      this.events.emit(Scene.EVENT_COMPLETE);
    }
  }
}

export default CompositionScene;
