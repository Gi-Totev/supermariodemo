import Timer from "./Timer.js";
import createColorLayer from "./layers/Color.js";
import { createLevelLoader } from "./loaders/level.js";
import { setupKeyboard } from "./input.js";
import { loadEntities } from "./entities.js";
import loadFont from "./loaders/font.js";
import createDashboardLayer from "./layers/Dashboard.js";
import { createPlayerEnv, findPlayers, makePlayer } from "./player.js";
import SceneManager from "./SceneManager.js";
import createPlayerProgress from "./layers/PlayerProgress.js";
import CompositionScene from "./CompositionScene.js";
import Scene from "./Scene.js";
import createTextLayer from "./layers/Text.js";
import { Player } from "./traits/index.js";
import createCollisionLayer from "./layers/Collision.js";

async function main(canvas) {
  const ctx = canvas.getContext("2d");
  const audioCtx = new AudioContext();

  const entityFactory = await loadEntities(audioCtx);
  const font = await loadFont();

  const gameContext = {
    audioContext: audioCtx,
    videoContext: ctx,
    delta: null,
    entityFactory,
  };

  const loadLevel = await createLevelLoader(entityFactory);

  const sceneManager = new SceneManager();

  const mario = entityFactory.mario();
  makePlayer(mario, "MARIO");

  const inputRouter = setupKeyboard(window);
  inputRouter.addReceiver(mario);

  async function runLevel(name) {
    const loadingScreen = new Scene();
    loadingScreen.compositor.layers.push(createColorLayer("#000"));
    loadingScreen.compositor.layers.push(
      createTextLayer(font, `LOADING ${name}...`)
    );
    sceneManager.addScene(loadingScreen);
    sceneManager.runNext();

    const level = await loadLevel(name);

    level.events.listen(level.EVENT_TRIGGER, (spec, trigger, touched) => {
      if (spec.type === "goto") {
        for (const _ of findPlayers(touched)) {
          runLevel(spec.name);
          return;
        }
      }
    });

    const dashboardLayer = createDashboardLayer(font, level);
    const playerProgressLayer = createPlayerProgress(font, level);
    level.entities.add(mario);
    const playerEnv = createPlayerEnv(mario);
    level.entities.add(playerEnv);

    const waitScreen = new CompositionScene();
    waitScreen.compositor.layers.push(createColorLayer("#000"));
    waitScreen.compositor.layers.push(playerProgressLayer);
    waitScreen.compositor.layers.push(dashboardLayer);
    sceneManager.addScene(waitScreen);

    level.compositor.layers.push(dashboardLayer);
    level.compositor.layers.push(createCollisionLayer(level));
    sceneManager.addScene(level);
    sceneManager.runNext();
  }

  const timer = new Timer(1 / 60);
  timer.update = function update(deltaTime) {
    gameContext.delta = deltaTime;

    sceneManager.update(gameContext);
  };

  timer.start();
  runLevel("1-1");
}

const canvas = document.getElementById("screen");

main(canvas);
