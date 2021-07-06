import { Vector2D } from "./Math.js";

class Camera {
  constructor() {
    this.position = new Vector2D(0, 0);
    this.size = new Vector2D(256, 224);
  }
}

export default Camera;
