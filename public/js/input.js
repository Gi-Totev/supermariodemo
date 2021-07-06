import InputRouter from "./InputRouter.js";
import Keyboard from "./KeyboardState.js";
import { Jump, Walk } from "./traits/index.js";

function setupKeyboard(window) {
  const SPACE = "KeyW";
  const input = new Keyboard();
  const router = new InputRouter();
  input.listenTo(window);

  input.addMapping("KeyD", (keyState) => {
    router.route(
      (entity) => (entity.traits.get(Walk).direction += keyState ? 1 : -1)
    );
  });

  input.addMapping("KeyA", (keyState) => {
    router.route(
      (entity) => (entity.traits.get(Walk).direction += keyState ? -1 : 1)
    );
  });

  input.addMapping("KeyO", (keyState) => {
    router.route((entity) => entity.turbo(keyState));
  });

  input.addMapping(SPACE, (keyState) => {
    if (keyState) {
      router.route((entity) => entity.traits.get(Jump).start());
    } else {
      router.route((entity) => entity.traits.get(Jump).cancel());
    }
  });

  return router;
}

export { setupKeyboard };
